const supertest = require('supertest');
const db = require('../../database/dbConfig');
const server = require('../../api/server');
const bcrypt = require('bcryptjs');

function createUserObject(username) {
  return { username, password: bcrypt.hashSync('password', 12) };
}

describe('jokes', () => {

  beforeEach(async () => {
    await db('users').truncate();
    await db('users').insert(createUserObject('testuser'));
  });
  afterAll(async () => {
    await db('users').truncate();
  });

  describe('get jokes', () => {
    it('can send Authorization token to get jokes', async () => {
      let token;

      //attempt to get jokes without authorization
      await supertest(server)
        .get('/api/jokes')
        .then(res => {
          expect(res.body).toHaveProperty('you');
        })
        .catch(err => console.log(err));

      //login to obtain token
      await supertest(server)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password' })
        .then(res => {
          token = res.body.token;
        })
        .catch(err => console.log(err));

      //get jokes with authorization token
      await supertest(server)
        .get('/api/jokes')
        .set({ Authorization: token })
        .then(res => {
          expect(res.body).not.toHaveProperty('you');
        })
        .catch(err => console.log(err));
    });
    it('returns 401 without authorization', async () => {
      await supertest(server)
        .get('/api/jokes')
        .then(res => {
          expect(res.status).toBe(401);
        })
        .catch(err => console.log(err));
    });
  });
});