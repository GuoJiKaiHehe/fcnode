var mongoose = require("mongoose");
var validator      = require('validator');
var eventproxy     = require('eventproxy');
var uuid           = require('node-uuid');
var utility =require("utility");
var moment=require("moment");
var cache= require("../lib/cache");

var myconfig 	   = require("../myconfig");
var tools =require("../tools");

var User = require("../proxy/user");
var Topic = require("../proxy/topic");
var mail =require("../lib/mail");

var authMiddleWare= require("../middlewares/auth");

var renderHelper= require("../lib/render_helper");


exports.index=function(req,res,next){
	// console.log(req.session);
	var page = parseInt(req.query.page, 10) || 1;
	page = page > 0 ? page : 1;
	 var tab = req.query.tab || 'all';

	var proxy = new eventproxy();
		proxy.fail(next);
	// 取主题
	  var query = {
	    create_at: {$gte: moment().subtract(1, 'years').toDate()}
	  };
	if (!tab || tab === 'all') {
	    query.tab = {$nin: ['job', 'dev']}
	  } else {
	    if (tab === 'good') {
	      query.good = true;
	    } else {
	      query.tab = tab;
	    }
	  }	
	var limit = myconfig.list_topic_count;
	var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};
	
	Topic.getTopicsByQuery(query, options, proxy.done('topics', function (topics) {
	    return topics;
	 }));	

var pagesCacheKey = JSON.stringify(query) + 'pages';
	
		cache.get(pagesCacheKey, proxy.done(function (pages) {
			if (pages) {
			  proxy.emit('pages', pages);
			} else {
			  Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
			  	console.log(all_topics_count);
			    var pages = Math.ceil(all_topics_count / limit);
			    cache.set(pagesCacheKey, pages, 60 * 1);
			    proxy.emit('pages', pages);
			  }));
			}
		}));	
	var tabName = renderHelper.tabName(tab);	

	proxy.all("topics",'pages',
			  (topics, pages)=>{
			  	console.log(topics,pages);
			res.render("index",{
				topics:topics,
				current_page:page,
				list_topic_count:limit,
				// tops:topics
				pages: pages,
				tabs: myconfig.tabs,
				tab: tab,
				pageTitle: tabName && (tabName + '版块'),
			});
	})
	

}






