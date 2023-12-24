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
        location.href="http://localhost:8080/"
        
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
    location.href=`http://localhost:8080/purchase/${idPurchase}`
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
        hrefCarrito.href= `http://localhost:8080/cart/${await idCarrito}`
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