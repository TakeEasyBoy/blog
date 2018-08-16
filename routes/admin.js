var express = require('express');
var router = express.Router();
var mongoose = require('./common.js');

//定义每页页的条数
var PAGE_SIZE = 10;

//console.dir(mongoose); //测试成功 可用

//处理用户登陆验证的请求
router.post('/checkuser',function(req,res){
    console.log('check router test passed');
    var username = req.body.username;
    var password = req.body.password;
    blogQueryModel.find({"username":username,"password":password}).exec(function(err,data){
        if(err){
            throw err;
        }else{
            if(data.length > 0){
                res.cookie("user",username);
                res.send("1");
            }else{
                res.send("0");
            }
        }
    })
});

//退出登陆
router.get('/logout',function(req,res){
	console.log("logout");
	res.clearCookie('user');
	res.send('<script>alert("退出成功");location.href="/admin/login";</script>');
});

//检查是否有翻墙进来的
router.get('/check',function(req,res){
    if(req.cookies.user == undefined){
        res.send('alert("请走正道,谢谢");location.href="./login";');
    }else{
        var username = req.cookies.user;
        blogQueryModel.find({"username":username}).exec(function(err,data){
            if(err){
                throw err;
            }else{
                if(data.length > 0){
                    res.send("1");
                }else{
                    res.send('alert("请走正道,谢谢");location.href="./login";');
                }
            }
        });
    }
});

//处理新闻发布的请求
router.post('/article_publish',function(req,res){
    console.log("publish test passed");
    //console.log(req.body.articleSource);
    var author = req.body.articleAuthor;
    var content = req.body.content;
    var title = req.body.articleTitle;
	var maincategory = req.body.maincategory;
    var category = req.body.category;
    var articleAbstract = req.body.articleAbstract;
    var source = req.body.articleSource;
    var time = new Date().toLocaleString();

    var datas = new blogArticleQueryModel();
    datas.title = title;
    datas.content = content;
    datas.author = author;
    datas.maincategory = maincategory;
	datas.subcategory = category;
    datas.ctime = time;
    datas.abstract = articleAbstract;
    datas.source = source;
    //console.log(datas);
    datas.save(function(err,data){
        if(err){
            throw err;
        }else{
            //res.send('alert("文章添加成功");location.href="/news_lists"');
            res.send("文章发布成功!");
        }
    });
});

//处理请求新闻列表的请求
/*
*
* 扩展:db.collection.find({ $or : [{a : 1}, {b : 2} ]})
 符合两个条件中任意一个的数据。$or语法表示或的意思。
* */
router.get('/requestlists',function(req,res){
    console.log("requestlists test passed");
    var keywords = new RegExp(req.query.keywords) ;
    //获取当前页数
    var page = req.query.page;
    //定义需要跳过的页数
    var skippage = (page - 1)*PAGE_SIZE;
    //数据库查询使用or查询条件
    var queryArr = [
        { "title"	:keywords},
        { "content"	:keywords},
        { "abstract":keywords},
        { "author"	:keywords},
        { "source"	:keywords},
        { "category":keywords}
    ];
    blogArticleQueryModel.find({$or:queryArr}).exec(function(err,data){
        //获取总页数
        var pagecounts =Math.ceil(data.length/PAGE_SIZE);
        blogArticleQueryModel.find({$or:queryArr}).skip(skippage).limit(PAGE_SIZE).sort({"_id":-1}).exec(function(err,data){
            //console.log(data);
            //将当前的总页数传递给前端.
            data.push({"pageconuts":pagecounts});
            res.send(data);
        })

    })
});

//处理删除新闻条目的请求
router.get('/deleteitem',function(req,res){
    console.log("deleteitem test passed");
    var id = req.query.id;
    blogArticleQueryModel.findById({"_id":id}).exec(function(err,data){
        if(err){
            throw err;
        }else{
            data.remove();
            res.send("删除"+data.title+"成功!");
        }
    })
})


//处理修改新闻条目的请求
router.get('/modifyitem',function(req,res){
    console.log("modifyitem test passed");
    var id = req.query.id;
    blogArticleQueryModel.findById({"_id":id}).exec(function(err,data){
        //console.log(data);
        if(err){
            throw err;
        }else{
            res.send(data);
        }
    })
})

//处理确认修改新闻条目的请求
router.post('/comfirmmodify',function(req,res){
    console.log("comfirmmodify test passed");
    //console.dir(req.body);
    var id = req.body.id;
    var author = req.body.articleAuthor;
    var content = req.body.content;
    var title = req.body.articleTitle;
    var maincategory = req.body.maincategory;
    var category = req.body.category;
    var articleAbstract = req.body.articleAbstract;
    var source = req.body.articleSource;
    //console.log(content);
    blogArticleQueryModel.findById({"_id":id}).exec(function(err,data){
        console.log(data);
        data.title = title;
        data.content = content;
        data.author = author;
        data.maincategory = maincategory;
        data.subcategory = category;
        data.abstract = articleAbstract;
        data.source = source;
        if(err){
            throw err;
        }else{
            data.save(function(err){
                if(err){
                    throw err;
                }else{
                    res.send("1");
                }
            })
        }
    })
})


module.exports = router;
