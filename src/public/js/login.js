//boton de login
let botonLogin = document.getElementById("botonLogin")
botonLogin.onclick = (event)=>{
    event.preventDefault()
    login()
}
//boton de github
let botonLoginGH = document.getElementById("botonGitHub")
botonLoginGH.onclick = (event)=>{
    event.preventDefault()
    location.href='/api/session/github'
}

//oculto el navBar cuando estoy en login
let navBar=document.getElementById("navBar")
navBar.className=navBar.className + " ocultarElemento"

async function login(){
    let user=document.getElementById('email').value
    let password=document.getElementById('password').value

    let consulta = await fetch(`http://localhost:8080/api/session/login?email=${user}&password=${password}`,{
        method:'post',
        headers: {
            "Content-Type": "application/json",
        },
    })


    try{
        let loginUser = await consulta.json()
        let alerta=document.getElementById('alerta')
        alerta.innerHTML= 'usuario Logueado'
        window.location.href="/products"
        return loginUser
    }catch(err){
        let alerta=document.getElementById('alerta')
        alerta.innerHTML= `fallo el login, usuario no registrado o incorrecto`
    }
    
   return loginUser
}


