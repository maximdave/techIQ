import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    course:{
        type: String,
        required: true,
        unique: true
    },
  dateOfEntry: {
    type: Date,
    default: new Date()
  },
status:String,
category:String,

}, {collection:'course'});

const courseDB = mongoose.model('course', courseSchema);

export default courseDB;