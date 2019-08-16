let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let common = require('../public/commonUtil');

// json 으로 요청시 받을 수 있게 한다.
router.use(bodyParser.json());

/***************************************************************************
	Board APIs	:
	prefix 		: /board/*
****************************************************************************/

/* 게시판 리스트 조회 */
router.get('/boardList',function(req, res, next){
	let qry = "SELECT * FROM rb_board"
	common.exeQuery(qry, function(err, rows){
		if(err) {
			res.json({
				result: 'fail',
				error: 'DB Error'})
		}
			/*
		if(rows.length < 1)
			res.json({result:'_no_data_'})
			*/
		res.json({
			result:'ok',
			boardList:rows
		})
	})
});

/* 해당 게시판의 게시글 리스트 조회 */
router.get('/postList/:boardId',function(req, res, next){
	let boardId = req.params.boardId;
	let qry =	" SELECT	id, " +
						//"					board_id, " +
						"					post_title, " +
						//"					post_content, " +
						"					DATE_FORMAT(post_reg_date, '%Y-%m-%d %r') AS 'post_reg_date', " +
						//"					post_user_name, " +
						"					post_reg_ip " +
						" FROM	rb_post "
	if(boardId)
		qry += `WHERE board_id =${boardId}`

	common.exeQuery(qry, function(err, rows){
		if(err) {
			res.json({
				result: 'fail',
				error: 'DB Error'})
		}
			/*
		if(rows.length < 1)
			res.json({result:'_no_data_'})
			*/
		res.json({
			result:'ok',
			postList:rows
		})
	})
});

/* 게시물의 상세 데이터 */
router.get('/post/:id',function(req, res, next){
	let id = req.params.id;
	let qry =	"SELECT	id, " +
				"						board_id, " +
				"						post_title, " +
				"						post_content, " +
				"						DATE_FORMAT(post_reg_date, '%Y-%m-%d %r') AS 'post_reg_date', " +
				"						post_user_name, " +
				"						post_reg_ip " +
				" FROM	rb_post "
	if(id)
		qry += `WHERE id =${id}`

	common.exeQuery(qry, function(err, rows){
		if(err) {
			res.json({
				result: 'fail',
				error: 'DB Error'})
		}
			/*
		if(rows.length < 1)
			res.json({result:'_no_data_'})
			*/
		res.json({
			result:'ok',
			postDetail:rows[0]
		})
	})
});

/* 게시물 작성 */
router.post('/writePost/:boardId', urlencodedParser, function(req, res, next){
	let boardId = req.params.boardId;
	let userName = req.body.userName;
	let ip = req.body.ip;
	let title = req.body.title;
	let content = req.body.content;

	console.log('++++++++++++++++++++++++++++++++++')
	console.log(boardId);
	console.log(userName);
	console.log(ip);
	console.log(title);
	console.log(content);
	console.log('++++++++++++++++++++++++++++++++++')

	let qry = ` INSERT INTO rb_post (	 ` +
						` 	board_id,  ` +
						` 	post_title,  ` +
					  `   post_content,  ` +
					  `   post_reg_date,  ` +
					  `   post_user_name, ` +
					  `   post_reg_ip ` +
						` )VALUES ( ` +
						` 	'${boardId}', ` +
						` 	'${title}',  ` +
						` 	'${content}',  ` +
						` 	NOW(),  ` +
					  `   '${userName}', ` +
						` 	'${ip}' ` +
						` ); `

	common.exeQuery(qry, function(err, rows){
		if(err) {
			res.json({
				result: 'fail',
				error: 'DB Error'})
		}

		res.json({
			result:'ok'
		})
	})
})

/* 게시글 삭제 */
router.post('/deletePost', urlencodedParser, function(req, res, next){
	let postId = req.body.postId;

	let qry = ` DELETE FROM dbonlyhisson.rb_post` +
						` WHERE id=${postId}`

	common.exeQuery(qry, function(err, rows){
		if(err) {
			res.json({
				result: 'fail',
				error: 'DB Error'})
		}

		res.json({
			result:'ok'
		})
	})
})


module.exports = router;
