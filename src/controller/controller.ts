import userDB from '../model/model';
import messageDB from '../model/messagemodel'
import {NextFunction, Request, Response} from 'express'
import router from '../routes/index';
import { HttpError } from 'http-errors';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

function checkLogin(req:Request, res:Response, next:NextFunction){
    res.redirect('/student/home')
}




const JWT_SECRET = 'retvdyduurytkjgkgitn453g36eh7rhri@^jhk*77$%$%^%4hhjjuud'

const create = async (req: Request, res: Response) => {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    const email = req.body.email;
    const address =  req.body.address
    const phone = req.body.phone
    const name = req.body.name

    if(password.length < 5){
        res.status(400)
        req.session.message = {
            type: 'danger',
            intro: 'PASSWORD ERROR! ',
            message: 'Password too short, Should be at least 5 characters'
        }
        res.redirect('/register')
    }else if(password !== confirmpassword){
        res.status(400)
        req.session.message = {
            type: 'danger',
            intro: 'PASSWORD ERROR! ',
            message: 'Passwords Do Not Match'
        }
        res.redirect('/register')
    }

    //new user
    const user = new userDB({
        name: name,
        email: email,
        address: address,
        phone: phone,
        category: req.body.category,
        confirmpassword: confirmpassword,
        password: await bcrypt.hash(req.body.password, 10),
        status: 'Active',
        confirm: 'pending',
        dateOfEntry: new Date(),
        
    })
    //save user in database
    user.save(user)
    .then((data: any)=>{
        res.status(200)
        req.session.message = {
            type: 'success',
            intro: 'SUCCESSFUL! ',
            message: 'You have been successfully registered, Please Login'
        }
        res.status(200).redirect('/sign-in');
    })
    .catch((error:HttpError)=>{
        if(error.code === 11000){
            req.session.message = {
                type: 'danger',
                intro: 'EMAIL ERROR! ',
                message: 'Email Aready Exist'
            }
            res.redirect('/register')
        }
    })
}

const auth = async(req:Request, res:Response, next:NextFunction) =>{
    const token =req.headers.authorization
    if (token) {
        const tokenValue = token.split(' ')[1]
        const decoded:any = jwt.verify(tokenValue, JWT_SECRET)
        const user = await userDB.findOne({_id: decoded.id})
        if(!user) {
            throw new Error('Can....')
        } else {
            next()
        }
    }
}
const login = async (req:Request, res:Response) =>{
    const { email, password } = req.body;
    const user = await userDB.findOne({email}).lean();
    const pass = user ? user.password : ""
    const result = await bcrypt.compare(password, pass);

    if(!user || result == false){
        res.status(400)
        req.session.message = {
            type: 'danger',
            intro: 'LOGIN ERROR! ',
            message: 'Invalid Username or Password'
        }
        res.redirect('/sign-in');
    }else if(result){
        const act = user.status
        const com = user.confirm
        if(act == "Active" && com == "Confirmed"){
            let max = 60;
            const token = jwt.sign({
                email: user.email,
                id: user._id
            }, JWT_SECRET,
            {
                expiresIn: max
            });
            
            res.cookie('techIQ', token,{httpOnly: true, maxAge: max * 1000})
            res.status(200)
            res.redirect('/student/home');
            req.session.message = {
                type: 'success',
                intro: 'SUCCESSFUL! ',
                message: 'Login successful'
            }
        }else if(act == "Active" && com == "pending"){
            res.status(300)
            req.session.message = {
                type: 'danger',
                intro: 'Pending Account',
                message: 'This account has not been confirmed by the admin'
            }
            res.redirect('/sign-in');
        }else{
            res.status(300)
            req.session.message = {
                type: 'danger',
                intro: 'Blocked Account',
                message: 'This account has been Blocked by the admin'
            }
            res.redirect('/sign-in');
        }
    }
}

const find = (req: Request, res: Response) => {
    //Get user by id
    if (req.query.id) {
        const id = req.query.id;
        userDB.findById(id)
        .then((data:any) => {
            if(!data){
                res.status(400).send({message: `Can not found user with id =  ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch((error:HttpError)=>{
            res.status(500).send({message : `Error retriving user with id = ${id}`})
        })
    } else {
        //Get all users
        userDB.find()
        .then((user:any) => {
            res.send(user)
        })
        .catch((error:HttpError)=>{
            res.status(500).send({message : error.message || "Error occured while retriving user information"})
        })
    }
}

const update = (req: Request, res: Response) => {
    if(!req.body){
       return res.status(400).send({message: "Data to update can not be empty!"})
    }

    const id = req.params.id;
    userDB.findByIdAndUpdate(id, req.body, {useFindAndModify:false})
    .then((data:any) => {
        if(!data){
            res.status(400).send({message: `Can not update user with ${id}. Maybe user not found!`})
        }else{
            res.send(data)
        }
    })
    .catch((error:HttpError)=>{
        res.status(500).send({message : error.message || "Error Update user information"})
    })
}

const deleteUser = (req: Request, res: Response) => {
    const id = req.params.id;
    userDB.findByIdAndDelete(id)
    .then((data:any) => {
        if(!data){
            res.status(400).send({message: `Can not delete user with ${id}. Maybe id is wrong!`})
        }else{
            res.send({message: 'User deleted successfully'})
        }
    })
    .catch((error:HttpError)=>{
        res.status(500).send({message : `Could delete User with id ${id}`})
    })
}
const updateAccount = async (req: Request, res: Response, id: string) => {
    const user = await userDB.findById(id);
    user.confirm = 'Confirmed';
    user.save()
    res.redirect('/admin/home');
}
const sendMessage = async(req:Request | any, res:Response) =>{
    
  let user = res.locals.user;
  let name = user.name;
  let { subject, message} = req.body;
  console.log(name);
  const data = new messageDB({
      name: name,
      subject: subject,
      message: message,
      status: "Active",
      dateOfEntry: new Date()
  })

  data.save(data)
  .then(
    (output: any)=>{
        res.status(200)
        req.session.message = {
            type: 'success',
            intro: 'SUCCESSFUL! ',
            message: 'Message sent successfully'
        }
        res.status(200).redirect('/student/message');
    } 
  )
  .catch((error: HttpError)=>{
    if(error){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR! ',
            message: 'Failed to send message'
        }
        res.redirect('/student/message')
    }

})

}
const logout = (req:Request, res:Response) =>{
    res.cookie('techIQ', '', {maxAge: 1})
    req.session.message = {
        type: 'success',
        intro: 'Logout',
        message: 'successfull'
    }
    res.redirect('/sign-in')
}

const blockAccount = async (req: Request, res: Response, id: string) => {
    const user = await userDB.findById(id);
    user.status = 'Blocked';
    user.save()
    res.redirect('/admin/deleted');
}

const unblockAccount = async (req: Request, res: Response, id: string) => {
    const user = await userDB.findById(id);
    user.status = 'Active';
    user.save()
    res.redirect('/admin/home');
}

const deleteMessage = async (req: Request, res: Response, id: string) => {
    const user = await messageDB.findById(id);
    user.status = 'Deleted';
    user.save()
    res.redirect('/admin/messages');
}


export {find, update, deleteUser, create, logout, login, auth, checkLogin, updateAccount, blockAccount, unblockAccount, sendMessage, deleteMessage}

