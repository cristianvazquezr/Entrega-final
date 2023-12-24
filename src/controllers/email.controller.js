import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:config.mailingUser,
        pass:config.mailingPass
    }
})

transporter.verify(function(err,succes){
    if(err){
        console.error(err)
    }else{
        console.log("servidor listo para enviar correo")
    }
})  

class mailController{
    constructor(){
    }
    sendMail=async (req, resp)=>{
        let userTo=req.user.email
        const user=req.params.email
        try{let result= await transporter.sendMail({
            from:'vazquezcristianr@gmail.com',
            to:userTo,
            subject:"Restablecer contrasena",
            html:`
            <div>
                <h1>PARA RESTABLECER SU CONTRASENA INGRESE AL SIGUIENTE LINK: </h1>
                <a href="http://localhost:8080/recuperar"> CLICK AQUI </a>
            </div>
            `,
            attachments:[]
        }, (err, info)=>{
            if(err){
                console.error(err)
                resp.status(400).send({status:'error', message:err})
            }else{
                resp.cookie('cambiarPass','puede cambiar el pass', {maxAge:36000000}).send({status:'Proceso exitoso', message:info})
                console.log("message sent: %s" + info.messageId)
            }
            
        })
        } catch(error){
            console.log(error)
            resp.status(500).send({message:'no se pudo enviar el correo desde: ' + config.mailingUser, error:error})
        }  
    }
    sendMailWithAttachments=async (req, resp)=>{

        resp.send('a implementar')
    }
}

export default mailController