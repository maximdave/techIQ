import categoryDB from '../model/addcatmodel';
import messageDB from '../model/messagemodel';
import courseDB from '../model/addcoursemodel';
import { Request, Response } from 'express'
import { HttpError } from 'http-errors';

const addcat = async (req: Request, res: Response) => {
    const category = await req.body.category;

    if(category.length < 5){
        res.status(400)
        req.session.message = {
            type: 'danger',
            intro: 'Category Error ',
            message: 'category Name too short, Should be at least 5 characters'
        }
        res.redirect('/admin/course')
    }else{
        //new category
        const user = new categoryDB({
            category: category,
            status: 'Active',
            dateOfEntry: new Date(),
        
        })
        //save user in database
        user.save(user)
        .then((data: any)=>{
            res.status(200)
            req.session.message = {
                type: 'success',
                intro: 'SUCCESSFUL! ',
                message: 'You have been successfully Added a category'
            }
            res.status(200).redirect('/admin/course');
        })
        .catch((error:HttpError)=>{
            if(error.code === 11000){
                req.session.message = {
                    type: 'danger',
                    intro: 'Error!! ',
                    message: 'Category name already used'
                }
                res.redirect('/admin/course')
            }
        })
    }
}

const getCat = async (req:Request, res:Response) => {
    const cats = await categoryDB.find()
    res.status(200).json(cats)
}

const getmessage = async (req:Request, res:Response) => {
    const message = await messageDB.find()
    res.status(200).json(message)
}

const addcourse = async (req: Request, res: Response) => {
    const course = await req.body.course;
    const category = await req.body.category;

    if(course.length < 5){
        res.status(400)
        req.session.message = {
            type: 'danger',
            intro: 'Course Error ',
            message: 'Course Name too short, Should be at least 5 characters'
        }
        res.redirect('/admin/course')
    }else{
        //new category
        const user = new courseDB({
            course: course,
            category: category,
            status: 'Active',
            dateOfEntry: new Date(),
        
        })
        //save user in database
        user.save(user)
        .then((data: any)=>{
            res.status(200)
            req.session.message = {
                type: 'success',
                intro: 'SUCCESSFUL! ',
                message: 'You have been successfully Added a new course'
            }
            res.status(200).redirect('/admin/course');
        })
        .catch((error:HttpError)=>{
            if(error.code === 11000){
                req.session.message = {
                    type: 'danger',
                    intro: 'Error!! ',
                    message: 'Course already exist in the database'
                }
                res.redirect('/admin/course')
            }
        })
    }
}

export {addcat, getCat, addcourse, getmessage}