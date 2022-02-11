const express = require('express')
let path = require('path')
const cors = require('cors')

const app = express()

var corsOptions = {
    origin: 'http://localhost:3000',
    methods: "GET"
}
app.use(cors(corsOptions))

app.use(express.static('src'))

//app.use(express.static('assets'))

app.get('/', (req,res)=> {
    res.sendFile(req.path, {
        root: path.join(__dirname, '/')
    })
})

module.exports = app;