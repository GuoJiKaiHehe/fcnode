var redis  = require('./redis');
var _      = require('lodash');
var logger = require('./logger');


var get=function(key,cb){
	var t = new Date();
	redis.get(key,function(err,data){
		if(err){
			return cb(err);
		}
		if(!data){
			return cb();
		}
		console.log(data,"count");
		data = JSON.parse(data);
		var duration = (new Date() - t);
		logger.debug('Cache', 'get', key, (duration + 'ms').green);
		cb(null, data);
	})
}






var set = function (key, value, time, callback) {
	 var t = new Date();
	if (typeof time === 'function') {
	    callback = time;
	    time = null;
	  }	 
	 callback = callback || _.noop;
	 value = JSON.stringify(value);
	 console.log("is puted "+value+"times");
	 if (!time) {
	 	redis.set(key, value, callback);
	 }else{
	 	redis.setex(key, time, value, callback); //如果不存在就设置
	 }
	 var duration = (new Date() - t);
	 logger.debug("Cache", "set", key, (duration + 'ms').green);
}

exports.get=get;
exports.set=set;



