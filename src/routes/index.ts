import express,{Request, Response, NextFunction} from 'express';

import {addcat, getCat, addcourse, getmessage} from '../controller/adminwork'
import { find, update, deleteUser, create, login, auth, updateAccount, blockAccount, unblockAccount, logout, sendMessage, deleteMessage} from '../controller/controller'
import {Adminlogin, AdminLogout, changePassword} from '../controller/admincontroller'
import {requireAuth, userAuth} from '../middlewares/authmiddleware'
import {allusers, pendUsers, deleteUsers, category, message, profile} from '../services/render'

import axios from 'axios';

const  router = express.Router();

/* GET home page. */
router.get('/', function(req:Request, res:Response, next:NextFunction) {
  res.render('index');
});
/**
 * 
 */
// get the register page 
router.get('/register', (req:Request, res:Response)=>{
 res.render('register')
})
/**
 * 
 */
// get the login page  
router.get('/sign-in',(req:Request, res:Response)=>{
 res.render('login')
})
/**
 * 
 */
// get the contact page 
 router.get('/contact-us',(req:Request, res:Response)=>{
  res.render('contact')
 })

 /**
 * 
 */
// get the about us page 
router.get('/about-us',(req:Request, res:Response)=>{
  res.render('about')
 })
 /**
 * 
 */
  function shuffle(array:any) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  router.get('/student/questions',(req:Request, res:Response)=>{
    //make a get from Question API
    axios.get('https://opentdb.com/api.php?amount=20&category=18&difficulty=medium&type=multiple')
    .then(function(response){
     let myArr: any = [];
      myArr = [...myArr, ...response.data.results];
            for (let i = 0; i < myArr.length; i++) {
              
              let result = response.data.results
              result[i].allOptions = [response.data.results[i].correct_answer, ...response.data.results[i].incorrect_answers]
              shuffle(result[i].allOptions)
         // console.log("Random", result)
           res.render('student/questions', {exam: result})
       }
     })
     .catch(err=>{
       res.send(err)
     })
  })
 
/**
 * 
 */


// Routes for the user dashboard 

// get the students index page 
router.get('/student/home', userAuth, (req:Request, res:Response)=>{
  res.render('student/index')
 })

 // get the students courses page 
router.get('/student/courses', userAuth,(req:Request, res:Response)=>{
  res.render('student/courses')
 })

  // get the students profile page 
router.get('/student/profile', userAuth,(req:Request, res:Response)=>{
  res.render('student/profile')
 })

  // get the students message page 
 router.get('/student/message', (req:Request, res:Response)=>{
  res.render('student/message')
 })

   // get the students written exam's page 
   router.get('/student/myexam', userAuth,(req:Request, res:Response)=>{
    res.render('student/myexam')
   })

    // get the students written exam's page 
    router.get('/student/take-exam',userAuth,(req:Request, res:Response)=>{
      res.render('student/take-exam')
     })


     // get the students result page 
    router.get('/student/results',userAuth,(req:Request, res:Response)=>{
      res.render('student/results')
     })

 //API USER routes
 router.post('/student/message',userAuth, sendMessage)
 
 router.get('/api/user/logout',logout);

 //registration route
 router.post('/api/users', create);

//login route
 router.post('/api/user', login);

 //message route
 //router.post('/api/user/message', message);
 router.get('/api/users', find)
 router.delete('/api/users/:id', deleteUser)
 router.put('/api/users/:id', update)
 router.get('/student/show-message', getmessage)
 router.get('/admin/add-cat', getCat)
 router.post('/admin/change-password', changePassword)



// API ADMIN ROUTE 
 router.post('/api/process', Adminlogin)




// Admin Route 
     router.get('/admin/login', (req:Request, res:Response)=>{
      res.render('adminlogin')
   })

    // Routes for the Admin dashboard 

// get the admin to logout 
router.get('/admin/logout',requireAuth, AdminLogout)

// get the Admin index page 
router.get('/admin/home', requireAuth, allusers)

 // get the Admin account pending page 
router.get('/admin/pending',requireAuth, pendUsers)

  // get the Admin account pending page 
router.get('/admin/deleted',requireAuth, deleteUsers)

   // get the Admin add course page 
router.get('/admin/course',requireAuth, category)

    // get the Admin View Message page 
router.get('/admin/messages',requireAuth, message)

     // get the Admin pending result page 
router.get('/admin/pending-results',requireAuth,(req:Request, res:Response)=>{
  res.render('admin/pending-results')
 })

     // get the Admin comfirmed result page 
router.get('/admin/comfirmed-results',requireAuth,(req:Request, res:Response)=>{
  res.render('admin/comfirmed-results')
 })

      // get the Admin profile page 
router.get('/admin/profile',requireAuth, profile)

//  get the admin to confirm an account 
router.get('/api/confirm',requireAuth,(req:Request, res:Response)=>{
  let id = req.query.id as string;
  updateAccount(req, res, id).then((user) => {
  }).catch((err) => {
    console.log(err)
  })
 })


 //  get the admin to Block an account 
router.get('/api/block',requireAuth,(req:Request, res:Response)=>{
  let id = req.query.id as string;
  blockAccount(req, res, id).then((user) => {
  }).catch((err) => {
    console.log(err)
  })
 })

  //  get the admin to Unblock an account 
router.get('/api/unblock',requireAuth,(req:Request, res:Response)=>{
  let id = req.query.id as string;
  unblockAccount(req, res, id).then((user) => {
  }).catch((err) => {
    console.log(err)
  })
 })

  //  get the admin to Delete a message 
router.get('/api/unshow',requireAuth,(req:Request, res:Response)=>{
  let id = req.query.id as string;
  deleteMessage(req, res, id).then((user) => {
  }).catch((err) => {
    console.log(err)
  })
 })

 router.post('/admin/add-cat', addcat)

 router.post('/admin/add-course', addcourse)

export default router;
