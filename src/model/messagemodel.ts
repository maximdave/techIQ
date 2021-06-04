import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    subject: String,
    message: String,
    status:String,
    dateOfEntry: {
    type: Date,
    default: new Date()
  }
}, {collection:'feedback'});

const messageDB = mongoose.model('messagedb', messageSchema);

export default messageDB;

