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
        .send({
          firstName: 'Rui',
          lastName: 'Correia',
          email: 'rui@correia.co',
          password: '12345678',
        })
        .then(res => {
          expect(res.status).toBe(201);
          User.findById(res.body._id, (_, user) => {
            expect(user.firstName).toBe('Rui');
            expect(user.lastName).toBe('Correia');
            expect(user.email).toBe('rui@correia.co');
            expect(user.password).not.toBe('12345678');
            expect(user.password.length).toBe(60);
            expect(res.body).not.toHaveProperty('password');
            done();
          });
        });
    });

    it('checks if the provided email is valid', done => {
      request(app)
        .post('/users')
        .send({ firstName: 'Rui', lastName: 'Correia', email: 'ruicorreia', password: '12345678' })
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.errors.email).toBe('Invalid email address.');

          User.countDocuments({}, function(err, count) {
            expect(count).toBe(0);
          });

          done();
        });
    });

    it('checks if the provided password is valid', done => {
      request(app)
        .post('/users')
        .send({
          firstName: 'Rui',
          lastName: 'Correia',
          email: 'rui@correia.com',
          password: '1234567',
        })
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.errors.password).toBe('Password must be at least 8 characters long.');
          done();
        });
    });
  });
});
