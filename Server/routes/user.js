const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Challenge = require('../models/challenge');
const Role = require("../models/role");
const Study = require("../models/study");
const UserChallenge = require("../models/userChallenge");
const UserStudy = require("../models/userStudy");
const Token = require("../models/token");
const verifyToken = require("../middlewares/verifyToken");
const bcrypt = require("bcryptjs");

const authMiddleware = require("../middlewares/authMiddleware");
const { generateProgress, sendResetPasswordEmail } = require("../utils/routeUtils");

router.get("", [verifyToken, authMiddleware.isAdmin], async (req, res) => {
  User.find({}, { password: 0 }, (err, users) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    res.status(200).json({ users });
  }).populate({ path: 'role', model: Role} );
});

router.get(
  "/:user_id",
  [verifyToken, authMiddleware.isAdmin],
  async (req, res) => {
    const _id = req.params.user_id;
    User.findOne({ _id: _id }, { password: 0 }, (err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({ user });
    }).populate({ path: 'role', model: Role} );
  }
);

router.delete(
  "/:user_id",
  [verifyToken, authMiddleware.isAdmin],
  async (req, res) => {
    const _id = req.params.user_id;
    User.deleteOne({ _id: _id }, (err, user) => {
      if (err) {
        return res.status(404).json({
          err,
        });
      }
      res.status(200).json({
        user,
      });
    });
  }
);

router.post("/changePassword", [verifyToken], async (req, res) => {
  const user = User.findOne({ _id: req.user }, (err) => {
    if (err) {
      return res.status(404).json({
        err,
      });
    }
  });
  //checking password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    res.status(400).send("Invalid password!");
  } else {
    //hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ message: "Password was updated successfully!" });
    });
  }
});

router.post("/sendEmailResetPassword/:email", async (req, res) => {
  const email = req.params.email
  const user = await User.findOne({email: email}, err => {
    if (err) {
      return res.status(404).json({
        err,
      });
    }
  })
  if(!user){
    return res.status(404).json({
      err: "Email not found"
    });
  }
  // Send confirmation email
  sendResetPasswordEmail(user, res, req);

  res.status(200).json({
    ok: true
  });
})

router.post("/resetPassword/:token", async (req, res) => {
  const token = req.params.token;
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  // Find a matching token
  Token.findOne({ token: token }, function (err, token) {
    if (!token) return res.status(400).send({ type: 'not-token', msg: 'We were unable to find a valid token. Your token my have expired.' });

    // If found, find matching user
    User.findOne({ _id: token._userId }, function (err, user) {
        if (!user) return res.status(400).send({ type: 'USER_NOT_FOUND', msg: 'We were unable to find a user for this token.' });
        user.password = password;
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Password was updated successfully!" });
        });
    });
  });
});

router.put("/:user_id", async (req, res) => {
  const _id = req.params.user_id;
  const user = await User.findOne({ _id: _id }, (err) => {
    if (err) {
      return res.status(404).json({
        err,
      });
    }
  }).populate({ path: 'role', model: Role} );
  user.updatedAt = Date.now();
  user.save((err, user) => {
    if (err) {
      return res.status(404).json({
        err,
      });
    }
    res.status(200).json({
      user,
    });
  })
});

router.put("/:user_id/profileImage", [verifyToken], async (req, res) => {
  const _id = req.params.user_id;
  const image_url = req.body.image_url;
  await User.findOne({ _id: _id }, (err, user) => {
    if (err) {
      return res.status(404).json({
        err,
      });
    }
    user.image_url = image_url;
    user.updatedAt = Date.now();
    user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          err,
        });
      }
      res.status(200).json({
        user,
      });
    });
  });
})

router.get("/:user_id/progress", [verifyToken], async (req, res) => {
  const userId = req.params.user_id;
  const user = await User.findOne({ _id: userId }, err => {
    if (err) {
      return res.status(404).json({
        err,
      });
    }
  });
  UserStudy.findOne({ user: user._id, study: user.study }, async (err, userStudy) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }

    // If progress not found we generate it now
    if (!userStudy) {
      // Find user
      const user = await User.findOne({ _id: userId }, err => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err
          });
        }
      });

      // Find study
      const study = await Study.findOne({ _id: user.study }, err => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err
          });
        }
      });

      // Find study challenges
      const challenges = await Challenge.find({ study: study }, err => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err
          });
        }
      });

      await generateProgress(challenges, user, study).then(async (progress) => {
        await UserStudy.findOne({_id: progress._id}, (err, createdUserStudy) => {
          if (err) {
            return res.status(404).json({
              ok: false,
              err
            });
          }
          res.status(200).json(createdUserStudy);
        });
      });
    }
    else {
      console.log('returning response');
      res.status(200).json(userStudy);
    }
  });
});

