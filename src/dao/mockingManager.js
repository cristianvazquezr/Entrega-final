import { fakerES} from "@faker-js/faker"
import { productModel } from "./models/product.model.js"

class mockingManger{
    constructor(){}

    async generateProducts(){
        
        for (let i=0; i<=100; i++){
            let title=fakerES.commerce.productName()
            let  description=fakerES.commerce.productDescription()
            let category=fakerES.commerce.productAdjective() 
            let price=fakerES.commerce.price()
            let thumbnail=fakerES.image.urlPicsumPhotos()
            let code=fakerES.string.numeric(10)
            let stock=fakerES.string.numeric(2)
    
            let producto1= {title:title,description:description,price:price,thumbnail:thumbnail,code:code,stock:stock, category:category, status:true}
            await productModel.create(producto1)

        }
        
        return true
    }
}

export default mockingManger