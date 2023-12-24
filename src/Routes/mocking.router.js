import { Router } from "express";
import mockingController from "../controllers/mocking.controller.js";

const mockingRouter = Router()
const MC= new mockingController()

mockingRouter.post('/mockingproducts',MC.createProducts)


export default mockingRouter