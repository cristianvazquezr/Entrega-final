//oculto el administrador de usuarios si no es usuario admin

document.addEventListener ('DOMContentLoaded', ( ) => {
    let navBar=document.getElementsByClassName("navbar-nav")
    let userRole=navBar[0].id
    if (userRole!='admin'){
        let adminUser=document.getElementById("onlyAdmin")
        adminUser.className=adminUser.className + " ocultarComponente"
    }
})
