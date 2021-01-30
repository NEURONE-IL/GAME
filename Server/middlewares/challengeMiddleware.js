const Joi = require('joi');
const { isValidObjectId } = require('mongoose');

const schema = Joi.object({
    
    question: Joi.string()
        .required(),

    question_type: Joi.string()
    .required(),        
    
    number: Joi.number(),
    
    seconds: Joi.number()
        .required(),

    hint: Joi.string(),

    answer_type: Joi.string()
        .required(),

    answer: Joi.string()
        .required(),

    study: Joi.any()
        .required(),

    max_attempts: Joi.number()
        .required()
        
})

const editSchema = Joi.object({
    
    question: Joi.string(),

    question_type: Joi.string(),

    number: Joi.number(),
    
    seconds: Joi.number(),

    hint: Joi.string(),

    answer_type: Joi.string(),

    answer: Joi.string(),

    study: Joi.any(),

    max_attempts: Joi.number()
})

const answerSchema = Joi.object({
    user: Joi.any()
        .required(),

    challenge: Joi.any()
        .required(),

    date: Joi.date(),

    timeLeft: Joi.number()
        .required(),

    hintUsed: Joi.boolean()
        .required(),

    answers: Joi.array().items(Joi.object({
        answer: Joi.string().allow(null, '')
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
    if(!isValidObjectId(req.body.challenge)){
        return res.status(404).json({
            ok: false,
            message: "Challenge doesn't exist!"
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