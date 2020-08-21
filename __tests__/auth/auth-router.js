const supertest = require('supertest');
const db = require('../../database/dbConfig');
const server = require('../../api/server');
const bcrypt = require('bcryptjs');

function createUserObject(username) {
  return { username, password: bcrypt.hashSync('password', 12) };
}

describe('authorization', () => {

  beforeEach(async () => {
    await db('users').truncate();
    await db('users').insert(createUserObject('testuser'));
  });
  afterAll(async () => {
    await db('users').truncate();
  });

  describe('register', () => {
    it('can register a new user', async () => {
      let users = await db('users');
      expect(users).toHaveLength(1);

      await supertest(server)
        .post('/api/auth/register')
        .send(createUserObject('newuser'))
        .then()
        .catch(err => console.log(err));

      users = await db('users');
      expect(users).toHaveLength(2);
    });
    it('returns 201', async () => {
      await supertest(server)
        .post('/api/auth/register')
        .send(createUserObject('newuser'))
        .then(res => {
          expect(res.status).toBe(201);
        })
        .catch(err => console.log(err));
    });
  });
  
  describe('login', () => {
    it('can login user, get token', async () => {
      let users = await db('users');
      expect(users).toHaveLength(1);

      await supertest(server)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password' })
        .then(res => {
          expect(res.body).toHaveProperty('token');
        })
        .catch(err => console.log(err));
    });
    it('returns 200', async () => {
      await supertest(server)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password' })
        .then(res => {
          expect(res.status).toBe(200);
        })
        .catch(err => console.log(err));
    });
  });
});