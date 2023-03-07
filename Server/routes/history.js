const express = require('express');
const router = express.Router();
const History = require('../models/history');
const User = require('../models/user');
const Study = require('../models/study');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

//Traer todo el historial
router.get('' , [verifyToken, authMiddleware.isAdmin],async (req, res) => {
  History.find({}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({message:'Clone history successfully get', histories});
  });
})

//Traer todo el historial de un usuario

router.get('/byUser/:user_id' ,  [verifyToken], async (req, res) => {
  const _user_id = req.params.user_id;
  History.find({user: _user_id}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({message:'Clone history by user successfully get', histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'study', model: Study});
})

//Traer todo el historial relacionado a un estudio según el tipo de registro

router.get('/byStudyByType/:study_id/:type' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    const _study_id = req.params.study_id;
    const type = req.params.type;
  
    History.find({study: _study_id, type: type}, (err, histories) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({message:'Clone history by study successfully get', histories});
    }).populate({path: 'user', model: User, select:'-password'}).populate({path:'study', model: Study});
})


/* --- No se utiliza en la aplicación actualmente ---

//Traer todo el historial de un usuario según el tipo de registro
router.get('/byUserByType/:user_id/:type' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const _user_id = req.params.user_id;
  const type = req.params.type;

  History.find({user: _user_id, type: type}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'study', model: Study});
})

//Traer todo el historial relacionado a un estudio

router.get('/byStudy/:study_id' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const _study_id = req.params.study_id;
  History.find({study: _study_id}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({message:'Histories by study successfully get', histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'study', model: Study})
})

//Crear un registro en el historial
router.post('',  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const history = new History(req.body);
  history.save((err, history) => {
      if (err) {
          return res.status(404).json({
              err
          });
      }
      res.status(200).json({
          history
      });
  })
});*/

module.exports = router;