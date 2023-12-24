import { Router } from "express";
import messageController from "../controllers/message.controller.js";

let MC = new messageController()

const messageRouter=Router()

messageRouter.get('/message', MC.getMessage )

messageRouter.post('/message', MC.createMessage )

export default messageRouter