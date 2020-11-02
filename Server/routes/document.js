const express = require('express');
const router = express.Router();
const Document = require('../models/document');

const authMiddleware = require('../middlewares/authMiddleware');
const documentMiddleware = require('../middlewares/documentMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    Document.find({}, (err, documents) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({documents});
    });
})

router.get('/:document_id', [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.document_id;
    Document.findOne({_id: _id}, (err, document) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({document});
    });
});

router.post('',  [verifyToken, authMiddleware.isAdmin, documentMiddleware.verifyBody], async (req, res) => {
    const document = new Document(req.body);
    document.save((err, document) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            document
        });
    })
});

router.put('/:document_id', [verifyToken, authMiddleware.isAdmin, documentMiddleware.verifyEditBody], async (req, res) => {
    const _id = req.params.document_id;
    const document = await Document.findOne({_id: _id}, (err, document) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(req.body.docName){
            document.docName = req.body.docName;
        }
        if(req.body.docType){
            document.docType = req.body.docType;
        }
        if(req.body.title){
            document.title = req.body.title;
        }
        if(req.body.url){
            document.url = req.body.url;
        }
        if(req.body.domain){
            document.domain = req.body.domain;
        }
        if(req.body.locale){
            document.locale = req.body.locale;
        }
        if(req.body.task){
            document.task = req.body.task;
        }
        document.updatedAt = Date.now();
        document.save((err, document) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                document
            });
        })
    })
})

router.delete('/:document_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.document_id;
    Document.deleteOne({_id: _id}, (err, document) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            document
        });
    })
})


module.exports = router;