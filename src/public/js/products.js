
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
        countItem=0
    }
    cantidadCarrito.innerHTML=countItem

}

countItemCart()

//logout

async function logout(){

    try{
        let logout=await fetch(`/api/session/logout`, {
        method:'get',
        })
        console.log("Sesion eliminada")
        sessionStorage.removeItem("carrito")
        location.href="http://localhost:8080/login"
        
    }catch(err){
        console.log("fallo " + err)
    }

}

let logoutElement = document.getElementById("logout")
logoutElement.onclick=logout

//recuperar contrasena

async function cambiarPass(){
    try{
        let email=await fetch(`/api/email`, {
        method:'get',
        })
        mailObj=await email.json
        console.log(mailObj.status + ' ' + mailObj.message)
        console.log("Correo Enviado")
        //alerta
        Toastify({
            text: "Correo Enviado",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
        //cartel
        Swal.fire({
            title: "Correo enviado!",
            text: "revise su bandeja de correo!",
            icon: "success"
          });

    }catch(err){
        console.log("fallo " + err)
    }
}

let restoreElement = document.getElementById("RecuperarPass")
restoreElement.onclick=(event)=>{
    event.preventDefault()
    cambiarPass()
}

// guardo en el sessionStorage el ID del carrito en el que va trabajar el cliente. sino existe lo crea.
async function validarCarrito(){
    let cartUser= await JSON.parse(sessionStorage.getItem('carrito'))
    let idCart=''
    if(cartUser){
        idCart=await cartUser
    }else{
       let createCart = await fetch('/api/carts', {
            method:'post',
            headers: {
                "Content-Type": "application/json",
            }
        })
       let objCart = await createCart.json()
       idCart=await objCart._id

       //consulto el usuario al current
       let getUser = await fetch('api/session/current', {
            method:'get',
            headers: {
                "Content-Type": "application/json",
            }
        })
        let datos = await getUser.json()
        user=await datos.datos[0].email

       //agrego el carrito al usuario
       let addCart = await fetch(`api/user/${user}/cart/${idCart}`, {
            method:'post',
            headers: {
                "Content-Type": "application/json",
            }
        })

    }
    sessionStorage.setItem('carrito',JSON.stringify(idCart));
    return idCart
}

//agrego el ID al href del navbar para redirigir al carrito

async function hrefCarrito(){
    let hrefCarrito=document.getElementById("carrito")
    let idCarrito=await validarCarrito()
    if (idCarrito){
        hrefCarrito.href= `http://localhost:8080/cart/${await idCarrito}`
    }else{
        hrefCarrito.href= '' 
    }
}

hrefCarrito()

// hago un fetch para agregar el producto al carrito

async function addToCart(idProducto){

    let idCart=await validarCarrito()

    try{
        let addProd=await fetch(`../api/carts/${idCart}/product/${idProducto}`, {
        method:'post',
        headers: {
            "Content-Type": "application/json",
        }
        })
        await countItemCart()
        await hrefCarrito()
        Toastify({
            text: "Producto agregado",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }catch(err){
        console.log("fallo " + err)
    }

}

//genero los botones de agregar Producto

function botonAddProduct(){
    let botonAdd=document.getElementsByClassName('botonAdd')
    let idElementAdd=null
    for (i in botonAdd){
        botonAdd[i].onclick=(event)=>{
            idElementAdd=((event.target.attributes.id.nodeValue))
            addToCart(idElementAdd);
        }
    }
}

botonAddProduct()
