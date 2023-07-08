const Joi = require('joi');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// const SoftwareAccount = require("./../schemers/userAccount");
const UserAccount = require("./../models/userInfo");
const { DEFAULT_ACCOUNT } = require('./constant');

const generateVerificationCode = () => {
    let t = crypto.randomBytes(4).toString('hex');
    t = t.substring(0, 6);
    return t
};

const validateUserInput = (user) => {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required()
    };

    return Joi.validate(user, schema);
};

const validateOwnerInput = (owner) => {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        company: Joi.string().min(2).max(255).required()
    };

    return Joi.validate(owner, schema);
};

module.exports.validateUserInput = validateUserInput;
module.exports.validateOwnerInput = validateOwnerInput;


module.exports.generateVerificationCode = generateVerificationCode;

module.exports.SOFTWARE_ACCOUNT_TYPES = ["Accounting", "Others", "Others","Others"]

module.exports.VALIDATE_HEADER_TOKEN = async (req, res, next) => {
    // Middleware to verify the token in the header
    const header = req.header('Authorization');
    let token = null
    if (header) {
        token = header.split(" ")[1];
    }
    if (!token) return res.status(403).json({ 
        errors: [{ message: 'Access denied. No token provided.' }],
        success: false,
        status: 403,
        message: "failed", 
    });
    

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded){
            return res.status(401).send({
                errors: [{ message: 'Access denied. Invalid token provided.' }],
                success: false,
                status: 401,
                message: "failed",
            });
        }
        req.user = decoded.user;
        next();
    } catch (err) {
        req.LOGGER.error(err.message);
        let message = req.LOG_FAILED_REQUEST(req, err);
        return res.status(500).send({
            errors: [{ message: err.message }],
            success: false,
            status: 500,
            message: "failed",
        });
    }
}
module.exports.CHECK_USER_AND_ACCOUNT_UNDER = async(req, res, next) => {
    try{
        let userRequest = req.user;
        let user = await UserAccount.findOne({ _id: userRequest.id })
        if (!user) {
            return res.status(404).send({
                errors: [{ message: "User Not found" }],
                message: "failed",
                success: false,
                status: 404
            });
        }
        req.userInfo = user
        let { underAccount } = req.body ;
        
        // if (underAccount && underAccount !== DEFAULT_ACCOUNT) {
        //     let softwareAccount = await SoftwareAccount.findOne({ $or: [{ $and: [{ owner: user._id }, { _id: underAccount }] }, { $and: [{ users: { $in: [user._id] } }, { _id: underAccount }] }] });
        //     if (!softwareAccount) {
        //         return res.status(404).send({
        //             errors: [{ message: "Invalid User Account" }],
        //             message: "failed",
        //             success: false,
        //             status: 404
        //         });
        //     }
        // }
        if (underAccount === DEFAULT_ACCOUNT){
            req.body.underAccount = ''
        }
    }catch(err){
        req.LOG_FAILED_REQUEST(req, err);
        return res.status(401).send({
            status: 401,
            success: false,
            errors: [{ message: err.message }],
            message: err.message
        });
    }
    next();
}
module.exports.CHECK_USER_PRIVILAGES = async(req, res, next) => {


    // DO SOMETHING HERE
    next();
}