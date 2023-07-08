const crypto = require('crypto');


module.exports.SOFTWARE_ACCOUNT_TYPES = ["Accounting", "Others", "Others", "Others"]
module.exports.DEFAULT_ACCOUNT = "PERSONAL";
const generateVerificationCode = () => {
    let t = crypto.randomBytes(4).toString('hex');
    t = t.substring(0, 6);
    return t
};
module.exports.generateVerificationCode = generateVerificationCode;
