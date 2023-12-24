import mongoose from "mongoose";
import Assert from 'assert'
import cartManager from "../../src/dao/cartManager.js";

mongoose.connect("mongodb+srv://vazquezcristianr:Cristian123@clustercristian.ggp7vhd.mongodb.net/ecommerce-test?retryWrites=true&w=majority")
const assert=Assert.strict;

describe('testing carts DAO', ()=>{

    before(function(){
        this.cartDao=new cartManager()
    })

    beforeEach(async function(){
        mongoose.connection.collections.carts.drop()
        this.timeout(50000)
    })

    it('el get debe devolver un arreglo', async function(){
        const result= await this.cartDao.getCarts();
        console.log(result);
        assert.strictEqual(typeof result, 'object')

    }).timeout(10000)

    it('el createCart debe crear un cart ', async function(){

        const result= await this.cartDao.createCart();
        console.log(result);
        assert.strictEqual(typeof result, 'object')

    }).timeout(10000)

    it('el getCartById debe buscar un carrito por ID ', async function(){

        const createCart= await this.cartDao.createCart()
        const getCarts=await this.cartDao.getCarts()
        const idCarts=getCarts[0]._id
        const result= await this.cartDao.getCartById(idCarts)
        console.log(idCarts);
       assert.strictEqual(typeof result, 'object')

    }).timeout(10000)


})