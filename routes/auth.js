let express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
let bkfd2Password = require("pbkdf2-password");
let hasher = bkfd2Password();
let common = require('../public/commonUtil');

/***************************************************************************
	Auth APIs	:
	prefix 		: /auth/*
****************************************************************************/

/* login */
router.get('/login', function(req, res, next){
  /* 변수 유효성 검증 */
  if(!req.query.id || !req.query.pw){
    res.json({
      result: 'fail',
      error: 'Invalid Parameter'
    })
    return;
  }

	let qry = ` SELECT * ` +
            ` FROM rb_user ` +
            ` WHERE id = '${req.query.id}'`
	common.exeQuery(qry, function(err, rows){
		if(err || rows.length < 1){
      res.json({
        result: 'fail',
        error: 'DB Error'
      })
    }

    hasher({password: req.query.pw, salt: rows[0].salt},(err, pass, salt, hash)=>{
      if(hash == rows[0].pw){
        res.json({
    			result: 'ok',
    		})
      } else {
        res.json({
          result: 'fail',
          error: 'Invalid ID or Password'
    		})
      }
    })

	})
});

/* Update  */
router.post('/update', urlencodedParser, function(req, res, next){
  /* 변수 유효성 검증 */
  if(!req.body.id || !req.body.pw || !req.body.newPw){
    res.json({
      result: 'fail',
      error: 'Invalid Parameter'
    })
    return;
  }

	let qry = ` SELECT * ` +
            ` FROM rb_user ` +
            ` WHERE id = '${req.body.id}'`
	common.exeQuery(qry, function(err, rows){
		if(err || rows.length < 1){
      res.json({
        result: 'fail',
        error: 'DB Error'
      })
    }

    hasher({password: req.body.pw, salt: rows[0].salt}, (err, pass, salt, hash)=>{
      if(hash == rows[0].pw){
        hasher({password: req.body.newPw}, (err, pass, salt, hash)=>{
          if(err) {
            res.json({
              result: 'fail',
              error: 'Password Encryption Error'
            })
          }
          let qry = ` UPDATE 	dbonlyhisson.rb_user ` +
                    ` SET 	pw='${hash}',  ` +
                    ` 		  salt='${salt}' ` +
                    ` WHERE id = '${req.body.id}'`
          common.exeQuery(qry, function(err, rows){
            if(err){
              res.json({
                result: 'fail',
                error: 'DB Error'
              })
            }
            res.json({
        			result: 'ok'
        		})
          })

        })
      } else {
        res.json({
          result: 'fail',
          error: 'Invalid ID or Password'
    		})
      }
    })

	})
});

/* 사용자 등록 */
router.post('/register', urlencodedParser, function(req, res, next){

  if(!req.body.id || !req.body.pw){
    res.json({
      result: 'fail',
      error: 'Invalid Parameter'
    })
    return;
  }

  hasher({password:req.body.pw}, function(err, pass, salt, hash){
    if(err) {
      res.json({
        result: 'fail',
        error: 'Password Encryption Error'
      })
    }
    let qry = ` INSERT INTO dbonlyhisson.rb_user `+
              ` VALUES ('${req.body.id}', '${hash}', '${salt}', NOW()); `

    common.exeQuery(qry, function(err, rows){
      if(err){
        res.json({
          result: 'fail',
          error: 'DB Error'
        })
      }
  		res.json({
  			result: 'ok'
  		})
  	})
  });
})

module.exports = router;
