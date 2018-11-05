const express = require('express')
const bodyParser = require('body-parser')

const Tokenizer = require('./Tokenizer')
const request = require('request-promise-native')

const tokenizer = new Tokenizer()
const app = express()
app.use(bodyParser.json())

app.post('/tokenize', async (req, res, next) => {
    try {
        const response = await tokenizer.tokenize(req.body)
        res.json(response)
    } catch (err) {
        next(err)
    }
})

app.post('/untokenize', async (req, res, next) => {
    try {
        const { payload, dest } = req.body
        const untokenized = await tokenizer.untokenize(payload)
        const response = await request({
            method: 'POST',
            body: untokenized,
            uri: dest.url
        })
        res.json(response)
    } catch (err) {
        next(err)
    }
})

module.exports = app
