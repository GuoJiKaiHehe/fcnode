var mongoose = require("mongoose");
var validator      = require('validator');
var eventproxy     = require('eventproxy');
var uuid           = require('node-uuid');
var utility =require("utility");
var myconfig 	   = require("../myconfig");
var tools =require("../tools");

var Topic = require("../proxy/topic");

var mail =require("../lib/mail");

var authMiddleWare= require("../middlewares/auth");

//显示文章界面；
exports.create=function(req,res){
	res.render('topic/edit', {
	    tabs: myconfig.tabs
	  });	
}


exports.put=function(req,res,next){
	console.log(req.body);
	res.send("topic success");
}
//