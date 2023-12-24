import ProductManager from "../dao/ProductManager.js"
import cartManager from "../dao/cartManager.js"
import { userModel } from "../dao/models/user.model.js"
import ticketManager from "../dao/ticketManager.js"

class viewsController{
    constructor(){
    //instancio la clase Productmanager y cart
    this.PM = new ProductManager()
    this.CM = new cartManager()
    this.TM= new ticketManager()
    }
    home = async (req,resp)=>{
        resp.render("home",{
            style:"style.css"
        })
    }
    products = async (req,resp)=>{

        let userLogged=req.user.first_name   
        let productos=await this.PM.getProducts(req.query)
        resp.render("products",{
            role:req.user.role,
            product:productos,
            user:userLogged,
            style:"../../css/style.css",
            idUser:req.user._id,
        })
    }
    realTimeProducts = async (req,resp)=>{

        let userLogged=req.user.first_name
        let emailLogged=req.user.email
        resp.render("realTimeProducts",{
            role:req.user.role,
            user:userLogged,
            email:emailLogged,
            style:"style.css",
            idUser:req.user._id,
        })
    }

    editUser = async (req,resp)=>{

        let userLogged=req.user.first_name
        let emailLogged=req.user.email
        resp.render("editUsers",{
            role:req.user.role,
            user:userLogged,
            email:emailLogged,
            style:"style.css",
            idUser:req.user._id,
        })
    }

    chat = async (req,resp)=>{

        let userLogged=req.user.first_name
    
        resp.render("chat",{
            role:req.user.role,
            user:userLogged,
            style:"../../css/style.css",
            idUser:req.user._id,
        })
    }
    cart = async (req,resp)=>{

        let userLogged=req.user.first_name
        let cid=req.params.cid
        let respuesta=await this.CM.getCartById(cid)
        resp.render("cartId",{
            role:req.user.role,
            user:userLogged,
            productos:respuesta[0].products,
            style:"../../css/style.css",
            idUser:req.user._id,
        })
    }
    login=async (req,resp)=>{
        resp.render("login",{
            style:"../../css/style.css"
        })
    }
    register=async (req,resp)=>{
        resp.render("register",{
            style:"../../css/style.css",
        })
    }
    profile=async (req,resp)=>{

        let userLogged=req.user.first_name
    
        resp.render("profile",{
            user:userLogged,
            style:"../../css/style.css"
        })
    }

    restore=async (req,resp)=>{
        resp.render("restore",{
            style:"../../css/style.css"
        })
    }

    recuperar=async (req,resp)=>{

        let userLogged=req.user.first_name 
        let emailLogged=req.user.email
        resp.render("recuperar",{
            style:"../../css/style.css",
            role:req.user.role,
            user:userLogged,
            email:emailLogged,
            idUser:req.user._id,
        })
    }

    emailRecuperarPass=async (req,resp)=>{

        let userLogged=req.user.first_name 
        let emailLogged=req.user.email
        resp.render("emailRecuperarPass",{
            style:"../../css/style.css",
            role:req.user.role,
            user:userLogged,
            email:emailLogged,
            idUser:req.user._id,
        })
    }

    uploader=async(req,resp)=>{

        //estado documentos

        let searchedUser=await userModel.findOne({_id:req.user._id}).lean()
        
        let identification='none'
        let location='none'
        let account='none'
        try{
            let documentStatus=searchedUser.documentStatus
            if(documentStatus.location==true){
                location="flex"
            }
    
            if(documentStatus.account==true){
                account="flex"
            }
    
            if(documentStatus.identification==true){
                identification="flex"
            }
        }catch(err){
            console.log("aun no existen documentos para el usuario")
        }
        

        resp.render("documents",{
            style:"../../css/style.css",
            role:req.user.role,
            user:req.user.first_name,
            name:req.user.first_name,
            lastname:req.user.last_name,
            email:req.user.email,
            age:req.user.age,
            role:req.user.role,
            idUser:req.user._id,
            identification:identification,
            account:account,
            location:location
        })

    }

    purchase = async (req,resp)=>{

        let nameLogged=req.user.first_name
        let lastNameLogged=req.user.last_name
        let tid=req.params.tid
        let respuesta=await this.TM.getTicketById(tid)
        resp.render("ticket",{
            user:nameLogged,
            role:req.user.role,
            fecha:respuesta.purchase_date,
            nameClient:nameLogged,
            lastNameCLient:lastNameLogged,
            idBuy:respuesta.code,
            productos:respuesta.purchesedProducts,
            sinStock:respuesta.notPurchesedProducts,
            style:"../../css/style.css",
            idUser:req.user._id,
        })
    }

}

export default viewsController