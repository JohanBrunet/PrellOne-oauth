const mongoose = require('mongoose')
const Schema = mongoose.Schema
const scopes = require('../scopes')
const jwt = require('jsonwebtoken')

var OAuthAccessTokenSchema = new Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    client: { type: Schema.Types.ObjectId, ref: "OAuthClient" },
    user: { type: Schema.Types.ObjectId, ref: "User" }
})

mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema)
const oAuthAccesToken = mongoose.model('OAuthAccessToken')

oAuthAccesToken.generateAccessToken = (client, user, scope) => {
    const payload = {
        userId: user._id,
        accessTokenExpiresOn: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    }
    return jwt.sign(payload, process.env.JWT_SECRET)
}

oAuthAccesToken.getAccessToken = (bearerToken) => {
    return oAuthAccesToken.findOne({ accessToken: bearerToken }).lean()
}

oAuthAccesToken.saveToken = (token, client, user) => {
    var accessToken = new oAuthAccesToken({
        accessToken: token.accessToken,
        accessTokenExpiresOn: token.accessTokenExpiresOn,
        client: client.clientId,
        scope: token.scope,
        user: user.id,
    })
    return new Promise((resolve, reject) => {
        accessToken.save((err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    }).then((saveResult) => {
        saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult

        var data = new Object()
        for (var prop in saveResult) data[prop] = saveResult[prop]

        data.client = data.clientId
        data.user = data.userId

        return data
    });
}

oAuthAccesToken.validateScope = async (user, client, scope) => {
    return scope
        .split(' ')
        .filter(s => scopes.indexOf(s) >= 0)
        .join(' ');
}

oAuthAccesToken.verifyScope = async (token, scope) => {
    if (!token.scope) {
        return false;
    }
    let requestedScopes = scope.split(' ');
    let authorizedScopes = token.scope.split(' ');
    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
}

module.exports = oAuthAccesToken