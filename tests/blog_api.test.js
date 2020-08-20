const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blog_test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.testBlogs.map(e => {
        return new Blog(e)
    })
    const promiseArray = blogObjects.map(e => e.save())
    await Promise.all(promiseArray)
})

describe('blogs supertest', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('content-type', /application\/json/)
    })

    test('blogs are named id', async () => {
        const result = await helper.blogsInDb()
        expect(result[0]._id).toBeDefined()
    })

    test('blog can be added', async () => {
        const newBlog = {
            'author': 'haobai',
            'title': 'test test test test',
            'url': 'http://www.github.com',
            'likes': 1
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(r => r.title)

        expect(blogsAtEnd).toHaveLength(helper.testBlogs.length + 1)
        expect(titles).toContain(
            'test test test test'
        )
    })

    test('blog set default likes', async () => {
        const newBlog = {
            'author': 'haobai',
            'title': 'test test test test',
            'url': 'http://www.github.com'
        }

        const { body } = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(body.likes).toBe(0)
    })

    test('blog must has title and url', async () => {
        const newBlog = {
            'author': 'haobai'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})


afterAll(() => {
    mongoose.connection.close()
})
