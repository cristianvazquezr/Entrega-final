import { json } from 'express';
import { productModel  } from './models/product.model.js'
import { userModel } from './models/user.model.js';
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

class ProductManager{

    constructor(){
        this.Product=''
    }

    async getProducts(params){
        let {limit, page, query, sort}=params
        limit = limit ? limit : 12;
        page = page ? page : 1;
        // para poder convertir en un objeto el query lo que hago es generar un array del par clave valor y luego lo convierto con la propiedad de OBject. uso una expresion regular en el replace para que le elimine todas las comillas de coca cola
        let clave=query ? query.split(":")[0] : "";
        let valor= query ? (query.split(":")[1]).replace(/(")/gm,'') : "";
        let arrayQuery= [clave, valor]
        let ObjQuery=Object.fromEntries([arrayQuery]);
        query = query ? ObjQuery : {};
        sort = sort ? sort == 'asc' ? 1 : -1 : 0;
        let listaProducto=[]
        let filtro={}


        if (sort==0){
            filtro={limit:limit,page:page}
        }else{
            
            filtro={limit:limit,page:page, sort:{price:sort}}
        }
        

        try{
            listaProducto = await productModel.paginate(query,filtro)
            let status = listaProducto ? "success" : "error";
            let hasPrevPage=listaProducto.hasPrevPage
            let hasNextPage=listaProducto.hasNextPage
            let prevPage=listaProducto.prevPage
            let nextPage=listaProducto.nextPage
            let prevLink= hasPrevPage!=false ? 'http://localhost:8080/products/?limit=' + limit + "&page=" + prevPage : null;
            let nextLink= hasNextPage!=false ? 'http://localhost:8080/products/?limit=' + limit + "&page=" + nextPage : null;

            listaProducto={
                status:status, 
                payLoad:listaProducto.docs, 
                totalPages:listaProducto.totalPages, 
                prevPage:prevPage, 
                nextPage:nextPage,
                page:listaProducto.page,
                hasPrevPage:hasPrevPage, 
                hasNextPage:hasNextPage,
                prevLink:prevLink,
                nextLink:nextLink
            }
        }
        catch(err){
            console.log("fallo la consulta" + err )
        } 
        return listaProducto 
    }
    async sendEmail(userTo){
        try{let result= await transporter.sendMail({
            from:'vazquezcristianr@gmail.com',
            to:userTo,
            subject:"Producto eliminado",
            html:`
            <div>
                <h1>Producto eliminado </h1>
                <p> SE ELIMINO EL PRODUCTO QUE USTED CREO </p>
            </div>
            `,
            attachments:[]
        }, (err, info)=>{
            if(err){
                console.error(err)
            }else{
                console.log("message sent: %s" + info.messageId)
            }
            
        })
        } catch(error){
            console.log(error)
        }  

    }
    async addProduct(title, description, category, price, thumbnail, code, stock, owner){
        //creo un objeto nuevo con atributos nuevos
        let producto1= {title:title,description:description,price:price,thumbnail:thumbnail,code:code,stock:stock, category:category, status:true,owner:owner}
        //creo un array con los valores de ese nuevo objeto, excepto thumbnail por que puede estar vacio
        let valores =[producto1.title,producto1.description,producto1.price,producto1.code,producto1.stock,producto1.category,producto1.status]
        //corroboro que no haya ningun valor vacio dentro de ese array
        let elementoVacio= valores.includes("")
        //corroboro que no haya ningun valor undefined dentro de ese array
        let elementoUnd= valores.includes(undefined)

        //valido si existe la coleccion.
         const listaProduct = async ()=>{
            let listaProducto=[]
            try{
                listaProducto = await productModel.find().lean()
            }
            catch(err){
                console.log("fallo la consulta o no existe la coleccion " + err)
            }
            return listaProducto
        }

        // con map genero un array de los code y veo si existe el mismo valor
        let ListaCode=listaProduct().then(resultado=>resultado.map(elemento=>elemento.code))
        let mismoCode=ListaCode.then(resultado=>resultado.includes(producto1.code))
        if (elementoVacio || elementoUnd){
            console.log("existen atributos sin un valor definido")
            return "valorVacio"
        }
        else if (await mismoCode){
            console.log("El valor elegido para code ya existe, elija otro")
            return "codeRepetido"
        }
        else{
            await productModel.create(producto1)
            return true
        }

    }

    
    async getProductById(id){

        // llamo la funcion para obtener los productos y buscar por id
     
        const productoBuscado=await productModel.find({_id:id})
        if(await productoBuscado!=undefined){
            return (await productoBuscado) 
        }
        else{
           console.log("Not found")
           return (false)
        }
    }

    async updateProduct(id,title, description, category, price, thumbnail, code, stock,owner){
        //chequeo que exista el archivo y que lo busque por id
        
        let Product=await this.getProductById(id)
        
        //valido que exista el id
        if (await Product!=false){

            //hago todas las validaciones de que no repita el CODE y que se hayan elegido valores para todos los atributos.
            let producto1={title:title,description:description,price:price,thumbnail:thumbnail,code:code,stock:stock, category:category, status:true, owner:owner}
            //creo un array con los valores de ese nuevo objeto
            let valores=[producto1.title,producto1.description,producto1.price,producto1.code,producto1.stock,producto1.category,producto1.status]
            //corroboro que no haya ningun valor vacio dentro de ese array
            let elementoVacio=valores.includes("")
            //corroboro que no haya ningun valor undefined dentro de ese array
            let elementoUnd=valores.includes(undefined)

            const listaProduct = async ()=>{
                let listaProducto=[]
                try{
                    listaProducto = await productModel.find().lean()
                }
                catch(err){
                    console.log("Error al consultar los productos" + err)
                }
                return listaProducto
            }

            // con map genero un array de los code y veo si existe el mismo valor de code pero descarto el producto que tiene el mismo id
            let ListaCode=listaProduct().then(resultado=>resultado.map((elemento)=>{
                let lista=''
                if(id!=elemento._id){
                    lista=elemento.code
                }
                return lista
            }))
            let mismoCode=ListaCode.then(resultado=>resultado.includes(producto1.code))

            if (elementoVacio || elementoUnd){
                console.log("existen atributos sin un valor definido")
                return "valorVacio"
            }
            else if (await mismoCode){
                console.log("El valor elegido para code ya existe, elija otro")
                return "codeRepetido"
            }
            else{


               await productModel.updateOne({_id:id},producto1)
            }
        }else{
            console.log("no se encontro el elemento")
            return "idInvalido"
        }



    }
    async deleteProduct(id,email){
        //chequeo que exista el archivo y que lo busque por id
    
        let Product=await this.getProductById(id)
        let user=await userModel.findOne({email:email})
        
        //valido que exista el id
        if (await Product!=false){
            if(Product[0].owner==email || user.role=='admin'){
                await productModel.deleteOne({_id:id})
                return true
            } else{
                return false
            }
            
        }else{
            console.log("no se encontro el elemento")
            return false
        }
    }

    async updateStock(id,stock){
        let Product=await this.getProductById(id)

        if (Product){
            await productModel.updateOne({_id:id},{stock:stock} )
            return true
        }else{
            return false
        }

    }

}


export default ProductManager