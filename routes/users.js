var express = require('express');
var router = express.Router();
var mongoose = require('./common.js');

var PAGE_SIZE = 3;

//请求文章列表信息的路由
router.get('/requestlists.html', function(req, res, next) {
    //console.log(req.query.page);
    //当前页需要跳过的条数
    var page = req.query.page;
    var skipsize = (page-1)*PAGE_SIZE;
    blogArticleQueryModel.find({}).sort({"ctime":-1}).exec(function(err,data){
        //第一次查询,需要知道总的条数,
        var pagecounts = Math.ceil(data.length/PAGE_SIZE);
        //console.log(pagecounts);
        //分页条件
        blogArticleQueryModel.find({}).skip(skipsize).limit(PAGE_SIZE).sort({"ctime":-1}).exec(function(err,data){
            data.push({"pagecounts":pagecounts});
            res.send(data);
        });
    });
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
    console.log("requestcategoryLists test passed!");
    //查找所有的条目
    blogArticleQueryModel.find({}).exec(function(err,data){
        if(err){
            throw err;
        }else{
            var categories = [];//用于存放所有分类信息
            if(data){
                //循环遍历所有的分类信息
                for(var i in data){
                    categories.push(data[i].category);//将信息push进入category
                }
                //console.log(categories);
                res.send(categories);
            }
        }
    });
});
/*
//请求关于我的信息中分类信息的路由
router.post('/requestaboutme.html',function(req,res){
    console.log("requestaboutme test passed!",req.body.id);
    blogArticleQueryModel.find({}).exec(function(err,data){
        res.send(data);
    });
})
*/


module.exports = router;
