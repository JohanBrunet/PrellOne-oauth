const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OAuthClientSchema = new Schema({
    name: { type: String },
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array },
    grants: { type: Array }
})

mongoose.model('OAuthClient', OAuthClientSchema)
const oAuthClient = mongoose.model('OAuthClient')

oAuthClient.getClient = async(clientId, clientSecret = null) => {
    return clientSecret ? await oAuthClient.findOne({ clientId: clientId, clientSecret: clientSecret }).lean()
                        : await oAuthClient.findOne({ clientId: clientId }).lean()
}

module.exports = oAuthClient
