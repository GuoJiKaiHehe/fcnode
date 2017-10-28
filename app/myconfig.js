var rootdir = __dirname+"/../";

var config={
	name:"guokai",
	auth_cookie_name:"myclub",
	rootdir:rootdir,
	list_topic_count:20,
	host:"localhost:3000",
	tabs: [
	    ['share', '分享'],
	    ['ask', '问答'],
	    ['job', '招聘'],
	  ],
	debug:true,
	log_dir:rootdir+"/logs",
	session_secret:"guojikai",
	db:{
		redis:{
		    port: 6379,
		    host: '127.0.0.1',
		    db: 0,
		    pass: '',
		  }
	},
	description:"miaoshu",
	keywords:"kkkkk",
	mail_opts:{
		service:"qq",
		// host: 'smtp.126.com', 
	    // port: 25,		
		auth:{
			user:"970228812@qq.com",
			pass:"qrucjepguxegbfcb"
		}
	},
	// 版块
	  tabs: [
	    ['share', '分享'],
	    ['ask', '问答'],
	    ['job', '招聘'],
	  ],
	  create_post_per_day:100,	
}

module.exports=config;