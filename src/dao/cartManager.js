import ProductManager from './ProductManager.js'
import { cartModel } from './models/cart.model.js'

let PM=new ProductManager()

class cartManager{

    constructor(){
        this.cart=''
    }

    //obtener todos los carritos
    async getCarts(){
        let listaCarritos=[]
        try{
            listaCarritos = await cartModel.find().lean()
        }
        catch(err){
            console.log("fallo la consulta " + err)
        }
        return await listaCarritos
        
    }

    // crar nuevo carrito

    async createCart(){

        //creo un objeto nuevo con atributos nuevos
        let carrito= {products:[]}      
        let  newCarrito= await cartModel.create(carrito)
        return newCarrito
        

    }

    //buscar carrito por ID

    async getCartById(id){

    // llamo la funcion para obtener los carritos y buscar por id
     try{
        const cartBuscado= await  cartModel.find({_id:id})
        return (await cartBuscado)
     }catch(err){
        console.log("Not found " + err)
        return (false)
     }
    }

    //eliminar un producto del carrito

    async deleteProduct(cid,pid){
        //accedo a la lista de carritos para ver si existe el id buscado
        const cartId= await this.getCartById(cid)
        // como me traer un array en vez del objeto directamente, tomo la posicion 0 para tener el objeto
        let objCart = await cartId[0]
        if (objCart){
            //busco en el carrito el producto a eliminar y valido que exista
            const productId= await objCart.products.find(product=>product.product._id==pid)
            if(productId){
                let arrayProducts=await objCart.products
                let newArrayProducts=await arrayProducts.filter(product=>product.product._id!=pid)
            
                if (newArrayProducts){
                    await cartModel.updateOne({_id:cid},{products:newArrayProducts})
                    return ('productoEliminado')
                }

                
            }else{
                return ('pidNotFound')
            }
        }else{
            return ("cidNotFound")
        }

    }  

    //agregar un producto al carrito

    async addProduct(cid,pid, quantity,email){
        //accedo a la lista de productos para ver si existe el id buscado
        const productId= await PM.getProductById(pid)
        const owner=await productId[0]
        const cartId= await this.getCartById(cid)
        const quantityAdd = quantity ? quantity : 1

        // como me traer un array en vez del objeto directamente, tomo la posicion 0 para tener el objeto
        let objCart = await cartId[0]
        if (objCart){
            if(await productId){
                if(await owner.owner!=email){
                    let arrayProducts=await objCart.products
                    let positionProduct=await arrayProducts.findIndex(product=>product.product._id==pid)
            
                    if (positionProduct!=-1){
                        arrayProducts[await positionProduct].quantity=arrayProducts[positionProduct].quantity+quantityAdd
                    }
                    else{
                        arrayProducts.push({product:pid,quantity:quantityAdd})
                    }
                    await cartModel.updateOne({_id:cid},{products:arrayProducts})
                    return ('productoAgregado')
                }else{
                    return('sameOwner')
                }
                
                
            }else{
                return ('pidNotFound')
            }
        }else{
            return ("cidNotFound")
        }

    }  

    //actualizar la cantidad de un producto en el carrito

    async updateProduct(cid,pid, quantity){
        //accedo a la lista de carritos para ver si existe el id buscado
        const cartId= await this.getCartById(cid)
        const quantityAdd = quantity ? quantity : 1
        // como me traer un array en vez del objeto directamente, tomo la posicion 0 para tener el objeto
        let objCart = await cartId[0]
        if (objCart){
            const productId= await objCart.products.find(product=>product.product._id==pid)
            if(productId){
                let arrayProducts=await objCart.products
                let positionProduct=await arrayProducts.findIndex(product=>product.product._id==pid)
                //actualizo la cantidad para el id del producto que quiero actualizar
                arrayProducts[await positionProduct].quantity=quantityAdd
                await cartModel.updateOne({_id:cid},{products:arrayProducts})
                return ('productoActualizado')
                
            }else{
                return ('pidNotFound')
            }
        }else{
            return ("cidNotFound")
        }

    }  

    //eliminar todos los produtos del carrito

    async deleteTotalProduct(cid){
        //accedo a la lista de carritos para ver si existe el id buscado
        const cartId= await this.getCartById(cid)
        // como me traer un array en vez del objeto directamente, tomo la posicion 0 para tener el objeto
        let objCart = await cartId[0]

        if(objCart){
            await cartModel.updateOne({_id:cid},{products:[]})
            return ("productosEliminado")
        }else{
            return ("cidNotFound")
        }
    }

    //actualizar carrito 

    async updateCart(cid, products){

        const cartId= await this.getCartById(cid)
        // como me traer un array en vez del objeto directamente, tomo la posicion 0 para tener el objeto
        let objCart = await cartId[0]
        if(objCart){
            await cartModel.updateOne({_id:cid},{products:products})
            return ("carritoActualizado")
        }else{
            return ("cidNotFound")
        }
    
            
    }

    async buyCart (cid){

        const carrito = await this.getCartById(cid)
        const objectCart= await carrito[0]
        if (carrito == false){
           return false
        }else{
            let listaCompra=[]
            let listaNoCompra=[]
            await objectCart.products.map((data)=>{
                if (data.product.stock > data.quantity){
                    listaCompra.push(data)
                    let newStock=data.product.stock-data.quantity
                    PM.updateStock(data.product._id,newStock)
                }else{
                    listaNoCompra.push(data)
                }
            })
            await this.updateCart(cid, listaNoCompra)
            return ({purchaseProd:listaCompra, notPurchaseProd:listaNoCompra})
        }
        
        
    }
    

}


export default cartManager