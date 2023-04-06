const jwt = require("jsonwebtoken");
const config = require("./../config/config");

module.exports.verifyJWTToken = (request, response, next) => {
    try {
        let token = request.headers.authorization;
        if (!token) {
            return response.status(403).json({
                status: false,
                message: "Invalid token or expired!",
                data: null,
            });
        } else {
            jwt.verify(token, config.JWT_AUTH_TOKEN, async (err, result) => {
                if (err) {
                    return response.status(401).json({
                        status: false,
                        message: "You are Not Authorized",
                        data: null,
                    });
                } else {
                    if (result) {
                        request.body.user = result;
                        return next();
                    } else {
                        return response.status(401).json({
                            status: false,
                            message: "Invalid token or expired!",
                            data: null,
                        });
                    }
                }
            });
        }
    } catch (e) {
        return response.status(500).json({
            status: false,
            message: "Invalid token or expired!",
            data: null,
        });
    }
};

module.exports.addJWTToken = (request, response, next) => {
    try {
        let token = request.headers.authorization;
        if (!token) {
            return next();
        } else {
            jwt.verify(token, config.JWT_AUTH_TOKEN, async (err, result) => {
                if (err) {
                    return next();
                } else {
                    if (result) {
                        request.body.user = result;
                        return next();
                    } else {
                        return next();
                    }
                }
            });
        }
    } catch (e) {
        return next();
    }
};
