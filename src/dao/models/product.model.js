import mongoose from "mongoose";
import  MongoosePaginate from "mongoose-paginate-v2";

const productSchema=new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    thumbnail:String,
    code:Number,
    stock:Number,
    category:String,
    status:Boolean,
    owner:{type: String, default:'admin'}

})


productSchema.plugin(MongoosePaginate)

export const productModel=mongoose.model("products", productSchema)