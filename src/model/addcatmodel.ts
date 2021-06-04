import mongoose from "mongoose";
const CatSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        unique: true
    },
  dateOfEntry: {
    type: Date,
    default: new Date()
  },
status:String,

}, {collection:'category'});

const categoryDB = mongoose.model('category', CatSchema);

export default categoryDB;