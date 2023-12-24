import mongoose from "mongoose";
import  MongoosePaginate from "mongoose-paginate-v2";


const userSchema=new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{
        type:String,
        unique:true
    },
    age:Number,
    password:String,
    role:{
        type:String,
        default:"user",
        enum:['user','admin','premium']
    },

    cart:{
        type:[
            {
                cart:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'carts'
                }
            }
        ]
       
    },
    documents:{
        type:[
            {
                name:String,
                reference:String,
                documentType:String,
            }
        ]

    },
    documentStatus:{
        identification:{
            type:Boolean,
            default:false
        },
        location:{
            type:Boolean,
            default:false
        },
        account:{
            type:Boolean,
            default:false
        }
    },
    last_connection:String,
})

userSchema.pre('find',function(){

    this.populate("cart.cart")
    
})

userSchema.plugin(MongoosePaginate)

export const userModel=mongoose.model("users", userSchema)

