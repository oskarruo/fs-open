const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const {MONGODB_URI} = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const errorHandler = require('./utils/errorhandler')
const tokenExtractor = require('./utils/tokenextractor')
const userExtractor = require('./utils/userextractor')

mongoose.connect(MONGODB_URI)

app.use(tokenExtractor)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)

module.exports = app