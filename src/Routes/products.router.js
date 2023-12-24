import { Router } from "express"
import ProductController from "../controllers/Products.controller.js"
import { authorization, authorizationAdminPremium } from "../utils.js"


//instancio la clase ProductController

const PC = new ProductController()

const productRouter=Router()

productRouter.get('/products',PC.getProducts )

productRouter.get('/products/:pid', PC.getProductById)

productRouter.post('/products/',PC.addProduct)

productRouter.put('/products/:pid', PC.updateProduct )

productRouter.delete('/products/:pid',PC.deleteProduct )

export default productRouter