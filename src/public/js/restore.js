let botonRestore = document.getElementById("botonRestore")
botonRestore.onclick = (event)=>{
    event.preventDefault()
    restore()
}


async function restore(){

    let user=document.getElementById('email').value
    let password=document.getElementById('password').value

    let consulta = await fetch(`/api/session/restore/?user=${user}&pass=${password}`,{
        method:'post',
        headers: {
            "Content-Type": "application/json",
        }
    })

    let RestoreUser = await consulta.json()
    if(await RestoreUser.status=='ERROR'){
        let alerta=document.getElementById('alerta')
        alerta.innerHTML= await RestoreUser.message
    }else{
        let alerta=document.getElementById('alerta')
        alerta.innerHTML= await RestoreUser.message
        //window.location.href="/products"

    }
    
   return RestoreUser
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