var mongoose = require("mongoose");
var validator      = require('validator');
var eventproxy     = require('eventproxy');
var uuid           = require('node-uuid');
var utility =require("utility");
var myconfig 	   = require("../myconfig");
var tools =require("../tools");

var User = require("../proxy/user");

var mail =require("../lib/mail");

var authMiddleWare= require("../middlewares/auth");

exports.showSignup=function(req,res){
	res.locals.title="注册";
	res.render("sign/signup")
}

exports.signup=function(req,res,next){
	console.log(req.body);
	var loginname = validator.trim(req.body.loginname).toLowerCase();
	var email     = validator.trim(req.body.email).toLowerCase();
	var pass      = validator.trim(req.body.pass);
	var rePass    = validator.trim(req.body.re_pass);
	var ep = new eventproxy();

	ep.fail(next);
	ep.on("prop_err",function(msg){
		res.locals.title="注册";
		res.render("sign/signup",{
			error:msg,
			loginname:loginname,
			email:email
		})
	});
	if ([loginname, pass, rePass, email].some(function (item) { return item === ''; })) {
	    ep.emit('prop_err', '信息不完整。');
	    return;
	}
	if (loginname.length < 5) {
	    ep.emit('prop_err', '用户名至少需要5个字符。');
	    return;
	 }
	if (!tools.validateId(loginname)) {
	    return ep.emit('prop_err', '用户名不合法。');
	}
	if (!validator.isEmail(email)) {
		return ep.emit('prop_err', '邮箱不合法。');
	}	
	if (pass !== rePass) {
		return ep.emit('prop_err', '两次密码输入不一致。');
	}  	 
	 // END 验证信息的正确性
	 
	tools.bhash(pass,ep.done((passhash)=>{
			 var avatarUrl = User.makeGravatar(email);
			 User.newAndSave(loginname,loginname,passhash, email, avatarUrl,false,function(err){
				if(err) return next(err);
				console.log("sendActiveMail");
				mail.sendActiveMail(email, utility.md5(email + passhash + myconfig.session_secret), loginname);
				res.locals.title="注册";
				res.render('sign/signup', {
				          success: '欢迎加入 ' + myconfig.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
				});				
			 });
	}));
	// res.send("sinup");
}


exports.activeAccount=function(req,res,next){
	var key  = validator.trim(req.query.key);
  	var name = validator.trim(req.query.name);
  	User.getUserByLoginName(name,function(err,user){
  		if(err){
  			return next(err);
  		}
  		if(!user){
  			return next(new Error('[ACTIVE_ACCOUNT] no such user: ' + name))
  		}
  		 var passhash = user.pass;
  		 if (!user || utility.md5(user.email + passhash + myconfig.session_secret) !== key) {
  		 	return res.render('notify/notify', {error: '信息有误，帐号无法被激活。'});
  		}
		if (user.active) {
	      return res.render('notify/notify', {error: '帐号已经是激活状态。'});
	    }  	
	    user.active = true;
	    user.save(function(err){
	    	if(err) return next(err);
	    	res.render("notify/notify",{success: '帐号已被激活，请登录'});
	    })	 
  	})
}

var notJump = [
  '/active_account', //active page
  '/reset_pass',     //reset password page, avoid to reset twice
  '/signup',         //regist page
  '/search_pass'    //serch pass page
];


exports.showLogin=function(req,res){
	req.session._loginReferer = req.headers.referer;
	console.log("referencer",req.session._loginReferer)
	res.render('sign/signin');
}
exports.login = function (req, res, next) {
	var loginname=validator.trim(req.body.name).toLowerCase();
	var pass= validator.trim(req.body.pass);
	var ep= new eventproxy();
	ep.fail(next);

	if (!loginname || !pass) {
	    res.status(422);
	    return res.render('sign/signin', { error: '信息不完整。' });
	}
	if (loginname.indexOf('@') !== -1) {
	    getUser = User.getUserByMail;
	  } else {
	    getUser = User.getUserByLoginName;
	  }	
	ep.on('login_error', function (login_error) {
	    res.status(403);
	    res.render('sign/signin', { error: '用户名或密码错误' });
	});
	getUser(loginname,function(err,user){
		if (err) {
		      return next(err);
    	}	
    	console.log(user);
		if (!user) {
     		 return ep.emit('login_error');
    	}    
    	var passhash = user.pass;
		
		tools.bcompare(pass,passhash,ep.done(function(bool){
				if (!bool) {
			        return ep.emit('login_error');
			      }	
			    if(!user.active){
					mail.sendActiveMail(user.email, utility.md5(user.email + passhash + config.session_secret), user.loginname);
			        res.status(403);
			        return res.render('sign/signin', { error: '此帐号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。' });
			    }	

			    authMiddleWare.gen_session(user, res);
				var refer = req.session._loginReferer|| "/";
				for (var i = 0, len = notJump.length; i !== len; ++i) {
			        if (refer.indexOf(notJump[i]) >= 0) {
			          refer = '/';
			          break;
			        }
			      }
			      res.redirect(refer);				


		}));



	})		
}


//退出
//
exports.signout=function(req,res,next){
	req.session.destroy();//清楚session;
	res.clearCookie(myconfig.auth_cookie_name,{path:"/"});
	res.redirect("/");
}