router.put("/:user_id/progress", [verifyToken], async (req, res) => {
  const userId = req.params.user_id;
  const user = await User.findOne({_id: userId}, err => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
  })
  UserStudy.findOne({ user: user._id, study: user.study }, (err, userStudy) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }

    if ("assent" in req.body) {
      userStudy.assent = req.body.assent;
    }

    if ("challenges" in req.body) {
      userStudy.challenges = req.body.challenges;
    }

    userStudy.save((err, userStudy) => {
      if (err) {
        return res.status(500).json({
          err,
        });
      }
      res.status(200).json(userStudy);
    });
  });
});

/*
router.get("/:user_id/can_play", [verifyToken], async (req, res) => {
  const userId = req.params.user_id;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).json(err);
    }
    Study.findById(user.study, (err, study) => {
      if (err) {
        res.status(500).json(err);
      }
      UserChallenge.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .exec((err, latestAnswer) => {
          if (err) {
            res.status(500).json(err);
          } else if (!latestAnswer) {
            res.status(200).json({
              canPlay: true,
            });
          } else {
            const cooldown = study.cooldown;
            const timeNow = new Date(Date.now());
            const latestAnswerDate = new Date(latestAnswer.createdAt);
            const canPlayAtTime = new Date(
              latestAnswerDate.getTime() + cooldown * 1000
            );
            const canPlay = timeNow > canPlayAtTime ? true : false;
            res.status(200).json({
              latestAnswerDate: latestAnswerDate,
              cooldown: cooldown,
              timeNow: timeNow,
              canPlayAtTime: canPlayAtTime,
              canPlay: canPlay,
            });
          }
        });
    });
  });
});
*/

router.get("/:user_id/can_play", [verifyToken], async (req, res) => {
  const userId = req.params.user_id;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).json(err);
    }
    Study.findById(user.study, (err, study) => {
      if (err) {
        res.status(500).json(err);
      }
      const timeNow = new Date(Date.now());
      const cooldown = study.cooldown;
      const max_per_interval = study.max_per_interval;
      if(!user.cooldown_start){
        user.cooldown_start = timeNow;
        user.interval_answers = 0;
        user.save( err => {
          if (err) {
            res.status(500).json(err);
          }
          res.status(200).json({
            latestAnswerDate: timeNow,
            cooldown: cooldown,
            timeNow: timeNow,
            canPlayAtTime: timeNow,
            canPlay: true,
          });
        })
      }
      else{
        const cooldown_start = user.cooldown_start;
        const interval_answers = user.interval_answers;
        const canPlayAtTime = new Date(
          cooldown_start.getTime() + cooldown * 1000
        );
        const canPlay = timeNow > canPlayAtTime ? true : false;
        if(canPlay){
          user.cooldown_start = timeNow;
          user.interval_answers = 0;
          user.save( err => {
            if (err) {
              res.status(500).json(err);
            }
            res.status(200).json({
              latestAnswerDate: timeNow,
              cooldown: cooldown,
              timeNow: timeNow,
              canPlayAtTime: canPlayAtTime,
              canPlay: canPlay,
            });
          })
        }
        else{
          const max_attempts_made = interval_answers < max_per_interval ? true : false;
          res.status(200).json({
            latestAnswerDate: timeNow,
            cooldown: cooldown,
            timeNow: timeNow,
            canPlayAtTime: canPlayAtTime,
            canPlay: max_attempts_made,
          });
        }
      }
    });
  });
});

router.get("/:study_id/findDummy", async (req, res) => {
  const study_id = req.params.study_id;
  // Find study
  const study = await Study.findOne({ _id: study_id }, (err) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
  });
  // Find User
  const user = await User.findOne({email: study_id+"@dummy.cl"});
  res.status(200).json({
    ok: true,
    user
  });
});

router.get("/:study_id/resetDummy", async (req, res) => {
  const study_id = req.params.study_id;
  // Find study
  const study = await Study.findOne({ _id: study_id }, (err) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
  });
  // Find User
  const user = await User.findOne({email: study_id+"@dummy.cl"});
  // Delete dummy last answers records
  user.cooldown_start = null;
  user.interval_answers = 0;
  user.has_played = false;
  await user.save(ersr => {
    if(err){
      res.status(500).json(err);
    }
  });
  // Delete dummy progress
  await UserStudy.deleteOne({user: user._id},  err => {
    if(err){
      res.status(500).json(err);
    }
  })
  // Find study challenges
  const challenges = await Challenge.find({ study: study }, (err) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
  });
  // Generate user study progress entry
  generateProgress(challenges, user, study)
  .catch((err) => {
    return res.status(404).json({
      ok: false,
      err,
    });
  })
  .then((progress) => {
    res.status(200).json({
      user,
    });
  });
});

router.get("/:user_id/has_played", [verifyToken], async (req, res) => {
  const userId = req.params.user_id;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).json(err);
    }
    user.has_played = true;
    user.save( err => {
      if (err) {
        res.status(500).json(err);
      }
      res.status(200).json({
        user
      });
    })
  });
});


module.exports = router;
