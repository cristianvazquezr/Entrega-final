//hago la multiplicacion de dos campos para el total

window.onload=function () {
    countItemCart()
    let totalPrice=document.getElementsByClassName('totalPrice')
    for (i in totalPrice){
        let idProducto=totalPrice[i].id
        let precio=document.getElementById(`p${idProducto}`)
        let cantidad=document.getElementById(`q${idProducto}`)
        totalPrice[i].innerHTML=Number(precio.innerHTML)*Number(cantidad.innerHTML)
    }
    
}


//cosulto al session storage si hay carrito, y con un get veo cuantos productos tiene 

let countItem=0
let cantidadCarrito=document.getElementById("numerito")

async function countItemCart(){

    let cartUser= await JSON.parse(sessionStorage.getItem('carrito'))
    let idCart=''
    if(cartUser){
        idCart=await cartUser
       let getCart= await fetch(`/api/carts/${idCart}`, {
            method:'get',
            headers: {
                "Content-Type": "application/json",
            }
        })
        let objCart=await getCart.json()
        let productList=await objCart[0].products
        countItem=productList.length
    }
    else{
        idCart=window.location.pathname.split('/')[2]
        let getCart= await fetch(`/api/carts/${idCart}`, {
            method:'get',
            headers: {
                "Content-Type": "application/json",
            }
        })
        let objCart=await getCart.json()
        let productList=await objCart[0].products
        countItem=productList.length
    }
    cantidadCarrito.innerHTML=countItem

}

//logout

async function logout(){

    try{
        let logout=await fetch(`/api/session/logout`, {
        method:'get',
        })
        console.log("Sesion eliminada")
        sessionStorage.removeItem("carrito")
        location.href="/"
        
    }catch(err){
        console.log("fallo " + err)
    }

}



async function purchase(){
    idCart=await JSON.parse(sessionStorage.getItem('carrito'))
    let purchase=await fetch(`/api/carts/${idCart}/purchase`,
     {
        method:'post',
    })
    let purchaseObj=await purchase.json()
    let idPurchase=await purchaseObj.idTicket
    location.href=`/purchase/${idPurchase}`
}






//hago la multiplicacion de dos campos para el total

window.onload=function () {
    countItemCart()
    let totalPrice=document.getElementsByClassName('totalPrice')
    for (i in totalPrice){
        let idProducto=totalPrice[i].id
        let precio=document.getElementById(`p${idProducto}`)
        let cantidad=document.getElementById(`q${idProducto}`)
        totalPrice[i].innerHTML=Number(precio.innerHTML)*Number(cantidad.innerHTML)
    }
    
}

//agrego el ID al href del navbar para redirigir al carrito

async function hrefCarrito(){
    let hrefCarrito=document.getElementById("carrito")
    let idCarrito=await JSON.parse(sessionStorage.getItem('carrito'))
    if (idCarrito){
        hrefCarrito.href= `/cart/${await idCarrito}`
    }else{
        hrefCarrito.href= '' 
    }
}

hrefCarrito()


let purchaseElement = document.getElementById("purchase")
purchaseElement.onclick=purchase

//recuperar contrasena

async function cambiarPass(){
    try{
        let email=await fetch(`/api/email`, {
        method:'get',
        })
        console.log(email.status + ' ' + email.message)
        console.log("Correo Enviado")
    }catch(err){
        console.log("fallo " + err)
    }
}

let restoreElement = document.getElementById("RecuperarPass")
restoreElement.onclick=(event)=>{
    event.preventDefault()
    cambiarPass()
}

// agrego la funcion para eliminar productos cuando presiono el boton elminar. Primero debo determinar el ID del elemento que deseo eliminar. por eso creo el evento onclick para obtener el ID del boton que es el mismo ID del producto como objeto. Lo tengo que meter dentro de una funcion, para que cuando yo actualice mi lista de productos se cree el evento on click sobre cada uno de los botones 'eliminar'


function botonEliminar(){
    let botonEliminar=document.getElementsByClassName('botonEliminar')
    let encabezado=document.getElementsByClassName('encabezado')
    let idCart=encabezado[0].id
    let idElementoEliminar=null
    for (i in botonEliminar){
        botonEliminar[i].onclick=(event)=>{
            idElementoEliminar=((event.target.attributes.id.nodeValue))
            DeleteProduct(idElementoEliminar,idCart);
        }
    }
}

botonEliminar()

async function  DeleteProduct(idElementoEliminar, idcart){
    //elimino el producto
    let deleteProduct = await fetch(`'/../api/carts/${idcart}/product/${idElementoEliminar}`, {
        method:'delete',
        headers: {
            "Content-Type": "application/json",
        }
    })
    let response=await deleteProduct.json()

    if(response.status=='error'){
        //cartel
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${response.message}`,
        });

    }else{
        Toastify({
            text: "Producto eliminado",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }
}
