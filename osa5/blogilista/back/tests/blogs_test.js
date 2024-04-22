const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const manyBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]

beforeEach(async () => {
    await User.deleteMany({})
    await api.post('/api/users').send({
        username: 'testuser',
        password: 'password'
    })
    const response = await api.post('/api/login').send({
        username: 'testuser',
        password: 'password',
    })
    token = response.body.token
    await Blog.deleteMany({})
    let blogObject = new Blog(manyBlogs[0])
    await blogObject.save()
    blogObject = new Blog(manyBlogs[1])
    await blogObject.save()
})

test('correct amount of blogs are returned', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
})

test('id field is correct', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual((response.body.every(blog => 'id' in blog)), true)
})

test('adding blog works', async () => {
    const newBlog = manyBlogs[2]

    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 3)
})

test('empty likes sets zero', async () => {
    const newBlog = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        __v: 0
      }

    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body[2].likes, 0)
})

describe ('missing fields', () => {
    const newBlogNoTitle = {
        _id: "5a422b3a1b54a676234d17f9",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    }
    const newBlogNoUrl = {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        likes: 10,
        __v: 0
    }
    const newBlogNoAuthorNoUrl = {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        likes: 0,
        __v: 0
    }
    test('missing title causes error', async () => {
        await api
        .post('/api/blogs')
        .send(newBlogNoTitle)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, 2)
    })
    test('missing url causes error', async () => {
        await api
        .post('/api/blogs')
        .send(newBlogNoUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, 2)
    })
    test('missing author and url causes error', async () => {
        await api
        .post('/api/blogs')
        .send(newBlogNoAuthorNoUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, 2)
    })
})

describe('deleting', () => {
    test('delete works', async () => {
        const content = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(manyBlogs[2])
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const id = content.body.id

        await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, 2)
    })

    test('invalid id causes error', async () => {
        await api
        .delete(`/api/blogs/1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
})

describe('updating', () => {
    test('update works', async () => {
        const newBlog = {
            "title": "React patterns",
            "author": "Michael Chan",
            "url": "https://reactpatterns.com/",
            "likes": 10,
            "id": "5a422a851b54a676234d17f7"
        }
        await api
        .put('/api/blogs/5a422a851b54a676234d17f7')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body[0].likes, 10)
    })
    test('invalid id causes error', async () => {
        await api
        .put(`/api/blogs/1`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
})

test('adding fails with no token', async () => {
    await api
    .post('/api/blogs')
    .send(manyBlogs[2])
    .expect(400)
    .expect('Content-Type', /application\/json/)

    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
})

after(async () => {
  await mongoose.connection.close()
})