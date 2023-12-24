import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import ProductManager from "../src/dao/ProductManager.js";
import cartManager from "../src/dao/cartManager.js";

mongoose.connect("mongodb+srv://vazquezcristianr:Cristian123@clustercristian.ggp7vhd.mongodb.net/ecommerce-test?retryWrites=true&w=majority")

const expect = chai.expect

const requester=supertest('http://localhost:8080')

describe('corriendo test wepApp', ()=>{
   
    describe('testing products API',async()=>{

       let  product={
        title:'title',
        description:'description',
        price:100,thumbnail:'thumbnail',
        code:4,
        stock:180,
        category:'category',
        owner:'cr@gmail.com'}

        beforeEach(async function(){
            mongoose.connection.collections.products.drop()
            mongoose.connection.collections.carts.drop()
        })

        it('crear productos: api post debe crear un producto', async()=>{
            
            const {statusCode,ok,_body}= await requester.post('/api/products/').send(product)
            expect(statusCode).is.eqls(200)
            expect(_body.status).is.eqls('OK')

        }).timeout(10000)

        it('crear productos: api post debe arrojar error si se repite el code', async()=>{
            
            const {statusCode,ok,_body}= await requester.post('/api/products/').send(product)
            expect(statusCode).is.eqls(400)
            expect(_body.status).is.eqls('error')
            expect(_body.message).is.eqls("ya existe producto con ese code")

        }).timeout(10000)

        it('Get producto: api get debe obtener todos los productos', async()=>{

            const {statusCode,ok,_body}= await requester.get(`/api/products/`)
            expect(statusCode).is.eqls(200)
            expect(_body.payLoad[0]).is.ok.and.to.have.property("_id")

        }).timeout(10000)
       
    }).timeout(70000)
    describe('testing carts API',async()=>{

        const cartDao=new cartManager()
        const productDao= new ProductManager()

        beforeEach(async function(){
            mongoose.connection.collections.products.drop()
            mongoose.connection.collections.carts.drop()
        })
 
        it('crear cart: api post debe crear un cart', async()=>{
            const {statusCode,ok,_body}= await requester.post('/api/carts/').send()
            expect(statusCode).is.eqls(200)
        }).timeout(60000)
 
        it('agregar producto al carrito: api post debe tirar error si el no se encontro el carrito con ese id', async()=>{

            //creo el carrito
            const createCart=await cartDao.createCart()
            //obtengo los carritos
            const getCarts=await cartDao.getCarts()
            //busco un ID
            const idCarts=getCarts[0]._id

            console.log(idCarts)

            // creo un producto y busco su ID
            const addProduct= await productDao.addProduct("title", "description", "category", 100, "thumbnail", 1, 1423, 'premium');
            const getProducts=await productDao.getProducts({})
            const idProduct=getProducts.payLoad[0]._id

            // agrego el producto al carrito
            const {statusCode,ok,_body}= await requester.post(`/api/carts/123/product/${idProduct}`).send({quantity:10})
            console.log(idCarts)
            
            expect(statusCode).is.eqls(500)
            expect(_body.status).is.eqls('error')
            expect(_body.message).is.eqls("no se encontro el carrito con ese id")
        }).timeout(10000)
 
        it('Get carts: api get debe obtener todos los carts', async()=>{
            const {statusCode,ok,_body}= await requester.get(`/api/carts/`)
            expect(statusCode).is.eqls(200)
        }).timeout(10000)
        
    }).timeout(70000)

    describe('testing session API',async()=>{

        after(async function(){
            mongoose.connection.collections.users.drop()
        })


        let newUser=
        {
            first_name:'cristian',
            last_name:'vazquez',
            email:'cristiancristian@gmail.com',
            password:'12312', 
            age:20,
            role:'admin'
        }

        let cookie=''

        it('registrar usuario: api post debe registrar un usuario', async()=>{


            const {statusCode,ok,_body}= await requester.post('/api/session/register').send(newUser)
            console.log(_body)
            console.log(statusCode)
            expect(statusCode).is.eqls(200)
        }).timeout(10000)

        it('login usuario: api post debe loguear el usuario', async()=>{

            let User=
            {
                email:newUser.email,
                password:newUser.password, 
            }

            const {statusCode,ok,_body,headers}= await requester.post('/api/session/login').send(User)
            console.log(_body)
            console.log(statusCode)
            expect(statusCode).is.eqls(200)
            let cookieResponse=headers['set-cookie'][0].split('=')
            cookie={
                name:cookieResponse[0],
                value:cookieResponse[1]
            }
            expect(cookie.name).to.be.ok
        }).timeout(10000)
    })
}).timeout(70000)