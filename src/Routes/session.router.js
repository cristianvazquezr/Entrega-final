import { Router } from "express"
import userController from "../controllers/user.controller.js"
import passport from "passport"
import {passportCall} from '../utils.js'




//isntancio la clase cartManager

const UC = new userController()

const sessionRouter=Router()

//login con passport 
sessionRouter.post('/session/login', passport.authenticate('login'), UC.login)

//current
sessionRouter.get('/session/current',passportCall('jwt'),UC.current)

//login con passport github
sessionRouter.get('/session/github', passport.authenticate('github', {scope:'user:email'}), async(req, res)=>{ })

//login con passport github
sessionRouter.get('/session/githubCallBack', passport.authenticate('github', {failureRedirect:'/session/login'}),UC.loginGitHub )

//registro con passport
sessionRouter.post('/session/register',passport.authenticate('register'), UC.register)

//logout
sessionRouter.get('/session/logout',UC.logout)

//restore
sessionRouter.post('/session/restore', UC.restore)

//restore
sessionRouter.post('/session/recuperar', UC.recuperar)



export default sessionRouter