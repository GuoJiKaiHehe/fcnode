var utility = require('utility');
var uuid    = require('node-uuid');
var mongoose= require("mongoose");
var User= mongoose.model("User");
exports.newAndSave=function(name,loginname,pass,email,avatar_url,active,callback){
	var user=new User();
	user.name=loginname;
	user.loginname=loginname;
	user.pass        = pass;
	user.email       = email;
	user.avatar      = avatar_url;
	user.active      = active || false;
	user.accessToken = uuid.v4();	
	
	user.save(callback);
}

exports.makeGravatar = function (email) {
  return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
};

exports.getUserByLoginName=function(name,cb){
	User.findOne({loginname:new RegExp('^'+name+'$',"i")},cb);
}

exports.getUserByMail=function(email,cb){
	User.findOne({email:email},cb);
}

exports.getUserById=function(id,cb){
	if(!id) return cb();
	User.findOne({_id:id},cb);

}