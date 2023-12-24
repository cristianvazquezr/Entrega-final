import fs from 'fs'


class ProductManagerFs{

    constructor(path){
        this.path=path
        this.Product=''
    }

    async getProducts(){
        let listaProducto=[]
        try{
            listaProducto = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        }
        catch(err){
            console.log("No existe el archivo")
        }
        return await listaProducto
        
    }


    async addProduct(title, description, category, price, thumbnail, code, stock){
        //incremento en 1 el valor de ID
        let  id= this.getProducts().then(resultado=>resultado.length)==undefined? 1:this.getProducts().then(resultado=>resultado.length+1);
        //creo un objeto nuevo con atributos nuevos
        let producto1= {id:await id, title:title,description:description,price:price,thumbnail:thumbnail,code:code,stock:stock, category:category, status:true}
        //creo un array con los valores de ese nuevo objeto, excepto thumbnail por que puede estar vacio
        let valores =[producto1.title,producto1.description,producto1.price,producto1.code,producto1.stock,producto1.category,producto1.status]
        //corroboro que no haya ningun valor vacio dentro de ese array
        let elementoVacio= valores.includes("")
        //corroboro que no haya ningun valor undefined dentro de ese array
        let elementoUnd= valores.includes(undefined)

        //valido si existe el archivo sino indico que sera creado.
         const listaProduct = async ()=>{
            let listaProducto=[]
            try{
                listaProducto = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            }
            catch(err){
                console.log("No existe el archivo, sera creado")
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
            const listaProductos= await listaProduct()
            await fs.promises.writeFile(this.path,JSON.stringify([...listaProductos, producto1]))
            return true
        }

    }

    
    async getProductById(id){

        // llamo la funcion para obtener los productos y buscar por id
     
        const productoBuscado=this.getProducts().then(resultado=>resultado.find(element=>element.id==id))
        if(await productoBuscado!=undefined){
            return (await productoBuscado)
        }
        else{
           console.log("Not found")
           return (false)
        }
    }

    async updateProduct(id,title, description, category, price, thumbnail, code, stock){
        //chequeo que exista el archivo y que lo busque por id
        
        let Product=await this.getProductById(id)
        
        //valido que exista el id
        if (await Product!=false){

            //hago todas las validaciones de que no repita el CODE y que se hayan elegido valores para todos los atributos.
            let producto1={id:id, title:title,description:description,price:price,thumbnail:thumbnail,code:code,stock:stock, category:category, status:true}
            //creo un array con los valores de ese nuevo objeto
            let valores=[producto1.title,producto1.description,producto1.price,producto1.code,producto1.stock,producto1.category,producto1.status]
            //corroboro que no haya ningun valor vacio dentro de ese array
            let elementoVacio=valores.includes("")
            //corroboro que no haya ningun valor undefined dentro de ese array
            let elementoUnd=valores.includes(undefined)

            //valido si existe el archivo sino indico que sera creado.
            const listaProduct = async ()=>{
                let listaProducto=[]
                try{
                    listaProducto = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
                }
                catch(err){
                    console.log("No existe el archivo, sera creado")
                }
                return listaProducto
            }

            // con map genero un array de los code y veo si existe el mismo valor de code pero descarto el producto que tiene el mismo id
            let ListaCode=listaProduct().then(resultado=>resultado.map((elemento)=>{
                let lista=''
                if(id!=elemento.id){
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

                //genero la lista modificada y rescribo el archivo.
                let listaModificada=listaProduct().then(resultado=>resultado.map((elemento)=>{
                    if(id==elemento.id){
                        elemento=producto1
                    }
                    return elemento
                }))


               await fs.promises.writeFile(this.path,JSON.stringify(await listaModificada))
            }

        }else{
            console.log("no se encontro el elemento")
            return "idInvalido"
        }



    }
    async deleteProduct(id){
        //chequeo que exista el archivo y que lo busque por id
    
    let Product=await this.getProductById(id)
    
    //valido que exista el id
    if (await Product!=false){
        let listaProductos=await this.getProducts()

        //genero la lista modificada y rescribo el archivo.
            let listaModificada=[]
        for(let i=0;i<listaProductos.length;i++){
            if(id!=listaProductos[i].id){
                listaModificada.push(listaProductos[i])
            }
        }
        fs.promises.writeFile(this.path,JSON.stringify(listaModificada))
        return true
    }else{
        console.log("no se encontro el elemento")
        return false
    }}

}


// let producto = new ProductManager("./productos.json")

// const lista=producto.getProducts()

// console.log(await lista)

//creo los productos

// async function crear(){
//     await producto.addProduct("Coca Cola","gaseosas",100,"imagen.com",1,100)
//     await producto.addProduct("Pepsi","gaseosas",80,"imagen.com",2,100)
//     await producto.addProduct("Sprite","gaseosas",95,"imagen.com",3,100)
//     await producto.addProduct("sevenUP","gaseosas",90,"imagen.com",4,100)
//     await producto.addProduct("pritty","gaseosas",60,"imagen.com",5,100)
// }
// crear()

export default ProductManagerFs