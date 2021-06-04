import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
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
  dateOfEntry: {
    type: Date,
    default: new Date()
  },
  password:{
    type: String,
    required: true
},
status:String,

}, {collection:'admindb'});

const AdminDB = mongoose.model('admindb', AdminSchema);

export default AdminDB;