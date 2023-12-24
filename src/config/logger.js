import winston from "winston";
import config from "./config.js";


const customLevelOption={
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5

    }

}


const prodLogger=winston.createLogger({
    levels:customLevelOption.levels,
    transports:[
        new winston.transports.Console({level:'info'}),
        new winston.transports.File({filename:'./errors.log', level:'error'})
    ]
})

const devLogger=winston.createLogger({
    levels:customLevelOption.levels,
    transports:[
        new winston.transports.Console({level:'debug'}),
    ]
})


export const addlogger=(req, res, next) =>{
    if (config.enviroment=="desarrollo"){
        req.logger=devLogger
    }else{
        req.logger=prodLogger
    }
    req.logger.debug(`${req.method} en ${req.url}  - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
    req.logger.error(`${req.method} en ${req.url}  - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
    next()
}