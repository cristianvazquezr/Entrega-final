import mockingManger from "../dao/mockingManager.js";

const MM=new mockingManger()

class mockingController{
    constructor(){}

    createProducts = async (req,resp)=>{
        await MM.generateProducts()
        resp.send('productos creados con exito')
    }

}

export default mockingController