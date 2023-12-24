import EErrors from "../enums.js";

const errorHandler=(error, req, res, next)=>{
    console.error(error.cause)
    switch(error.code){
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({status:'error', error: error.message})
            break
        case EErrors.INVALID_PARAM:
            res.status(400).send({status:'error', error: error.message})
            break
        default:
            res.status(500).send({status:'error', error: error.message, message: "ahundled error"})
    }
    next()
}

export default errorHandler