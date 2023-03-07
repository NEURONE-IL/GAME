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
Test suite for History Clone API.
*/
describe('CloneHistory API', () => {
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
  Successful test for get all route 
  */
  describe('/GET/ cloningHistory', () => {
    it('It should GET all cloning history', (done) => {
      chai.request(app)
      .get('/api/history/')
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Clone history successfully get');
        res.body.should.have.property('histories');
        res.body.histories.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get all by user route 
  */
  describe('/GET/:userId cloningHistory', () => {
    it('It should GET all cloning history of a user', (done) => {
      chai.request(app)
      .get('/api/history/byUser/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Clone history by user successfully get');
        res.body.should.have.property('histories');
        res.body.histories.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get all clone by study route 
  */
  describe('/GET/byStudyByType/:studyId/:type cloningHistory', () => {
    it('It should GET all cloning history of a study', (done) => {
      let type = 'clone';
      Study.findOne({user:userId}, function (err, study){
        if (err){
            console.log(err)
        }
        chai.request(app)
        .get('/api/history/byStudyByType/'+study._id+'/'+type)
        .set({ 'x-access-token': token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Clone history by study successfully get');
          res.body.should.have.property('histories');
          res.body.histories.should.be.a('array');
          done();
        });
      })
    });
  });


});