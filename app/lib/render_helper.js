
var _ = require("lodash");

exports.escapeSignature=function(signature){
	return signature.split('\n').map((p)=>{
		return _.escape(p);
	}).join("<br/>")
}

exports.proxy=function(url){
	return url;
}