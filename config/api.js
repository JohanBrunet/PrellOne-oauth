// define port for app to run on in development mode

const config = {};
config.api = {};


// API host & port config

config.api.devHost = 'http://localhost';
config.api.devPort = 8080;

config.api.stagingHost = 'https://prellone-dev-api.igpolytech.fr';
config.api.stagingPort = 3000;

config.api.host = 'https://prellone-api.igpolytech.fr';
config.api.port = 3000;

let apiUrl = null

switch(process.env.NODE_ENV) {
    case 'production':
        apiUrl = config.api.host
    case 'staging':
        apiUrl = config.api.stagingHost
    default:
        apiUrl = `${config.api.devHost}:${config.api.devPort}`
}

module.exports = apiUrl;