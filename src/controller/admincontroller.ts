import AdminDB from '../model/adminmodel';
import {NextFunction, Request, Response} from 'express'
import router from '../routes/index';
import { HttpError } from 'http-errors';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = 'retvdyduurytkjgkgitn453g36eh7rhri@^jhk*77$%$%^%4hhjjuud'

// getting the value of 3 days in seconds 
const maxAge=  60*60;
const createToken = (id:string) =>{
    return jwt.sign({ id }, JWT_SECRET,{
        expiresIn:maxAge
    })
}
const Adminlogin = async (req:Request, res:Response) =>{
    const { email, password } = req.body;
    const user = await AdminDB.findOne({email}).lean();
    const pass = user ? user.password : ""
    const result = await bcrypt.compare(password, pass);

    if(!user || result == false){
        res.status(400)
        req.session.message = {
            type: 'danger',
            intro: 'LOGIN ERROR! ',
            message: 'Invalid Email or Password'
        }
        res.redirect('/admin/login');
    }else if(result){
        const status = user.status
        if(status == "Active"){
            const token = createToken(user._id)
            res.cookie('techIQ', token,{httpOnly: true, maxAge: maxAge * 1000})
            res.status(200)
            res.redirect('/admin/home');
        }else{
            res.status(300)
            req.session.message = {
                type: 'danger',
                intro: 'Blocked Account',
                message: 'This account has been Blocked'
            }
            res.redirect('/admin/login');
        }
    }
}
const AdminLogout = (req:Request, res:Response) =>{
    res.cookie('techIQ', '', {maxAge: 1})
    req.session.message = {
        type: 'success',
        intro: 'Logout',
        message: 'successfull'
    }
    res.redirect('/admin/login')
}
const changePassword = async (req:Request, res:Response) =>{
    const {userid, oldpass, old, new1, new2 } = req.body;
    if(new1 != new2){
        res.status(300)
            req.session.message = {
                type: 'danger',
                intro: 'Error!!',
                message: 'The Password Do Not Match'
            }
            res.redirect('/admin/profile');
    }else{
        const result = await bcrypt.compare(oldpass, old);
        if(result == false){
            res.status(400)
            req.session.message = {
                type: 'danger',
                intro: 'Error! ',
                message: 'Invalid / Incorrect Password'
            }
            res.redirect('/admin/profile');
        }else{
            const hashnew1 = await bcrypt.hash(new1, 10)
            const user = await AdminDB.findById(userid);
            user.password = hashnew1;
            user.save()
            res.status(400)
            req.session.message = {
                type: 'success',
                intro: 'Good! ',
                message: 'password changed successfully'
            }
            res.redirect('/admin/profile');
        }
    }
}

export {Adminlogin, AdminLogout, changePassword}

// $2b$10$9gQ7LRoK8kQw8GAiU8X5o.WyFEns2/91bU1QJA7ju5SaWXjNJ2oKK