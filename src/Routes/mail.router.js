import { Router } from "express";
import mailController from "../controllers/email.controller.js";

const MC=new mailController

const mailRouter=Router()

mailRouter.get('/email', MC.sendMail )
mailRouter.get('/attachments', MC.sendMailWithAttachments)

export default mailRouter