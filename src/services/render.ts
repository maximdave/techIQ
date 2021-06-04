import {Request, Response} from 'express';
import axios from 'axios';

const test = (res:Response, route:string) => {
    axios.get('http://localhost:8000/api/users')
    .then(function(response){
        res.render(`admin/${route}`, {user:response.data, admindetails:res.locals.user})
    })
    .catch(err =>{
        res.send(err)
    })
}
const catgo = (res:Response, route:string) => {
    axios.get('http://localhost:8000/admin/add-cat')
    .then(function(response){
        res.render(`admin/${route}`, {cats:response.data, admindetails:res.locals.user})
    })
    .catch(err =>{
        res.send(err)
    })
}

const showmessage = (res:Response, route:string) => {
    axios.get('http://localhost:8000/student/show-message')
    .then(function(response){
        console.log(res.locals.user)
        res.render(`admin/${route}`, {message:response.data, admindetails:res.locals.user})
    })
    .catch(err =>{
        res.send(err)
    })
}

const allusers = (req:Request, res:Response)=>{
    test(res, 'index')
}

const pendUsers = (req:Request, res:Response)=>{
    test(res, 'pending')
}

const deleteUsers = (req:Request, res:Response)=>{
    test(res, 'deleted')
}
const category = (req:Request, res:Response)=>{
    catgo(res, 'course')
}
const message = (req:Request, res:Response)=>{
    showmessage(res, 'messages')
}

const profile = (req:Request, res:Response)=>{
    test(res, 'profile')
}

export{allusers, pendUsers, deleteUsers, category, message, profile}