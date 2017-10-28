var logger = require('../lib/logger');

var ignore = /^\/(public|agent)/;


exports=module.exports=function(req,res,next){
	if(ignore.test(req.url)){
		next();
		return;
	}
	var t = new Date();
	// console.log(logger,"logger");
	logger.info('\n\nStarted', t.toISOString(), req.method, req.url, req.ip);

	res.on("finish",function(){
		var duration=(new Date()) - t;
		logger.info("completed",res.statusCode,('('+duration+"ms)").green );
	});
	next();
}