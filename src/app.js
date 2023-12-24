import  express  from 'express'
import expressHandlebars from 'express-handlebars'
import Handlebars from 'handlebars'
import productRouter from './Routes/products.router.js'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import cartRouter from './Routes/cart.router.js'
import __dirname from './utils.js'
import viewsRouter from './Routes/views.router.js' 
import {Server} from 'socket.io'
import ProductManager from './dao/ProductManager.js'
import mongoose from 'mongoose'
import messageMananger from './dao/messageManager.js'
import messageRouter from './Routes/message.router.js'
import cookieParser from 'cookie-parser'
import sessionRouter from './Routes/session.router.js'
import session from 'express-session'
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initiliazePassport from './config/passport.config.js'
import config from './config/config.js'
import userRouter from './Routes/user.router.js'
import mockingRouter from './Routes/mocking.router.js'
import errorHandler from './services/errors/middlewares/index.js'
import { addlogger } from './config/logger.js'
import cluster from "cluster"
import { cpus } from 'os'
import MongoSingleton from './config/mongoSingleton.js'
import mailRouter from './Routes/mail.router.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'
import userMananger from './dao/userMananger.js'

// corroboro si es proceso primario
if (cluster.isPrimary){
    const numeroDeProcesadores=cpus().length
    console.log('Numero de procesadores: ' + numeroDeProcesadores)
    for (let i=0; i<1; i++){
        cluster.fork()
    }
    cluster.on('message', worker => {
        console.log('mensaje recibido desde el worker ' + worker.process.pid);
    })

    cluster.on('disconnect',worker => {
        cluster.fork()
    })


}else{
    console.log('soy un worker con el ID de proceso ' + process.pid )

    //Creo el servidor

    const puerto=config.port

    const app=express()

    const swaggerOptions={
        definition:{
            openapi:'3.0.1',
            info:{
                title:'Documentacion proyecto final',
                description:'Documentacion de las APIs relacionadas al ECOMMERCE realizado como projecto Final de curso de BACKEND de CODERHOUSE'
            }
        },
        apis:[`./docs/**/*.yaml`]
        
    }

    const specs=swaggerJSDoc(swaggerOptions)

    //declaro el endpoint de swagger
    app.use('/apidocs',swaggerUIExpress.serve,swaggerUIExpress.setup(specs))

    const httpServer= app.listen(puerto,async ()=>{
        console.log(`servidor conectado al puerto ${puerto}`)
    })
    const socketServer = new Server(httpServer)

    const mongoInstance = async () => {

        try {
            await MongoSingleton.getInstance();
        } catch (error) {
            console.error(error);
        }
    };
    mongoInstance();

    app.use(express.static(__dirname + "/public"))
    app.engine("handlebars",expressHandlebars.engine({
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    }))
    app.set("views",__dirname+"/views" )
    app.set("view engine","handlebars")
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    app.use(session({
        store:MongoStore.create({
            mongoUrl:config.mongoURL,
            mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
            ttl:15000,
        }),
        secret:"cr1st14n",
        resave:false,
        saveUninitialized:false
    }))
    app.use(cookieParser())
    initiliazePassport();
    app.use(passport.initialize());
    app.use(passport.session());

    //declaro el endpoint de swagger
    app.use('/apidocs',swaggerUIExpress.serve,swaggerUIExpress.setup(specs))
    app.use("/", viewsRouter)
    app.use("/api", productRouter)
    app.use("/api", cartRouter)
    app.use("/api", sessionRouter)
    app.use("/api", userRouter)
    app.use("/api", mockingRouter)
    app.use("/api", mailRouter)
    app.use("/", messageRouter)
    app.use(errorHandler)
    app.use(addlogger)
    app.get("/api/logger", async (req,res)=>{
        res.send("prueba logger")
    })

    // instancio la clase para poder enviar a todos los clientes los productos


    socketServer.on('connection',async socket=>{
        let PM = new ProductManager()
        let productos= await PM.getProducts({limit:'100000', page:'', query:'', sort:''})
        let MM = new messageMananger()
        let mensajes = await MM.getMessage()
        let UM = new userMananger()
        let usuarios=await UM.getUsers({limit:"100000", page:'', query:'', sort:''})
        console.log("nueva conexion realizada")
        socketServer.emit("productos",productos)
        socketServer.emit("mensajes",mensajes)
        socketServer.emit("usuarios",usuarios); 

        socket.on("agregarProducto", async()=>{
            let PM = new ProductManager()
            //await PM.addProduct(product.title, product.description, product.category, product.price, product.thumbnail, product.code, product.stock, product.owner);
            let productos= await PM.getProducts({limit:"100000", page:'', query:'', sort:''})
            socketServer.emit("productos",productos);    
        });
        
        socket.on("cambiarRol",async()=>{           
            let UM = new userMananger()
            let usuarios=await UM.getUsers({limit:"100000", page:'', query:'', sort:''})
            socketServer.emit("usuarios",usuarios); 
        })

        socket.on("eliminarUsuario",async()=>{           
            let UM = new userMananger()
            let usuarios=await UM.getUsers({limit:"100000", page:'', query:'', sort:''})
            socketServer.emit("usuarios",usuarios); 
        })



        socket.on("eliminarProducto",async()=>{           
            let PmNEW = new ProductManager()
            let productos=await PmNEW.getProducts({limit:"100000", page:'', query:'', sort:''})
            socketServer.emit("productos",productos); 
        })
        socket.on("newMessage",async(message)=>{
            let MM = new messageMananger()
            await MM.createMessage(message.user,message.message)
            let newMessage=await MM.getMessage()
            socketServer.emit("mensajes",newMessage); 
        })
    });

}




