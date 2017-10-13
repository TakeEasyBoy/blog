/**
 * Created by Administrator on 2017/9/21.
 */
/*
* @作为公共服务器,前后端都可以访问
*
* */

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/blog',function(err){
    if(err){
        throw err;
    }else{
        console.log("connected to blog server ^@^");
    }
});

//定义用户名的数据库骨架
var blogSchema = new mongoose.Schema({
    username            :String,        //登陆名
    password            :String,
    role                :String

});

var blogQueryModel = mongoose.model("username",blogSchema,"username");

//定义新闻列表的数据库骨架
var blogArticleSchema = new mongoose.Schema({
    title               :String,        //登陆名
    content             :String,
    ctime               :String,
    category            :String,
    author              :String,
    abstract            :String,
    source				:String
});

var blogArticleQueryModel = mongoose.model("blogArticleContents",blogArticleSchema,"blogArticleContents");

//暴露blogQueryModel,blogArticleQueryModel给全局
global.blogQueryModel = blogQueryModel;
global.blogArticleQueryModel = blogArticleQueryModel;
//将mongoose暴露出去
module.exports = mongoose;