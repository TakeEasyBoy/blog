var express = require('express');
var router = express.Router();
var mongoose = require('./common.js');

var PAGE_SIZE = 8;

//请求文章列表信息的路由
/*
* * 扩展:db.collection.find({ $or : [{a : 1}, {b : 2} ]})
 符合两个条件中任意一个的数据。$or语法表示或的意思。
 */

/*
* 数据库结构:
*     1.主分类有三类:技术,摄影,随笔
*     2.每个主分类对应一个html页面,里面包含所有该分类信息的数据
*
* */

router.get('/requestlists.html', function(req, res, next) {
    //console.log(req.query.page);
    //当前页需要跳过的条数
	//找寻当前主分页信息
	var maincategory = req.query.cate;
	console.log(maincategory);
    var page = req.query.page;
    var skipsize = (page-1)*PAGE_SIZE;
    //console.log(req.query.keywords);
    var keywords = new RegExp(req.query.keywords);
	var maincategory = new RegExp(req.query.cate);
    var queryArr = [
        { "title"	:keywords},
        { "content"	:keywords},
        { "abstract":keywords},
        { "author"	:keywords},
        { "source"	:keywords},
        { "subcategory":keywords}
    ];
	var queryCates = {"maincategory":maincategory};
	blogArticleQueryModel.find({$or:queryArr,"maincategory":maincategory}).sort({"ctime":-1}).exec(function(err,data){
		//第一次查询主分类,需要知道总的条数,
		//console.log(data);
		var pagecounts = Math.ceil(data.length/PAGE_SIZE);
		//分页条件
		blogArticleQueryModel.find({$or:queryArr,"maincategory":maincategory}).skip(skipsize).limit(PAGE_SIZE).sort({"ctime":-1}).exec(function(err,data){
			data.push({"pagecounts":pagecounts});
			res.send(data);
		});

	})

});


//请求文章详情的信息的路由
router.post('/requestDetaile.html',function(req,res){
    //console.log("requestDetaile test passed!",req.body.id);
    var id = req.body.id;
    blogArticleQueryModel.findById({"_id":id}).exec(function(err,data){
        if(err){
            throw err;
        }else{
            //console.log(data);
            res.send(data);
        }
    });
})
//用于请求分类信息的路由,规定后台传给前端的数据是个存好每个条目已经分好类别的数组,减少服务器负载
router.get('/requestcategoryLists.html',function(req,res){
    //console.log("requestcategoryLists test passed!");
    //根据分类信息查找所有的条目
	var maincategory = new RegExp(req.query.cate);
    blogArticleQueryModel.find({"maincategory":maincategory}).exec(function(err,data){
        if(err){
            throw err;
        }else{
            var categories = [];//用于存放所有分类信息
            if(data){
                //循环遍历所有的分类信息
                for(var i in data){
                    categories.push(data[i].subcategory);//将信息push进入category
                }
                //console.log(categories);
                res.send(categories);
            }
        }
    });
});
//请求每个条目的分类信息的路由
router.post('/requestcategorydetailes.html',function(req,res){
    console.log("requestcategorydetailes test passed!",req.body.queryItem);
	var queryItem = new RegExp(req.body.queryItem);
	var queryArr = [
		{ "subcategory":queryItem}
	];
	//console.log(queryArr);
    blogArticleQueryModel.find({$or:queryArr}).exec(function(err,data){
	    if(err){
		    throw err;
	    }else{
		    //console.log(data);
			if(data){
				res.send(data);
			}
	    }
    });
})


module.exports = router;
