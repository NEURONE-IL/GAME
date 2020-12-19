const Joi = require('joi');
const User = require('../models/user');
const Role = require('../models/role');

const schema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }),

    tutor_names: Joi.string()
        .alphanum()
        .required(),
    
    tutor_last_names: Joi.string()
        .alphanum()
        .required(),

    names: Joi.string()
        .alphanum()
        .required(),
    
    last_names: Joi.string()
        .alphanum()
        .required(),
    
    tutor_rut: Joi.string()
        .required(), 
    
    tutor_phone: Joi.string()
        .required(),

    birthday: Joi.date()
        .required(),
    
    course: Joi.string()
        .required(),

    institution: Joi.string()
        .required(),
    
    institution_commune: Joi.number()
        .required(),

    institution_region: Joi.number()
        .required()
})

const adminSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }),
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

verifyBodyAdmin = async (req, res, next) => {
    try {
        const validation = await adminSchema.validateAsync(req.body);
        next();
    }
    catch(err){
        return res.status(400).json({
            ok: false,
            err
        });
    }
}

uniqueEmail = async(req, res, next) => {
    await User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(user){
            console.log(user);
            return res.status(403).json({
                ok: false,
                message: "Email already exists!"
            });
        }
        else{
            next();
        }
    })
}

isAdmin = async(req, res, next) => {
    User.findById(req.user).exec((err, user) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }

        Role.findOne(
            {
                _id: user.role
            },
            (err, role) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }

                if (role.name === 'admin') {
                    next();
                    return;
                }

                res.status(403).send({ message: "Require Admin Role!" });
                return;
            }
        );
    });
}

const authMiddleware = {
    verifyBody,
    verifyBodyAdmin,
    uniqueEmail,
    isAdmin
};

module.exports = authMiddleware;