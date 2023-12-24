import mongoose from "mongoose";
import ProductManager from "../../src/dao/ProductManager.js";
import Assert from 'assert'

mongoose.connect("mongodb+srv://vazquezcristianr:Cristian123@clustercristian.ggp7vhd.mongodb.net/ecommerce-test?retryWrites=true&w=majority")
const assert=Assert.strict;

describe('testing products DAO', ()=>{

    before(function(){
        this.productDao=new ProductManager()
    })

    beforeEach(async function(){
        mongoose.connection.collections.products.drop()
        this.timeout(50000)
    })

    it('el get debe devolver un arreglo', async function(){
        const result= await this.productDao.getProducts({});
        console.log(result);
        assert.strictEqual(typeof result, 'object')

    }).timeout(10000)

    it('el AddProduct debe agregar un producto ', async function(){

        const result= await this.productDao.addProduct("title", "description", "category", 100, "thumbnail", 100, 100, 'premium');
        console.log(result);
        assert.strictEqual(result, true)

    }).timeout(10000)

    it('el getProductById debe buscar un producto por ID ', async function(){

        const addProduct= await this.productDao.addProduct("title", "description", "category", 100, "thumbnail", 1, 1, 'premium');
        const getProducts=await this.productDao.getProducts({})
        const idProduct=getProducts.payLoad[0]._id
        const result= await this.productDao.getProductById(idProduct)
        console.log(result);
        console.log(idProduct);
        assert.strictEqual(typeof result, 'object')

    }).timeout(10000)


})