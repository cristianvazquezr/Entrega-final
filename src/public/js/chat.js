const socket=io()


socket.on("mensajes",(data)=>{
    let contenedorChat=document.getElementById("contenedorMensajes")
    let contenedor=''
    data.forEach(mensaje => {
        contenedor+=
        `<div>
            <span><h5>[ ${mensaje.usuario} ] : </h5></span>
            <span><p class="lead">${mensaje.mensaje}</p></span>
            
        </div>`
    });
    contenedorChat.innerHTML = contenedor
})
    

// capturo los elementos del chat

let newMessage=document.getElementById("message")
let newUser=document.getElementById("user")
let alert=document.getElementById("alert")

function handleClick(){
    
    let message={}
    if(newMessage.value==''||newUser.value==''){
        alert.innerHTML=`<h5>complete todos los campos</h5>`
    }
    else{
        message={
            user:newUser.value,
            message:newMessage.value
        }
        socket.emit('newMessage',message)
    }
    
}

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