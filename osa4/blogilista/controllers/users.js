const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const users = await User.find({})

  if (username == undefined) {
    return response.status(400).json({ error: 'username missing' })
  }
  else if (password == undefined) {
    return response.status(400).json({ error: 'password missing' })
  }
  else if (username.length < 3) {
    return response.status(400).json({ error: 'username needs to be at least 3 characters' })
  }
  else if (password.length < 3) {
    return response.status(400).json({ error: 'password needs to be at least 3 characters' })
  }

  users.forEach(user => {
    if (user.username == username) {
        return response.status(400).json({ error: 'username is alreay in use' })
    }
  })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter