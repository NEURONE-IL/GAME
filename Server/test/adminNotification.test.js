process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Study = require('../models/study');

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token;
let userId;
let studyId;

/*
@vjlh:
Test suite for Admin Notifications API.
*/
describe('Admin Notifications API', () => {
  /*
  @vjlh:
  Tries to authenticate the default user to get a JWT before apply each test.
  */    
  before((done) => {
      chai.request(app)
      .post('/api/auth/login')
      .send({
          email: 'admin@admin.com',
          password: 'admin123'
      })
      .end((err, res) => {
          token = res.body.token;
          userId = res.body.user._id;
          res.should.have.status(200);
          done();
      });
  });

  /*
  @vjlh:
  Successful test for get all by user route 
  */
  describe('/GET/byUser/:userId adminNotifications', () => {
    it('It should GET all notifications from a specific user with admin role', (done) => {
      chai.request(app)
      .get('/api/adminNotification/byUser/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Admin Notification by user successfully get');
        res.body.should.have.property('notifications');
        res.body.notifications.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for PUT all by user route 
  */
  describe('/PUT/seeNotifications/ adminNotifications', () => {
    it('It should PUT seen status to true for all notifications from a specific user with admin role', (done) => {
      let body = {
        userTo: userId
      };

      chai.request(app)
      .put('/api/adminNotification/seeNotifications')
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Successfully change of seen status for admin notifications');
        done();
      });
    });
  });

});