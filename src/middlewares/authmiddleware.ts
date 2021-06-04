import AdminDB from '../model/adminmodel';
import userDB from '../model/model'
import {NextFunction, Request, Response} from 'express'
import jwt from "jsonwebtoken"

const JWT_SECRET = 'retvdyduurytkjgkgitn453g36eh7rhri@^jhk*77$%$%^%4hhjjuud'

const requireAuth = (req:Request, res:Response, next:NextFunction)=>{
    const token = req.cookies.techIQ

    // check if the token exist 
    if(token){
        jwt.verify(token, JWT_SECRET, async(err:any, decodedToken:any)=>{
            if(err){
                res.status(400)
                req.session.message = {
                    type: 'danger',
                    intro: 'ACCESS ERROR! ',
                    message: 'Please Do Login Here'
                }
                res.redirect('/admin/login')
            }else{
                let admin = await AdminDB.findById(decodedToken.id)
                res.locals.user = admin
                // console.log(admin)
                next()
            }
        })
    }else{
        res.status(400)
        req.session.message = {
            type: 'danger',
            intro: 'ACCESS ERROR! ',
            message: 'Please Do Login Here'
        }
        res.redirect('/admin/login')
    }
}
const userAuth = (req:Request | any, res:Response, next:NextFunction)=>{
    const token = req.cookies.techIQ

    // check if the token exist 
    if(token){
        jwt.verify(token, JWT_SECRET, async(err:any, data:any)=>{
            if(err){
                res.status(400)
                req.session.message = {
                    type: 'danger',
                    intro: 'ACCESS ERROR! ',
                    message: 'Please Do Login Here'
                }
                res.redirect('/sign-in')
            }else{
                let user = await userDB.findById(data.id)
                res.locals.user = user;
                // console.log(res.locals.user)
                next()
            }
        })
    }else{
        res.status(400)
        req.session.message = {
            type: 'danger',
            intro: 'ACCESS ERROR! ',
            message: 'Please Do Login Here'
        }
        res.redirect('/sign-in')
    }
}
export {requireAuth, userAuth}