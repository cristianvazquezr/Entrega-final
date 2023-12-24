import cartManager from "../dao/cartManager.js";
import ticketManager from "../dao/ticketManager.js";
import userMananger from "../dao/userMananger.js";

class ticketController{
    constructor(){
        this.TM= new ticketManager()
        this.UM= new userMananger()
        this.CM=new cartManager()
    }

    create=async (req, resp)=>{
        let idUser=req.user._id
        let user= await this.UM.getUserById(idUser)
        let idCart=await user[0].cart[0].cart._id
        let purchasedCart= await this.CM.buyCart(idCart)
        if (purchasedCart==false){
            resp.status(400).send({status:'error', message:'no se pudo realizar la compra'})
        }
        let purchasedProduct= await purchasedCart.purchaseProd
        let notPurchasedProduct= await purchasedCart.notPurchaseProd
        let newTicket=await this.TM.createTicket(purchasedProduct,notPurchasedProduct,idUser)
        //resp.redirect(`http://localhost:8080/purchase/${newTicket._id}`)
        resp.send({status:'OK', message:'Se realizo la compra con exito', idTicket:await newTicket._id})
    }
} 

export default ticketController