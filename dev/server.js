'use strict'

const express = require('express')
const stoplightExpressCustom = require('../index.js')
const config = require('./swagger.mock.json')

const app = express()
const port = process.env.PORT || 4000

app.use(
    stoplightExpressCustom({
        title: 'Stoplight Express Custom — Dev',
        poweredBy: 'dev mock',
        config,
    })
)

app.listen(port, () => {
    console.log(`Dev docs -> http://localhost:${port}/docs`)
})
