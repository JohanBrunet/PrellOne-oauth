const mongoose = require('mongoose')
const Schema = mongoose.Schema
const scopes = require('../scopes')
const jwt = require('jsonwebtoken')

const OAuthAccessTokenSchema = new Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    client: {
        id: { type: String }
    },
    user: { type: Object }
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
        accessTokenExpiresOn: token.expiresAt,
        client: {
            id: client.id
        },
        scope: token.scope,
        user: user.id,
    })
    return new Promise((resolve, reject) => {
        accessToken.save((err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    }).then((saveResult) => {
        return saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult
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