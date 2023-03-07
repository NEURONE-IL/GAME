process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Study = require('../models/study');
const User = require('../models/user');

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token1;
let token2;
let userId1;
let user2;

/*Study data for test*/
let studyTest;

/*Invitations data for test*/
let invitationId;
let collabRequestId;

/*
@vjlh:
Test suite for Invitation API.
*/
describe('Invitation API', () => {
  /*
  @vjlh:
  Tries to authenticate the default user to get a JWT before apply each test.
  */    
  before((done) => {
    chai.request(app)
    .post('/api/auth/login')
    .send({
      email: 'user@email.com',
      password: 'user123'
    })
    .end((err, res) => {
      token2 = res.body.token;
      user2 = res.body.user;
      res.should.have.status(200);
    });

    chai.request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@admin.com',
      password: 'admin123'
    })
    .end((err, res) => {
      token1 = res.body.token;
      userId1 = res.body.user._id;
      res.should.have.status(200);

      studyTest = new Study({
        name: 'Study Invitation Test',
        description: 'Study Description Test',
        max_per_interval: 1,
        cooldown:3600,
        user: userId1,
        privacy: false,
        collaborators: [],
        tags: ["test","create"],
        levels: [],
        language: "62b4c40b75c8e419c58e884e",
        competences: [],          
      })
      studyTest.save(async (err, study) => {
        if(err){
          console.log(err)
        }
        await study.populate({path:'user', model:User}).execPopulate();
        done();
      });
    })
  });

  /*
  @vjlh:
  Successful test for POST to send an invitation to collaborate route
  */
  describe('/POST invitation', () => {
    it('It should POST a invitation to collaborate', (done) => {
        let body = {
            user: user2,
            study: studyTest           
        }
        chai.request(app)
        .post('/api/invitation/invitationToCollaborate')
        .set({ 'x-access-token': token2 })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation to collaborate succesfully sended');
          res.body.should.have.property('invitation');
          res.body.invitation.should.have.property('user');
          res.body.invitation.should.have.property('study');
          res.body.invitation.should.have.property('status').eql('Pendiente');
          invitationId = res.body.invitation._id;
          done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for POST route    
  */
  describe('/POST invitation', () => {
    it('It should POST a a collaboration request', (done) => {
        let body = {
            user: user2,
            study: studyTest           
        }
        chai.request(app)
        .post('/api/invitation/requestCollaboration')
        .set({ 'x-access-token': token2 })
        .send(body)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Request Collaboration succesfully post');
            res.body.should.have.property('invitation');
            res.body.invitation.should.have.property('user');
            res.body.invitation.should.have.property('study');
            res.body.invitation.should.have.property('status').eql('Pendiente');
            collabRequestId = res.body.invitation._id;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for GET checking pending invitation for a user with a study
  */
  describe('/GET/checkExist/:userId/:study_id Invitation', () => {
    it('It should GET if there are pending invitations for the user, from a study', (done) => {
      chai.request(app)
      .get('/api/invitation/checkExist/'+user2._id+'/'+studyTest._id)
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('EXISTING_INVITATION');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get all by user route 
  */
  describe('/GET/byUser/:userId Invitation', () => {
    it('It should GET all invitations of a user', (done) => {
      chai.request(app)
      .get('/api/invitation/byUser/'+user2._id)
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('Invitations by user successfully get');
        res.body.should.have.property('invitations');
        res.body.invitations.should.be.a('array');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for PUT route    
  */
  describe('/PUT/rejectInvitation/:type Invitation', () => {
    it('It should PUT rejected status for an invitation', (done) => {
        let type = 'collabRequest';
        let body = {
            _id: collabRequestId       
        }
        chai.request(app)
        .put('/api/invitation/rejectInvitation/'+type)
        .set({ 'x-access-token': token1 })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation succesfully rejected');
          res.body.should.have.property('invitation');
          res.body.invitation.should.have.property('user');
          res.body.invitation.should.have.property('study');
          res.body.invitation.should.have.property('status').eql('Rechazada');
        done();
      });
    });
  });
  
  /*
  @vjlh:
  Successful test for PUT route    
  */
  describe('/PUT/acceptInvitation/:type Invitation', () => {
    it('It should PUT accepted status for an invitation', (done) => {
        let type = 'invitation';
        let body = {
            _id: invitationId       
        }
        chai.request(app)
        .put('/api/invitation/acceptInvitation/'+type)
        .set({ 'x-access-token': token1 })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation succesfully accepted');
          res.body.should.have.property('invitation');
          res.body.invitation.should.have.property('user');
          res.body.invitation.should.have.property('study');
          res.body.invitation.should.have.property('status').eql('Aceptada');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for delete by id route 
  */
  describe('/DELETE/:id study', () => {
    it('It should DELETE a invitation given the id', (done) => {
      chai.request(app)
      .delete('/api/invitation/' + invitationId)
      .set({ 'x-access-token': token1 })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Invitation successfully deleted');
      });
      chai.request(app)
      .delete('/api/invitation/' + collabRequestId)
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Invitation successfully deleted');

        Study.deleteOne({_id: studyTest._id}, function (err, result){
          if (err){
              console.log(err)
          }
        })
        done();
      });
    });
  });
  
});