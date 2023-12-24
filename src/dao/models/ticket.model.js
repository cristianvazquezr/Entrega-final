import mongoose from "mongoose";


const ticketSchema=new mongoose.Schema({
  code:String,
  purchase_date:String,
 purchesedProducts:{
    type:[
        {
          product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"products"
          },
          quantity:Number 
        }
    ]
 },
 notPurchesedProducts:{
    type:[
        {
          product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"products"
          },
          quantity:Number 
        }
    ]
 },
 client:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
 }
})

ticketSchema.pre('find',function(){

  this.populate("purchesedProducts.product")
  this.populate("notPurchesedProducts.product")
  this.populate("client")
  
})

ticketSchema.pre('findOne',function(){

    this.populate("purchesedProducts.product")
    this.populate("notPurchesedProducts.product")
    this.populate("client")
    
})


export const ticketModel=mongoose.model("tickets", ticketSchema)  