import fs from 'fs'
import ProductManager from './ProductManager.js'


let PM= new ProductManager('./productos.json')


class cartManager{

    constructor(path){
        this.path=path
        this.cart=''
    }

    async getCarts(){
        let listaCarritos=[]
        try{
            listaCarritos = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        }
        catch(err){
            console.log("No existe el archivo")
        }
        return await listaCarritos
        
    }


    async createCart(){
        //incremento en 1 el valor de ID
        let  id= this.getCarts().then(resultado=>resultado.length)==undefined? 1:this.getCarts().then(resultado=>resultado.length+1);
        //creo un objeto nuevo con atributos nuevos
        let carrito= {id:await id, productos:[]}      

        //valido si existe el archivo sino indico que sera creado.
         const listaCart = async ()=>{
            let listaCarrito=[]
            try{
                listaCarrito = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            }
            catch(err){
                console.log("No existe el archivo, sera creado")
            }
            return listaCarrito
        }

        const listaCarritos= await listaCart()
        await fs.promises.writeFile(this.path,JSON.stringify([...listaCarritos, carrito]))
        return true
        

    }

    async getCartById(id){

        // llamo la funcion para obtener los productos y buscar por id
     
        const cartBuscado=this.getCarts().then(resultado=>resultado.find(element=>element.id==id))
        if(await cartBuscado!=undefined){
            return (await cartBuscado)
        }
        else{
           console.log("Not found")
           return (false)
        }
    }

    async addProduct(cid,pid){
        //accedo a la lista de productos para ver si existe el id buscado

        const productId= await PM.getProductById(pid)
        const cartId= await this.getCartById(cid)
        if (cartId){
            if(productId){
                //genero la lista modificada y rescribo el archivo.
                let listaModificada=await this.getCarts().then(resultado=>resultado.map((elemento)=>{
                    console.log(elemento)
                    if(cid==elemento.id){
                        // creo una variable para dejar una marca de que el producto ya existia y se actualizo la cantidad para no pushearlo
                        let marcaActualizado=false
                        elemento.productos.map(producto => {
                            if(producto.id==pid){
                                producto.cantidad=producto.cantidad+1
                                marcaActualizado=true
                            }                            
                        
                        })
                        if (!marcaActualizado){
                            elemento.productos=[...elemento.productos,{'id':pid,'cantidad':1}]
                        }
                    }
                    
                    return elemento
                }))
                await fs.promises.writeFile(this.path,JSON.stringify(listaModificada))
                return ('productoAgregado')
            }else{
                return ('pidNotFound')
            }
        }else{
            return ("cidNotFound")
        }

    }


    

}


export default cartManager