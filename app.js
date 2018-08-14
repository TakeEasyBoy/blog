var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var admin = require('./routes/admin');
var ueditor = require("./routes/ueditor");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/admin', admin);
/*
 注:大大大大大的坑,这段代码需要放在下面处理ueditor路由的下面,否则会报
 //请求后台配置项http错误，上传功能将不能正常使用！
 app.use('/', function (req, res) {
 console.log(" res.render('ueditor');");
 res.render('ueditor');
 });
 */


app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = '/upload/images/';
    var ActionType = req.query.action;
	console.log(ActionType);
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo' || ActionType === 'uploadscreenimage' || ActionType === 'uploadscrawl') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/upload/files/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/upload/videos/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

app.use('/', function (req, res) {
    res.render('ueditor');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


app.listen(8080, function () {
    console.log("服务器开启成功");
});


module.exports = app;


