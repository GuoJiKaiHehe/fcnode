var mongoose=require("mongoose");

var Topic= mongoose.model("Topic");
var EventProxy = require("eventproxy");
var User= require("./user");
var _ = require("lodash");
exports.newAndSave = function (title, content, tab, authorId, callback) {
  var topic       = new Topic();
  topic.title     = title;
  topic.content   = content;
  topic.tab       = tab;
  topic.author_id = authorId;

  topic.save(callback);
};


exports.getTopicsByQuery=function(query,opt,cb){
	query.deleted = false;

	Topic.find(query,{},opt,function(err,topics){
		if (err) {
	      return cb(err);
	    }
		if (topics.length === 0) {
	      return cb(null, []);
	    }	
	    var proxy = new EventProxy();
		proxy.after('topic_ready', topics.length, function () {
	      topics = _.compact(topics); // 删除不合规的 topic
	      console.log(topics);
	      return cb(null, topics);
	    });	
	    proxy.fail(cb);	
	    topics.forEach((topic,index)=>{
			var ep=new EventProxy();
			ep.all('author',function(author){
				if(author){
					topic.author=author;	
				}else{
					topics[i]=null;
				}
				proxy.emit('topic_ready');
			})
			User.getUserById(topic.author_id,ep.done("author"));
	    });
	});
}




exports.getCountByQuery=function(query,cb){
	Topic.count(query, cb);
}


