const express = require('express');
const router = express.Router();
const Invitation = require('../models/invitation');
const User = require('../models/user');
const Study = require('../models/study');
const AdminNotification = require('../models/adminNotification')

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

/*
@Valentina Ligueño
TESTED: Método para traer todas las invitaciones de un usuario
*/
router.get('/byUser/:user_id' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const _user_id = req.params.user_id;
  Invitation.find({user: _user_id}, (err, invitations) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      invitations.reverse();
      res.status(200).json({message:'Invitations by user successfully get', invitations});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'study', model: Study, populate: {path: 'user', model: User, select:'-password'}});
})

/*
@Valentina Ligueño
TESTED: Método para verificar si existen invitaciones pendientes para usuario de un estudio en específico
*/
router.get('/checkExist/:user_id/:study_id' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    const _user_id = req.params.user_id;
    const _study_id = req.params.study_id;
    
    const invitation = await Invitation.findOne({user: _user_id, status: 'Pendiente', study: _study_id}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    //console.log(invitation)
    if(invitation != null)
        return res.status(200).json({message: "EXISTING_INVITATION"})
    else  
        return res.status(200).json({message: "NOT_EXISTING_INVITATION"})

})

/*
@Valentina Ligueño
TESTED: Método para aceptar una invitación
*/
router.put('/acceptInvitation/:type' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    const type = req.params.type
    const _invitation_id = req.body._id;
    const invitation = await Invitation.findOne({_id: _invitation_id}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    }).populate({path:'user', model: User, select:'-password'});

    const study = await Study.findOne( {_id: invitation.study}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    }).populate({path:'user', model: User, select:'-password'})

    let _user_id = JSON.stringify(invitation.user._id);

    if(type === 'invitation'){
        let index = study.collaborators.findIndex( coll => JSON.stringify(coll.user) === _user_id)
        study.collaborators[index].invitation = 'Aceptada'
        
        const newNotification = new AdminNotification ({
            userFrom: invitation.user,
            userTo: study.user,
            type: 'invitation_response',
            description:invitation.user.names +' '+ invitation.user.last_names+' ha aceptado colaborar en su estudio: '+study.name,
            seen: false,
        });
        newNotification.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }
    else{
        let newColl = {user: invitation.user, invitation:'Aceptada'};
        study.collaborators.push(newColl);
        
        const newNotification = new AdminNotification ({
            userFrom: study.user,
            userTo: invitation.user,
            type: 'invitation_response',
            description: study.user.names +' '+ study.user.last_names+' ha aceptado su solicitud de colaboración en el estudio: '+study.name,
            seen: false,
        });
        newNotification.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }
    
    study.updatedAt = Date.now();
    study.save((err, study) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    })

    invitation.status = 'Aceptada';
    invitation.save( async (err, invitation) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        await invitation.populate({path: 'user', model: User, select:'-password'})
                        .populate({path:'study', model: Study, populate: {path: 'user', model: User, select:'-password'}}).execPopulate()
        res.status(200).json({
            message: 'Invitation succesfully accepted',
            invitation
        });
    })

  })

/*
@Valentina Ligueño
TESTED: Método para rechazar una invitación
*/
router.put('/rejectInvitation/:type' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    const type = req.params.type;

    const _invitation_id = req.body._id;
    const invitation = await Invitation.findOne({_id: _invitation_id}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    }).populate({path:'user', model: User, select:'-password'});
    //console.log(invitation);
    const study = await Study.findOne( {_id: invitation.study}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    }).populate({path:'user', model: User, select:'-password'})
    
    if(type === 'invitation'){
        let _user_id = JSON.stringify(invitation.user);
        let index = study.collaborators.findIndex( coll => JSON.stringify(coll.user) === _user_id);
        study.collaborators.splice( index, 1 );
        study.updatedAt = Date.now();
        study.save((err, study) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        })
        const newNotification = new AdminNotification ({
            userFrom: invitation.user,
            userTo: study.user,
            type: 'invitation_response',
            description: invitation.user.names +' '+ invitation.user.last_names+' ha rechazado su invitación para colaborar en el estudio: '+study.name,
            seen: false,
        });
        newNotification.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }
    else{
        const newNotification = new AdminNotification ({
            userFrom: study.user,
            userTo: invitation.user,
            type: 'invitation_response',
            description: study.user.names +' '+ study.user.last_names+' ha rechazado su solicitud de colaboración en el estudio: '+study.name,
            seen: false,
        });
        newNotification.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }

    invitation.status = 'Rechazada';
    invitation.save( async (err, invitation) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        await invitation.populate({path: 'user', model: User, select:'-password'})
                        .populate({path:'study', model: Study, populate: {path: 'user', model: User, select:'-password'}}).execPopulate()
        res.status(200).json({
            message: 'Invitation succesfully rejected',
            invitation
        });
    })

  })

  
/*
@Valentina Ligueño
TESTED: Método para enviar una solicitud de colaboración para un estudio
*/
router.post('/requestCollaboration' ,  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    const invitation = new Invitation ({
        user: req.body.user,
        study: req.body.study._id,
        status: 'Pendiente',
    });
    invitation.save( err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    const notification = new AdminNotification ({
        userFrom:req.body.user,
        userTo: req.body.study.user._id,
        type: 'collabRequest',
        invitation: invitation._id,
        description:req.body.user.names + ' ' + req.body.user.last_names + ' desea colaborar en su estudio: ' + req.body.study.name,
        seen: false,
    });
    notification.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            message:'Request Collaboration succesfully post',
            invitation
        });
    })
});

/*
@Valentina Ligueño
TESTED: Método para enviar una invitación de colaboración a una aventura
*/
router.post('/invitationToCollaborate',  [verifyToken, authMiddleware.isAdmin], async (req, res) => {
    Study.findOne({_id: req.body.study._id}, (err, study) => {
        if(err){
            return res.status(404).json({
                err
            });
        }
        study.collaborators.push({user:req.body.user, invitation:'Pendiente'})
        study.save((err) => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    })
    const invitation = new Invitation ({
        user: req.body.user,
        study: req.body.study._id,
        status: 'Pendiente',
    });
    invitation.save( err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    const notification = new AdminNotification ({
        userFrom: req.body.study.user._id,
        userTo:req.body.user,
        type: 'invitation',
        invitation: invitation._id,
        description:'Invitación para colaborar en la aventura: ' + req.body.study.name,
        seen: false,
    });
    notification.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    res.status(200).json({
        message:'Invitation to collaborate succesfully sended',
        invitation
    });
});
/*
@Valentina Ligueño
TESTED: Método para eliminar una invitación con su notificación asociada
*/
router.delete('/:invitation_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.invitation_id;

    await AdminNotification.deleteOne({invitation: _id}, (err) => {
        if (err) {
          return res.status(404).json({
              err
          });
        }
    })
    await Invitation.deleteOne({_id: _id}, (err) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }

        res.status(200).json({
            message: 'Invitation successfully deleted',
        });
    });
});

module.exports = router;
