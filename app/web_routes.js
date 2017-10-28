var express=require("express");
var app;
var config;
var router=express.Router();
var site=require("./controllers/site");
var sign=require("./controllers/sign");
var topic=require("./controllers/topic");
var myconfig= require('./myconfig');

var limit = require('./middlewares/limit');
var auth=require("./middlewares/auth");



module.exports=function(app,config){
	app=app;
	config=config;

	return router;
}


router.get("/",site.index);//首页

router.get("/signup",sign.showSignup);//注册；
router.post("/signup",sign.signup);
router.get("/active_account",sign.activeAccount);

router.get("/signin",sign.showLogin);
router.post("/signin",sign.login);

//退出；
router.get("/signout",sign.signout);


// 新建文章界面
router.get('/topic/create', auth.userRequired, topic.create);

router.post('/topic/create', auth.userRequired, limit.peruserperday('create_topic', myconfig.create_post_per_day, {showJson: false}), topic.put);

router.get('/topic/:tid', topic.index);  // 显示某个话题


