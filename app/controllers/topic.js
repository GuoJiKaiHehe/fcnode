var mongoose = require("mongoose");
var validator      = require('validator');
var eventproxy     = require('eventproxy');
var uuid           = require('node-uuid');
var utility =require("utility");
var EventProxy = require("eventproxy");
var myconfig 	   = require("../myconfig");
var tools =require("../tools");

var Topic = require("../proxy/topic");
var User = require("../proxy/user");

var mail =require("../lib/mail");
var at= require("../lib/at");
var authMiddleWare= require("../middlewares/auth");


//显示某一个话题；
exports.index=function(req,res,next){
	res.send("aaa");

}
//显示文章界面；
exports.create=function(req,res){
	res.render('topic/edit', {
	    tabs: myconfig.tabs
	  });	
}


exports.put=function(req,res,next){
 var title   = validator.trim(req.body.title);
  var tab     = validator.trim(req.body.tab);
  var content = validator.trim(req.body.t_content);	

	// res.send("topic success");

	var allTabs=myconfig.tabs.map(function(tPair){
		return tPair[0];
	})
	var editError;
	  if (title === '') {
	    editError = '标题不能是空的。';
	  } else if (title.length < 5 || title.length > 100) {
	    editError = '标题字数太多或太少。';
	  } else if (!tab || allTabs.indexOf(tab) === -1) {
	    editError = '必须选择一个版块。';
	  } else if (content === '') {
	    editError = '内容不可为空';
	  }	
	if (editError) {
	    res.status(422);
	    return res.render('topic/edit', {
	      edit_error: editError,
	      title: title,
	      content: content,
	      tabs: myconfig.tabs
	    });
	  }	
	  
	  Topic.newAndSave(title,content,tab,req.session.user._id,function(err,topic){
			if (err) {
			      return next(err);
			}
			var proxy = new EventProxy();
			proxy.all('score_saved', function () {
				// res.redirect('/topic/' + topic._id);
				console.log('put success');
			});	
			proxy.fail(next);
			User.getUserById(req.session.user._id, proxy.done(function (user) {
			      user.score += 5;
			      user.topic_count += 1;
			      user.save();
			      req.session.user = user;
			      proxy.emit('score_saved');
			}));	

			
			//发送at消息
			// at.sendMessageToMentionUsers(content, topic._id, req.session.user._id);					

	  })

}
//
//
//
//
//
//
//
//
//
//
//