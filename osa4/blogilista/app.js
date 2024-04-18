const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const {MONGODB_URI} = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const errorHandler = require('./utils/errorhandler')

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.use(errorHandler)

module.exports = app