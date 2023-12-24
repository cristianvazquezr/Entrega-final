
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

let enviarCorreo = document.getElementById("enviarCorreo")
enviarCorreo.onclick=(event)=>{
    event.preventDefault()
    cambiarPass()
}
 