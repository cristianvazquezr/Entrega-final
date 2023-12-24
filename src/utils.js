import {fileURLToPath} from "url"
import {dirname} from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from "passport"
import multer from "multer"



//codigo para JWT

const private_key='secr3to'

export const generateToken=(user)=>{
    const token = jwt.sign({user},private_key,{expiresIn:'24h'})
    return token
}

export const authToken=(req,res,next)=>{
    const authHeder=req.headers.authorization;
    if(!authHeder) return res.status(401).send({error:'no autorizado'})
    const token = authHeder
    jwt.verify(token,private_key,(error,credentials)=>{
        if(error) return res.status(403).send({error: 'no autorizado'});
        req.user= credentials.user;
        next();
    })
}

export const handlePlicies=policies=>(req,res,next)=>{
    if (policies[0]=="public"){
        return next()
    }
    const authHeder=req.headers.authorization;
    if(!authHeder) return res.status(401).send({error:'no autorizado'})
    const token = authHeder
    let user=jwt.verify(token,private_key)
    if(!policies.includes(user.role.ToUpperCase())) return res.status(403).send({error: 'no autorizado'});
    req.user = user;
    next();

}

//midleware para autenticar y mostrar mensajes personalizados de error

export const passportCall=(strategy)=>{
    return async (req,res,next) =>{
        passport.authenticate(strategy,function(err,user,info){
            if(err) return next(err);
            if(!user){
                return res.status(401).send({error:info.messages?info.messages:info.toString()})
            }
            req.user=user.user;
            next();
        })(req,res,next)
    }
}


//middleware de autorizacion

export const authorizationAdminPremium =()=>{
    return async (req, res, next)=>{

        if(req.user.role!="premium" && req.user.role!="admin") return res.status(403).send({error:"no posee permisos administrador para ver esta pagina"})
        return next()
    }
    
}

export const authorization=(role)=>{
    return async (req, res, next)=>{
        if(req.user.role!=role) return res.status(403).send({error:"no posee permisos administrador para ver esta pagina"})
        return next()
    }
    
}

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (user, password)=> bcrypt.compareSync(password, user.password)

const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)

// configuracion de multer para subir archivos

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        if(file.fieldname=='document'){
            cb(null,`${__dirname}/public/images/documents`)
        }else if(file.fieldname=='profile'){
            cb(null,`${__dirname}/public/images/profile`)
        }else{
            cb(null,`${__dirname}/public/images/products`)
        }
    },
    filename:function(req,file,cb){
        console.log(file)
        cb(null,`${Date.now()}-${file.originalname}` )
    }

})

export const uploader=multer({storage,onError:function(err,next){
    console.log(err);
    next();
}})


export default __dirname
