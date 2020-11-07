const Joi = require('joi');
const Study = require('../models/study');

const schema = Joi.object({
    
    docName: Joi.string()
        .required(),
    
    docType: Joi.string()
        .required(),
    
    title: Joi.string()
        .required(),

    url: Joi.string()
        .required(),    

    domain: Joi.string()
        .required(),

    locale: Joi.string()
        .required(),

    task: Joi.string()
        .required()
        
})

const editSchema = Joi.object({
    
    docName: Joi.string(),
    
    docType: Joi.string(),
    
    title: Joi.string(),

    url: Joi.string(),

    domain: Joi.string(),

    locale: Joi.string(),

    task: Joi.string()
})

verifyBody = async (req, res, next) => {
    try {
        const validation = await schema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
     }
};

verifyEditBody = async (req, res, next) => {
    try {
        const validation = await editSchema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
     }
};

const authMiddleware = {
    verifyBody,
    verifyEditBody
};

module.exports = authMiddleware;