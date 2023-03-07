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
let token2;
let userId2;

/*Study data for test*/
let studyId;
let studyTest;
let cloneStudy;

/*
@vjlh:
Test suite for Study API New Implementations.
*/
describe('Study API New Implementations', () => {
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
      });
      chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@email.com',
        password: 'user123'
      })
      .end((err, res) => {
        token2 = res.body.token;
        userId2 = res.body.user._id;
        res.should.have.status(200);
        done();
      });
  });

  /*
  @vjlh:
  Successful test for POST route    
  */
  describe('/POST study', () => {
      it('It should POST a study', (done) => {
          let studyTestBody = {
            name: 'Study Creation Test',
            description: 'Study Description Test',
            max_per_interval: 1,
            hours:2,
            minutes:2,
            seconds:0,
            user: userId,
            privacy: false,
            collaborators: '[]',
            tags: '["test","invitation"]',
            levels: '[]',
            language: "62b4c40b75c8e419c58e884e",
            competences: '[]',         
          }
          chai.request(app)
          .post('/api/study/')
          .set({ 'x-access-token': token })
          .send(studyTestBody)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Study successfully created');
              res.body.study.should.have.property('privacy');
              res.body.study.should.have.property('type');
              res.body.study.should.have.property('tags');
              res.body.study.should.have.property('edit');
              res.body.study.should.have.property('levels');
              res.body.study.should.have.property('competences');
              res.body.study.should.have.property('name');
              res.body.study.should.have.property('max_per_interval');
              res.body.study.should.have.property('cooldown');
              res.body.study.should.have.property('user');
              res.body.study.should.have.property('description');
              res.body.study.should.have.property('gm_code');
              res.body.study.should.have.property('collaborators');
              res.body.study.should.have.property('language');
              studyId = res.body.study._id;
              studyTest = res.body.study;
          done();
        });
    });
  });
  /*
  @vjlh:
  Successful test for get by user route 
  */
  describe('/GET/byUser/:userId studies', () => {
    it('It should GET all studies of a user', (done) => {
      chai.request(app)
      .get('/api/study/byUser/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.studies.should.be.a('array');
      done();
      });
    });
  });
  /*
  @vjlh:
  Successful test for get by user by privacy route 
  */
  describe('/GET/byUserbyPrivacy/:userId/:privacy studies', () => {
    it('It should GET all studies of a particular user filtered by privacy (public / private)', (done) => {
      chai.request(app)
      .get('/api/study/byUserbyPrivacy/'+userId+'/true')
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.studies.should.be.a('array');
      done();
      });
    });
  });
  /*
  @vjlh:
  Successful test for get by type route 
  */
  describe('/GET/byUserbyType/:userId/:type studies', () => {
    it('It should GET all studies of a particular user filtered by type (cloned / own)', (done) => {
      chai.request(app)
      .get('/api/study/byUserbyType/'+userId+'/own')
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.studies.should.be.a('array');
      done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for get by user for collaboration 
  */
  describe('/GET/byUserCollaboration/:userId/ studies', () => {
    it('It should GET all studies of a particular user in which is collaborator', (done) => {
      chai.request(app)
      .get('/api/study/byUserCollaboration/'+userId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.studies.should.be.a('array');
      done();
      });
    });
  });
  /*
  @vjlh:
  Successful test for get cloning route 
  */
  describe('/GET/copy/:id/user/:userId study', () => {
    it('It should GET a cloned study', (done) => {
      chai.request(app)
      .get('/api/study/copy/'+studyId+'/user/'+userId2+'/')
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Study successfully cloned');
        res.body.copy.should.have.property('privacy');
        res.body.copy.should.have.property('type').eql('clone');
        res.body.copy.should.have.property('tags');
        res.body.copy.should.have.property('edit');
        res.body.copy.should.have.property('levels');
        res.body.copy.should.have.property('competences');
        res.body.copy.should.have.property('name');
        res.body.copy.should.have.property('max_per_interval');
        res.body.copy.should.have.property('cooldown');
        res.body.copy.should.have.property('user').eql(userId2);
        res.body.copy.should.have.property('description');
        res.body.copy.should.have.property('gm_code');
        res.body.copy.should.have.property('collaborators');
        res.body.copy.should.have.property('language');
        cloneStudy = res.body.copy._id;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put request for edit route 
  */
  describe('/PUT/requestEdit/:id study', () => {
    it('It should PUT the edit list of a study to add the user id', (done) => {
      let body = {
        user: userId
      }
      chai.request(app)
      .put('/api/study/requestEdit/'+studyId)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Edit list successfully updated');
          res.body.should.have.property('users');
          res.body.users.should.be.a('array');
          res.body.users.length.should.be.eql(1);
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put route 
  */
  describe('/PUT/:id study', () => {
    it('It should PUT a study', (done) => {
        let studyPutTestBody = {
          name: 'Study Updated Creation Test',
          description: 'Study Updated Description Test',
          privacy: true,
          hours:3,
          minutes:2,
          seconds:0,
          tags:JSON.stringify(studyTest.tags.push("updated")),

          max_per_interval: studyTest.max_per_interval,
          collaborators: JSON.stringify(studyTest.collaborators),
          levels: JSON.stringify(studyTest.levels),
          language: studyTest.language._id,
          competences: JSON.stringify(studyTest.competences),
          user_edit: userId,
      }
        chai.request(app)
        .put('/api/study/'+studyId)
        .set({ 'x-access-token': token })
        .send(studyPutTestBody)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Study successfully updated');
            res.body.study.should.have.property('privacy');
            res.body.study.should.have.property('type');
            res.body.study.should.have.property('tags');
            res.body.study.should.have.property('edit');
            res.body.study.should.have.property('levels');
            res.body.study.should.have.property('competences');
            res.body.study.should.have.property('name');
            res.body.study.should.have.property('max_per_interval');
            res.body.study.should.have.property('cooldown');
            res.body.study.should.have.property('user');
            res.body.study.should.have.property('description');
            res.body.study.should.have.property('gm_code');
            res.body.study.should.have.property('collaborators');
            res.body.study.should.have.property('language');
            studyId = res.body.study._id;
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put release edit route 
  */
  describe('/PUT/releaseStudy/:id study', () => {
    it('It should PUT the edit list of a study to remove the user id', (done) => {
      let body = {
        user: userId
      }
      chai.request(app)
      .put('/api/study/releaseStudy/'+studyId)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Edit list successfully updated');
          res.body.should.have.property('study').should.be.a('object');
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for put edit collaborators route 
  */
  describe('/PUT/editCollaborator/:id study', () => {
    it('It should PUT list of collaborators of a study and update it', (done) => {
      let body = {
        collaborators: [{user:userId2, invitation:'Pendiente'}]
      }
      chai.request(app)
      .put('/api/study/editCollaborator/'+studyId)
      .set({ 'x-access-token': token })
      .send(body)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Collaborators list successfully updated');
          res.body.should.have.property('study');
          res.body.study.should.be.a('object');
          res.body.study.should.have.property('collaborators');
          res.body.study.collaborators.length.should.be.eql(1);
        done();
      });
    });
  });

  /*
  @vjlh:
  Successful test for delete by id route 
  */
  describe('/DELETE/:id study', () => {
    it('It should DELETE a study given the id', (done) => {
      chai.request(app)
      .delete('/api/study/' + studyId)
      .set({ 'x-access-token': token })
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Study successfully deleted');
      });
      chai.request(app)
      .delete('/api/study/' + cloneStudy)
      .set({ 'x-access-token': token2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Study successfully deleted');
        done();
      });
    });
  });
  

})