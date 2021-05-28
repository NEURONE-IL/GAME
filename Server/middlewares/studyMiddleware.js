const Joi = require('joi');
const Study = require('../models/study');

const schema = Joi.object({
    
    name: Joi.string()
        .required(),

    domain: Joi.string(),

    max_per_interval: Joi.number(),

    hours: Joi.number()
        .required(),

    minutes: Joi.number()
        .required(),
    
    seconds: Joi.number()
        .required(),
    
    description: Joi.string(),
})

const editSchema = Joi.object({
    
    name: Joi.string(),

    domain: Joi.string(),

    max_per_interval: Joi.number(),

    hours: Joi.number(),

    minutes: Joi.number(),
    
    seconds: Joi.number(),
    
    description: Joi.string(),
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