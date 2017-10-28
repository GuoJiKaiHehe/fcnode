// Example model

var mongoose = require('mongoose');
var  Schema = mongoose.Schema;
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;
var myconfig    = require('../myconfig');
var _         = require('lodash');
var BaseModel = require("./base_model");

var TopicSchema = new Schema({
  title: String,
  content:{type:String},
  author_id:{type:ObjectId},//作者id
  top:{type:Boolean,default:false}, //定制贴
  good:{type:Boolean,default:false}, //精华帖
  lock:{type:Boolean,default:false},//被锁定的主题；
  reply_count:{type:Number,default:0},//回复的数量；
  visit_count:{type:Number,default:0},
  collect_count: { type: Number, default: 0 },//收藏
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },  
  last_reply: { type: ObjectId }, //最后回复的用户id
  last_reply_at: { type: Date, default: Date.now },//回复的时间；
  content_is_html: { type: Boolean },
  tab: {type: String},
  deleted: {type: Boolean, default: false},
});

TopicSchema.plugin(BaseModel);
TopicSchema.index({create_at: -1});
TopicSchema.index({top: -1, last_reply_at: -1});
TopicSchema.index({author_id: 1, create_at: -1});
TopicSchema.virtual('tabName').get(function () {
  var tab  = this.tab;
  var pair = _.find(config.tabs, function (_pair) {
    return _pair[0] === tab;
  });

  if (pair) {
    return pair[1];
  } else {
    return '';
  }
});

mongoose.model('Topic', TopicSchema);







