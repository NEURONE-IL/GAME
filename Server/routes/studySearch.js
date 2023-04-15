const express = require("express");
const router = express.Router();
const StudySearch = require('../models/studySearch');
const Study = require('../models/study');
const User = require('../models/user');
const Challenge = require('../models/challenge');
const Competence = require('../models/competence');
const Language = require('../models/language');
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/search/:user_id/:query/:page', [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  const query = req.params.query;
  const _id = req.params.user_id;
  const page = req.params.page;

  const totalPerPage = 8;
  const skip = page > 0 ? ( ( page - 1 ) * totalPerPage ) : 0 ;
  const notFilter = true;
  /*const filters = req.body.filters;
  const allFilters = req.body.allFilters;
  const notFilter = filters.competences.length == 0 && filters.languages.length == 0 && filters.levels.length == 0;
  
  if(filters.competences.length == 0)
    filters.competences = allFilters.competences;

  if(filters.languages.length == 0)
    filters.languages = allFilters.languages;

  if(filters.levels.length == 0)
    filters.levels = allFilters.levels;*/
  
  //console.log(filters)
  
  if(query != 'all' && notFilter){
    const totalDocs = await StudySearch.countDocuments({userID: { $ne:_id }, $text: {$search: query}});
    StudySearch.find({userID: { $ne:_id }, $text: {$search: query}},{ score: { $meta: "textScore" } }, (err, docs) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});

    }).sort( { score: { $meta: "textScore" } } )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'study', model: Study, populate: {path:'user', model: User, select:'-password'}});
  }
  else if(query != 'all' && !notFilter){
    console.log('Filter')
    const totalDocs = await StudySearch.countDocuments({userID: { $ne:_id },competences:{$in:filters.competences},levels:{$in:filters.levels},lang:{$in:filters.languages}, $text: {$search: query}});
    StudySearch.find({userID: { $ne:_id },
                     competences:{$in:filters.competences},
                     levels:{$in:filters.levels},
                     lang:{$in:filters.languages},
                     $text: {$search: query}},
                    {score: { $meta: "textScore" } }, (err, docs) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});

    }).sort( { score: { $meta: "textScore" } } )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'study', model: Study, populate: {path:'user', model: User, select:'-password'}});
  }
  else if(query === 'all' && !notFilter){
    const totalDocs = await StudySearch.countDocuments({userID: { $ne:_id }});
    StudySearch.find({ userID: { $ne:_id },
                      competences:{$in:filters.competences},
                      levels:{$in:filters.levels},
                      lang:{$in:filters.languages}}, (err, docs) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});
    }).sort( {name:1} )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'study', model: Study, populate: {path:'user', model: User, select:'-password'}});
  }
  else{
    //console.log('All Not Filter')
    const totalDocs = await StudySearch.countDocuments({userID: { $ne:_id }});
    StudySearch.find({userID: { $ne:_id }}, (err, docs) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});
    }).sort( {name:1} )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'study', model: Study, populate: {path:'user', model: User, select:'-password'}});
  }
})

router.post('/loadStudies', /*[verifyToken, authMiddleware.isAdmin],*/ async (req, res) => {
  let studiesIndexes = []
  const studies = await Study.find({privacy:false}, err =>{
    if(err){
        return res.status(404).json({
            ok: false,
            err
        });
    }
  }).populate({path:'user', model: User}).populate({path:'language', model:Language});

  await studies.forEach(async study => {
    
    let competences = [];
    await study.competences.forEach( comp => {
      competences.push(comp.name)
    })
    const _study_id = study._id;
    const challenges = await Challenge.find({study:_study_id}, err => {
      if(err){
        return res.status(404).json({
            ok: false,
            err
        });
      }
    })

    let challengeArr = [];

    await challenges.forEach( challenge => {
      challengeArr.push(challenge.question)
    })
    const studySearch = new StudySearch({
      name: study.name,
      author: study.user.names + ' '+ study.user.last_names,
      description: study.description,
      tags: study.tags,
      userID: study.user._id,
      challenges: challengeArr,
      study: study,
      levels: study.levels,
      lang: study.language.name,
      competences: competences,
    })
    studiesIndexes.push(studySearch);
    studySearch.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    if(studiesIndexes.length === studies.length) {
      res.status(200).json({studiesIndexes});

    }
  });
  
});


module.exports = router;