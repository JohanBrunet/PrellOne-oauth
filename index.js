const express     = require('express'),
    bodyParser  = require('body-parser'),
    cors        = require('cors'),
    engine      = require('ejs-locals'),
    path        = require('path'),
    mongoose    = require('mongoose'),
    dotenv      = require('dotenv'),
    uuid        = require('uuid')

const app = express()

process.env.JWT_SECRET = uuid.v4();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, '/views'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')

// Load environment variables from .env file
dotenv.load()

const databaseUrl = process.env.DB_USER != null && process.env.DB_USER != ""
                    ? `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
                    : `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
mongoose.connect(databaseUrl, { useNewUrlParser: true })
.then(() => {
    console.log('Connection to database succesful')
})
.catch((err) => console.error(err));

app.use('/oauth', require('./routes'))

app.use( (err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500);
    res.send({
        message: err.status != 500 ? err.message : "Internal server error",
        error: {}
    })
})

app.listen(3000)
console.log("Server listening on port 3000");