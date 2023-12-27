'use strict';

const { StatusCodes, ReasonPhrases } = require("./httpStatusCode");

class SuccessResponse {
    constructor({message, statusCode = StatusCodes.OK, reasonPhrase = ReasonPhrases.OK, metadata = {} }) {
        this.message = !message ? reasonPhrase : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send (res, header = {}) {
        return res.status( this.status ).json( this )
    }
}

// Các class cụ thể cho từng loại phản hồi thành công
class OKResponse extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata});
    }
}

class CREATEDResponse extends SuccessResponse {
    constructor({options= {}, message, statusCode = StatusCodes.CREATED, reasonPhrase = ReasonPhrases.CREATED, metadata}) {
        super({message, statusCode, reasonPhrase, metadata});
        this.options = options;
    }
}

class AcceptedResponse extends SuccessResponse {
    constructor({message, statusCode = StatusCodes.ACCEPTED, reasonPhrase = ReasonPhrases.ACCEPTED, metadata}) {
        super({message, statusCode, reasonPhrase, metadata});
    }
}

class NonAuthoritativeInformationResponse extends SuccessResponse {
    constructor({message, statusCode = StatusCodes.NON_AUTHORITATIVE_INFORMATION, reasonPhrase = ReasonPhrases.NON_AUTHORITATIVE_INFORMATION, metadata}) {
        super({message, statusCode, reasonPhrase, metadata});
    }
}

class NoContentResponse extends SuccessResponse {
    constructor({message, statusCode = StatusCodes.NO_CONTENT, reasonPhrase = ReasonPhrases.NO_CONTENT, metadata = null}) {
        super({message, statusCode, reasonPhrase, metadata});
    }
}

class ResetContentResponse extends SuccessResponse {
    constructor({message, statusCode = StatusCodes.RESET_CONTENT, reasonPhrase = ReasonPhrases.RESET_CONTENT, metadata}) {
        super({message, statusCode, reasonPhrase, metadata});
    }
}

class PartialContentResponse extends SuccessResponse {
    constructor({message, statusCode = StatusCodes.PARTIAL_CONTENT, reasonPhrase = ReasonPhrases.PARTIAL_CONTENT, metadata}) {
        super({message, statusCode, reasonPhrase, metadata});
    }
}

class MultiStatusResponse extends SuccessResponse {
    constructor({message, statusCode = StatusCodes.MULTI_STATUS, reasonPhrase = ReasonPhrases.MULTI_STATUS, metadata}){
        super({message, statusCode, reasonPhrase, metadata});
    }
}

class AlreadyReportedResponse extends SuccessResponse {
    constructor({message, statusCode = StatusCodes.ALREADY_REPORTED, reasonPhrase = ReasonPhrases.ALREADY_REPORTED, metadata}) {
        super({message, statusCode, reasonPhrase, metadata});
    }
}

class IMUsedResponse extends SuccessResponse {
    constructor({message, statusCode = StatusCodes.IM_USED, reasonPhrase = ReasonPhrases.IM_USED, metadata}) {
        super({message, statusCode, reasonPhrase, metadata});
    }
}


// ... Thêm các lớp phản hồi thành công khác theo nhu cầu ...

module.exports = {
    OKResponse,
    CREATEDResponse,
    AcceptedResponse,
    NonAuthoritativeInformationResponse,
    NoContentResponse,
    ResetContentResponse,
    PartialContentResponse,
    MultiStatusResponse,
    AlreadyReportedResponse,
    IMUsedResponse,
    SuccessResponse
    // ... Xuất các lớp phản hồi thành công khác nếu cần ...
};