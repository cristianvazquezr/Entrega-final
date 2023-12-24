import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    usuario:String,
    mensaje:String,

})

export const messageModel=mongoose.model("message", messageSchema)