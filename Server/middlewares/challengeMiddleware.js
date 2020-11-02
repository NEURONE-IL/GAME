const Joi = require('joi');
const Study = require('../models/study');

const schema = Joi.object({
    
    question: Joi.string()
        .required(),
    
    seconds: Joi.number()
        .required(),
    
    domain: Joi.string()
        .required(),

    locale: Joi.string()
        .required(),    

    task: Joi.string()
        .required(),

    hint: Joi.string()
        .required(),

    answer_type: Joi.string()
        .required(),

    answer: Joi.string()
        .required(),

    study: Joi.any()
        .required()
        
})

const editSchema = Joi.object({
    
    question: Joi.string(),
    
    seconds: Joi.number(),
    
    domain: Joi.string(),

    locale: Joi.string(),

    task: Joi.string(),

    hint: Joi.string(),

    answer_type: Joi.string(),

    answer: Joi.string(),

    study: Joi.any()
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

const authMiddleware = {
    verifyBody,
    verifyEditBody
};

module.exports = authMiddleware;