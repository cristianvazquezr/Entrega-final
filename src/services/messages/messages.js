export const generateUserErrorInfo=(user)=>{
    return `Una o mas propiedades estan incompletas o no son validas.
    * first_name : necesita ser un string, se envio un ${user.first_name}
    * last_name : necesita ser un string, se envio un ${user.last_name}
    * email : necesita ser un string, se envio un ${user.email}
    * age : necesita ser un numero, se envio un ${user.age}
    `
}

export const searchedUserErrorInfo=(user)=>{
    return `el usuario ${user} ingresado es incorrecto o no se encuntra en la base de datos. 
    `
}