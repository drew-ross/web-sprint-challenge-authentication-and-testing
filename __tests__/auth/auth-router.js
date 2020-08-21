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
});