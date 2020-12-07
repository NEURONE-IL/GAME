const Joi = require('joi');
const { isValidObjectId } = require('mongoose');


const schema = Joi.object({
    
    name: Joi.string()
        .required(),
    
    type: Joi.string()
        .required(),
    
    questions: Joi.array().items(Joi.object({
        question: Joi.string()
            .required(),
        
        number: Joi.number(),

        options: Joi.array().items(Joi.object({
            option: Joi.string()
                .required(),
    
            number: Joi.number()
        }))         
    }))   
})

const editSchema = Joi.object({
    
    name: Joi.string(),
    
    type: Joi.string(),
    
    questions: Joi.array().items(Joi.object({
        question: Joi.string()
            .required(),
        
        number: Joi.number(),

        options: Joi.array().items(Joi.object({
            option: Joi.string()
                .required(),
    
            number: Joi.number()
        }))         
    }))
})

const answerSchema = Joi.object({
    user: Joi.any()
        .required(),

    questionnaire: Joi.any()
        .required(),
    
    answers: Joi.array().items(Joi.object({
        question: Joi.string()
            .required(),

        answer: Joi.any()
            .required(),
        
        number: Joi.number()
    }))
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

verifyAnswerBody = async (req, res, next) => {
    if(!isValidObjectId(req.body.user)){
        return res.status(404).json({
            ok: false,
            message: "User doesn't exist!"
        });
    }
    if(!isValidObjectId(req.body.questionnaire)){
        return res.status(404).json({
            ok: false,
            message: "Questionnaire doesn't exist!"
        });
    }
    try {
        const validation = await answerSchema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
     }
}

const authMiddleware = {
    verifyBody,
    verifyEditBody,
    verifyAnswerBody
};

module.exports = authMiddleware;