const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

describe('/users', () => {
  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    User.deleteMany({}, () => {
      done();
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /users', () => {
    it('creates a new user', done => {
      request(app)
        .post('/users')
        .send({ firstName: 'Rui', lastName: 'Correia', email: 'rui@correia.co', password: '123' })
        .then(res => {
          expect(res.status).toBe(201);
          User.findById(res.body._id, (_, user) => {
            expect(user.firstName).toBe('Rui');
            expect(user.lastName).toBe('Correia');
            expect(user.email).toBe('rui@correia.co');
            expect(user.password).not.toBe('123');
            expect(user.password.length).toBe(60);
            expect(res.body).not.toHaveProperty('password');
            done();
          });
        });
    });
  });
});
