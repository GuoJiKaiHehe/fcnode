var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
// var renderHelper = require('../common/render_helper');

var Schema    = mongoose.Schema;
var utility   = require('utility');
var _ = require('lodash');

var UserSchema = new Schema({
  name: { type: String},
  loginname: { type: String},
  pass:{type:String},
  email: { type: String},
  url:{type:String}, //个人网站网址；
  profile_image_url:{type:String},
  location: { type: String },//地理位置
  avatar: { type: String },
  weibo: { type: String },
  signature: { type: String },//签名
  githubId: { type: String},
  githubUsername: {type: String},
  githubAccessToken: {type: String},
  is_block: {type: Boolean, default: false},

  score: { type: Number, default: 0 },//积分
  topic_count: { type: Number, default: 0 },//发布topic的数量；
  reply_count: { type: Number, default: 0 }, //回复的数量；
  follower_count: { type: Number, default: 0 },//跟随的数量；
  following_count: { type: Number, default: 0 },//收藏的数量；
  collect_tag_count: { type: Number, default: 0 },//收藏标签的数量；
  collect_topic_count: { type: Number, default: 0 },//收藏topic的数量；
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  is_star: { type: Boolean },
  level: { type: String }, //等级
  active: { type: Boolean, default: false },

  receive_reply_mail: {type: Boolean, default: false },
  receive_at_mail: { type: Boolean, default: false },
  from_wp: { type: Boolean },
  retrieve_time: {type: Number},
  retrieve_key: {type: String},
  accessToken: {type: String}, 
 })


UserSchema.plugin(BaseModel);

UserSchema.virtual('avatar_url').get(function () {
  var url = this.avatar || ('https://gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48');

  // www.gravatar.com 被墙
  url = url.replace('www.gravatar.com', 'gravatar.com');

  // 让协议自适应 protocol，使用 `//` 开头
  if (url.indexOf('http:') === 0) {
    url = url.slice(5);
  }

  // 如果是 github 的头像，则限制大小
  if (url.indexOf('githubusercontent') !== -1) {
    url += '&s=120';
  }

  return url;
});

UserSchema.virtual('isAdvanced').get(function () {
  // 积分高于 700 则认为是高级用户
  return this.score > 700 || this.is_star;
});


UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({score: -1});
UserSchema.index({githubId: 1});
UserSchema.index({accessToken: 1});

UserSchema.pre('save', function(next){
  var now = new Date();
  this.update_at = now;
  next();
});

mongoose.model('User', UserSchema);


