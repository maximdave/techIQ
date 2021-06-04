import Mongoose from "mongoose";

let database : Mongoose.Connection;
export const connect = () => {
  // add your own uri below
  const uri = "mongodb+srv://maximdave:maximdave93@week-8-project.9vl0n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  if (database) {
    return;
  }
  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  database = Mongoose.connection;
  database.once("open", async () => {
    console.log("Connected to database");
  });
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};