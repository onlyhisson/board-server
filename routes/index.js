var express = require('express');
var router = express.Router();
let common = require('../public/commonUtil');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/test',function(req, res, next){
  let qry = " SELECT * " +
            " FROM	`dbonlyhisson`.`rb_version`" +
            " ORDER BY `reg_date` DESC " +
            " LIMIT 1"
	common.exeQuery(qry, function(err, rows){
    if(err)
      res.json({status:'_db_error_'})
		res.json({
			version: rows[0].version
		})
	})
});

module.exports = router;
