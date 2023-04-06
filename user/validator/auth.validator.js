const Joi = require('joi')

module.exports.register = async (request, response, next) => {
    let rules = Joi.object().keys({
        name: Joi.string().min(3).max(30).required(),
        number: Joi.number().required(),
        password: Joi.string().min(3).max(15).required()
    });

    const { error } = rules.validate(request.body);

    if (error) {
        return response.status(422).json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};


module.exports.login = async (request,response,next) =>{
    let rules = Joi.object().keys({
        number: Joi.number().required(),
        password: Joi.string().min(3).max(15).required()
    });

    const {error} = rules.validate(request.body)

    if(error){
        return response.status(422).json({status:false, message:error,data:null})
    }
    else{
        return next()
    }
}

module.exports.verifyOtp = async (request,response,next) =>{
    
    const rules = Joi.object({
      number: Joi.number().required(),
      otp: Joi.number().integer().min(100000).max(999999).required().messages({
        'number.base': `"otp" must be a number`,
        'number.integer': `"otp" must be an integer`,
        'number.min': `"otp" must be a 6-digit number`,
        'number.max': `"otp" must be a 6-digit number`,
        'any.required': `"otp" is required`
      })
    });

    const {error} = rules.validate(request.body)

    if(error){
        return response.status(422).json({status:false, message:error,data:null})
    }
    else{
        return next()
    }
}

