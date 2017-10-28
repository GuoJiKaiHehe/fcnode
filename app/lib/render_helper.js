
var _ = require("lodash");
var myconfig=require("../myconfig");
exports.escapeSignature=function(signature){
	return signature.split('\n').map((p)=>{
		return _.escape(p);
	}).join("<br/>")
}

exports.proxy=function(url){
	return url;
}

exports.tabName=function(tab){
	var pair= _.find(myconfig.tabs,function(pair){
		 return pair[0] === tab;
	});
	if(pair){
		return pair[1];
	}
}