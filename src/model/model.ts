import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
  address: String,
  phone: String,
  category: String,
  dateOfEntry: {
    type: Date,
    default: new Date()
  },
  password:{
    type: String,
    required: true
},
status:String,
confirm:String
});

const userDB = mongoose.model('userdb', UserSchema);

export default userDB;