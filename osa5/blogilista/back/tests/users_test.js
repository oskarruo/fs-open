const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
})

describe('user creating', () => {
    test('user can be created with correct information', async () => {
        const correctUser = {
            "username": "tony77",
            "name": "Anthony",
            "password": "tone7"
        }
        await api
        .post('/api/users')
        .send(correctUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')
    
        assert.strictEqual(response.body.length, 1)
        assert.strictEqual(response.body[0].username, "tony77")
    })
    test('user creating fails with no username', async () => {
        const noUsernameUser = {
            "name": "Anthony",
            "password": "tone7"
        }
        const response = await api
        .post('/api/users')
        .send(noUsernameUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, "username missing")

        const responsetwo = await api.get('/api/users')
    
        assert.strictEqual(responsetwo.body.length, 0)
    })
    test('user creating fails with no password', async () => {
        const noPasswordUser = {
            "username": "tony77",
            "name": "Anthony"
        }
        const response = await api
        .post('/api/users')
        .send(noPasswordUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, "password missing")

        const responsetwo = await api.get('/api/users')
    
        assert.strictEqual(responsetwo.body.length, 0)
    })
    test('user creating fails with short username', async () => {
        const shortUsernameUser = {
            "username": "to",
            "name": "Anthony",
            "password": "tone7"
        }
        const response = await api
        .post('/api/users')
        .send(shortUsernameUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, "username needs to be at least 3 characters")

        const responsetwo = await api.get('/api/users')
    
        assert.strictEqual(responsetwo.body.length, 0)
    })
    test('user creating fails with short password', async () => {
        const shortPasswordUser = {
            "username": "tony77",
            "name": "Anthony",
            "password": "to"
        }
        const response = await api
        .post('/api/users')
        .send(shortPasswordUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, "password needs to be at least 3 characters")

        const responsetwo = await api.get('/api/users')
    
        assert.strictEqual(responsetwo.body.length, 0)
    })
    test('user creating fails with existing user', async () => {
        const correctUser = {
            "username": "tony77",
            "name": "Anthony",
            "password": "tone7"
        }
        await api
        .post('/api/users')
        .send(correctUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const response = await api
        .post('/api/users')
        .send(correctUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(response.body.error, "username is alreay in use")

        const responsetwo = await api.get('/api/users')
    
        assert.strictEqual(responsetwo.body.length, 1)
    })
})

after(async () => {
    await mongoose.connection.close()
})