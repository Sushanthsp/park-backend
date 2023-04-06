const Joi = require('joi')

module.exports.book = async (request, response, next) => {
    let rules = Joi.object().keys({
        vehicleType: Joi.string().required().valid("car", "bike", "truck").required(),
        dateOfParking: Joi.string()
            .pattern(/^20\d{2}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/)
            .required(),
        endDateOfParking: Joi.string()
            .pattern(/^20\d{2}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/)
            .required(),
        vehicleNo: Joi.string().required().alphanum().min(1).max(10),
        slotNumber: Joi.number().required().min(1).max(200),
    });
    const { error } = rules.validate(request.body);

    if (error) {
        return response.status(422).json({ status: false, message: error.details[0].message, data: null });
    } else {
        return next();
    }
};

module.exports.getBooking = async (request, response, next) => {
    let rules = Joi.object({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso()
    }).unknown(false);
    const { error } = rules.validate(request.body);

    if (error) {
        return response.status(422).json({ status: false, message: error.details[0].message, data: null });
    } else {
        return next();
    }
};

