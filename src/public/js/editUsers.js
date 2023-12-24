const socket=io()

// agrego la funcion para eliminar usuarios cuando presiono el boton elminar. Primero debo determinar el ID del elemento que deseo eliminar. por eso creo el evento onclick para obtener el ID del boton que es el mismo ID del usuario como objeto. Lo tengo que meter dentro de una funcion, para que cuando yo actualice mi lista de usuarios se cree el evento on click sobre cada uno de los botones 'eliminar'


function botonEliminar(){
    let botonEliminar=document.getElementsByClassName('botonEliminar')
    let idElementoEliminar=null
    for (i in botonEliminar){
        botonEliminar[i].onclick=(event)=>{
            idElementoEliminar=((event.target.attributes.id.nodeValue))
            DeleteUser(idElementoEliminar);
        }
    }
}

function botonRol(){
    let botonRol=document.getElementsByClassName('cambiarRol')
    let idElementoCambiar=null
    for (i in botonRol){
        botonRol[i].onclick=(event)=>{
            idElementoCambiar=((event.target.attributes.id.nodeValue))
            cambiarRol(idElementoCambiar);
        }
    }
}


async function cambiarRol(idElementoCambiar){
    //elimino el producto
    let changeRole = await fetch(`api/user/premium/${idElementoCambiar}`, {
        method:'post',
        headers: {
            "Content-Type": "application/json",
        }
    })
    let response=await changeRole.json()
    console.log(await response.message);
    if(response.status=='error'){
        Swal.fire({
            title: "Fallo el cambio de rol!",
            text: `${response.message}`,
            icon: "error"
        });

    }else{
        Toastify({
            text: "rol cambiado con exito",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }
    socket.emit("cambiarRol");
}

async function  DeleteUser(idElementoEliminar){
    //elimino el usuario
    let deleteUser = await fetch(`api/user/${idElementoEliminar}`, {
        method:'delete',
        headers: {
            "Content-Type": "application/json",
        }
    })
    let response=await deleteUser.json()
    console.log(await response.message);
    if(response.status=='error'){
        Swal.fire({
            title: "Fallo al intentar eliminar!",
            text: `${response.message}`,
            icon: "error"
        });

    }else{
        Toastify({
            text: "se elimino con exito",
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }
    socket.emit("eliminarUsuario");
}

socket.on("usuarios",data=>{
    const contenedorTabla=document.getElementById("contenedorTabla")
    let contendor=''
    data.payLoad.forEach(element => {contendor+=
    `
    <tr key=${element._id}>
        <td>${element.first_name}</td>
        <td>${element.last_name}</td>
        <td>${element.email}</td>
        <td>${element.role}</td>
        <td>${element.last_connection}</td>
        <td><button id="${element._id}" class="cambiarRol">🔄</button></td>
        <td><button id="${element._id}" class="botonEliminar">🗑️</button></td>
    </tr>
    `
    });
    
    contenedorTabla.innerHTML=contendor
    botonEliminar()
    botonRol()
})

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