// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
});

//We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
//Positive cases

// Successful Login
it('positive : /login', done => {
  chai
    .request(server)
    .post('/login')
    .send({username: "user", password: "password"})
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
});

// Failed Login
it('negative : /login', done => {
  chai
    .request(server)
    .post('/login')
    .send({username: "user", password: "abcde"})
    .end((err, res) => {
      expect(res).to.have.status(400);
      done();
    });
}); 

it('/getReviews', done => {
    chai
      .request(server)
      .get('/getReviews')
      .end((err, res) => {
        expect(res.body.status).to.equals('success');
        done();
      });
});