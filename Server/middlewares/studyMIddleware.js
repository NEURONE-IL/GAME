const Joi = require('joi');
const Study = require('../models/study');

const schema = Joi.object({
    
    name: Joi.string()
        .required(),
    
    description: Joi.string(),
})

const editSchema = Joi.object({
    
    name: Joi.string(),
    
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