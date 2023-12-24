import { now } from "mongoose";
import { ticketModel } from "./models/ticket.model.js";
import userMananger from "./userMananger.js";

const UM=new userMananger()

class ticketManager{
    constructor(){

    }

    async createTicket(purchaseProducts,notPurchaseProducts,idClient){
        let client= await UM.getUserById(idClient) || null
        
        if (!client){
            return false
        }
        else{
 
            let date=new Date()
            let fecha =`${date.toLocaleDateString()}`
            //para generar el numero aleatorio debo chequear que no exista en la lista de code de los ticket.
            let code = Math.floor(Math.random() * 100000000000000000)
            let clientList=await ticketModel.find().lean()
            let codeList=clientList.map((element)=>{
                element.code
            })

            while(codeList.includes(code)){
                code = Math.floor(Math.random() * 100000000000000000)
            }

            const newTicket= await ticketModel.create({purchase_date:fecha,code:code,purchesedProducts:purchaseProducts,notPurchesedProducts:notPurchaseProducts,client:idClient})
            return newTicket
        }
    }

    async getTicketById(tid){
        const ticket = await ticketModel.findOne({_id:tid}).lean() || null

        if(ticket){
            return await ticket
        }
        else{
            return false
        }
    }

}

export default ticketManager