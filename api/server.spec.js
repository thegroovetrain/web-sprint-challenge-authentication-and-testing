const request = require('supertest')
const server = require('./server')
const db = require("../database/dbConfig")
const supertest = require('supertest')

beforeEach(async () => {
    await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

describe('/api/auth', () => {
    describe('POST /register', () => {
        it('creates a new user', async () => {
            const res = await supertest(server).post('/api/auth/register').send({
                username: 'test2',
                password: 'poopsword'
            })
            expect(res.statusCode).toBe(201)
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8")
        })
        it('rejects a registration using an existing username', async () => {
            const res = await supertest(server).post('/api/auth/register').send({
                username: 'test',
                password: 'poopsword'
            })
            expect(res.statusCode).toBe(409)
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8")
            expect(res.body.message).toBe('Username already taken.')
        })
    })

    describe("POST /login", () => {
        it('returns a json web token on a successful login', async () => {
            const res = await supertest(server).post('/api/auth/login').send({
                username: 'test',
                password: 'poopsword'
            })
            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
            expect(res.body.message).toBe('Welcome, test!')
            expect(res.body.token).toBeDefined()
        })
        it('rejects an incorrect password', async () => {
            const res = await supertest(server).post('/api/auth/login').send({
                username: 'test',
                password: 'wrong'
            })
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
            expect(res.body.message).toBe('Access denied!')
        })
        it('rejects a nonexistant username', async () => {
            const res = await supertest(server).post('/api/auth/login').send({
                username: 'wrong',
                password: 'poopsword'
            })
            expect(res.statusCode).toBe(401)
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
            expect(res.body.message).toBe('Access denied!')
        })
    })
})