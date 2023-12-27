"use strict";

const AccessService = require("../services/access.service");
const { CREATEDResponse, SuccessResponse } = require("../core/success.response");

class AccessController {

  handlerRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: 'Get token Success!',
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken) //???
    // }).send(res);

    //v2 fixed
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  }


  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res);
  }


  signUp = async (req, res, next) => {
    new CREATEDResponse ({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res);
  }
  
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout Success!',
      metadata: await AccessService.logout( req.keyStore )
    }).send(res);
  }
}

module.exports = new AccessController();
