const oAuthAccessToken = require('./models').oAuthAccesToken
const oAuthClient = require('./models').oAuthClient
const oAuthAutorizationCode = require('./models').oAuthAutorizationCode


module.exports.generateAccessToken = oAuthAccessToken.generateAccessToken
module.exports.getAccessToken = oAuthAccessToken.getAccessToken
module.exports.saveToken = oAuthAccessToken.saveToken
module.exports.revokeToken = oAuthAccessToken.revokeToken
module.exports.validateScope = oAuthAccessToken.validateScope
module.exports.verifyScope = oAuthAccessToken.verifyScope

module.exports.getAuthorizationCode = oAuthAutorizationCode.getAuthorizationCode
module.exports.saveAuthorizationCode = oAuthAutorizationCode.saveAuthorizationCode
module.exports.revokeAuthorizationCode = oAuthAutorizationCode.revokeAuthorizationCode

module.exports.getClient = oAuthClient.getClient

