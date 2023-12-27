'use strict'



const { StatusCodes, ReasonPhrases } = require("./httpStatusCode")

// const StatusCode = {
//     FORBIDDEN: 403,
//     CONFLICT: 409
// }

// const ReasonStatusCode = {
//     FORBIDDEN: 'Bad request error',
//     CONFLICT: 'Conflict error'
// }


class ErrorResponse extends Error {
    constructor(message, status){
        super(message);
        this.status = status;
    }
}

// List error handle

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

class MethodNotAllowedError extends ErrorResponse {
    constructor(message = ReasonPhrases.METHOD_NOT_ALLOWED, statusCode = StatusCodes.METHOD_NOT_ALLOWED) {
        super(message, statusCode);
    }
}

class NotAcceptableError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_ACCEPTABLE, statusCode = StatusCodes.NOT_ACCEPTABLE) {
        super(message, statusCode);
    }
}

class RequestTimeoutError extends ErrorResponse {
    constructor(message = ReasonPhrases.REQUEST_TIMEOUT, statusCode = StatusCodes.REQUEST_TIMEOUT) {
        super(message, statusCode);
    }
}

class InternalServerError extends ErrorResponse {
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
    }
}

class ServiceUnavailableError extends ErrorResponse {
    constructor(message = ReasonPhrases.SERVICE_UNAVAILABLE, statusCode = StatusCodes.SERVICE_UNAVAILABLE) {
        super(message, statusCode);
    }
}


// Thêm các lớp lỗi khác theo nhu cầu...

module.exports = {
    ConflictRequestError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    MethodNotAllowedError,
    NotAcceptableError,
    RequestTimeoutError,
    InternalServerError,
    ServiceUnavailableError,
    // ... Xuất các lớp lỗi khác theo nhu cầu ...
};