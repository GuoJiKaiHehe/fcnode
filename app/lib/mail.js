var mailer        = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var myconfig =require("../myconfig");
var transporter     = mailer.createTransport(smtpTransport(myconfig.mail_opts));

var SITE_ROOT_URL = 'http://' + myconfig.host;
var async = require('async');
var util =require("util");
var logger= require("./logger");

var sendMail=function(data){
	/*if(myconfig.debug){
		return;
	}*/
	async.retry({times:5},function(done){
		transporter.sendMail(data,function(err){
			if(err){
				logger.error('send mail error', err, data);
				return done(err);
			}
			return done()
		});
	},function(err){
		if(err){
			return logger.error("send mail finally error",err,data);
		}
		logger.info("send mail success",data);
	});
}
exports.sendMail = sendMail;

exports.sendActiveMail=function(who,token,name){
	console.log("sendMail",who,token,name);
	var from    = util.format('%s <%s>', myconfig.name, myconfig.mail_opts.auth.user);
	var to      = who;
	var subject = myconfig.name + '社区帐号激活';
	var html    = '<p>您好：' + name + '</p>' +
    '<p>我们收到您在' + myconfig.name + '社区的注册信息，请点击下面的链接来激活帐户：</p>' +
    '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
    '<p>若您没有在' + myconfig.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + myconfig.name + '社区 谨上。</p>';	
    var options={
	    from: from,
	    to: to,
	    subject: subject,
	    html: html
	  };
	  console.log(options);
	exports.sendMail(options);    
}