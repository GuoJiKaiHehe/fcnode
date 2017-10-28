var mongoose= require("mongoose");

var myconfig= require("../myconfig");

var eventproxy= require("eventproxy");
var UserModel=mongoose.model("User");

var UserProxy = require("../proxy/user");
exports.gen_session=function(user,res){
	var auth_token=user._id +"$$$$";

	var opts={
		path:"/",
		maxAge:1000 * 60 * 60 *24 *30, //1个月
		signed:true, //签名；
		httpOnly:true // 只有服务器端才能修改;
	}
	res.cookie(myconfig.auth_cookie_name,auth_token,opts);
}

exports.authUser=function(req,res,next){
	
	var ep = new eventproxy();
	ep.fail(next);
	
	res.locals.current_user = null;

	ep.all('get_user',function(user){
		// console.log("getuser",user);
		if(!user){
			return next();
		}
		user = res.locals.current_user = req.session.user = new UserModel(user);
		user.messages_count=0;
		next();
	});
	// console.log(req.session)
	if (req.session.user) {
		ep.emit('get_user', req.session.user);
	}else{
		var auth_token = req.signedCookies[myconfig.auth_cookie_name];
		if(!auth_token) return next();

		var auth = auth_token.split('$$$$');
		var user_id = auth[0];
		UserProxy.getUserById(user_id,ep.done("get_user"));
	}


}



exports.userRequired=function(req,res,next){
	if (!req.session || !req.session.user || !req.session.user._id) {
	    return res.status(403).send('forbidden!');
	  }

	  next();	
}



