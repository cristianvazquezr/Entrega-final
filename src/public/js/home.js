//oculto el navBar cuando estoy en home
let navBar=document.getElementById("navBar")
navBar.className=navBar.className + " ocultarComponente"

//color de fondo en el home
let contPrinc=document.getElementById("contenedorPrincipal")
contPrinc.className=contPrinc.className + " colorFondo"

//boton de github
let botonLoginGH = document.getElementById("btnGitHome")
botonLoginGH.onclick = (event)=>{
    event.preventDefault()
    location.href='/api/session/github'
}

//boton de ingresar
let botoningresar = document.getElementById("btnIngresar")
botoningresar.onclick = (event)=>{
    event.preventDefault()
    location.href='/login'
}

//boton de registrar
let botonRegistrar = document.getElementById("btnRegistrar")
botonRegistrar.onclick = (event)=>{
    event.preventDefault()
    location.href='/register'
}

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