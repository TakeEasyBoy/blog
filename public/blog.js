/**
 * Created by Administrator on 2017-10-01.
 * 用于每个页面的请求分类分类信息功能,
 * 规定后台传过来的数据是个存好每个条目已经分好类别的数组,减少服务器负载
 *module description
 */
;(function(exports){
	//显示分类列表,将对应页面的分类信息穿进来
	let baseurl = "http://www.westbrothers.cn:8080"
    function showcategoryLists(data){
        //ajax请求分类信息
	    var tagType = ['btn-info','btn-primary','btn-success','btn-warning','btn-danger'];
	    var typeindex  ;

        $.get(''+baseurl+'/users/requestcategoryLists.html?cate='+data,function (data) {
            if(data){
                var category = [];    //用于遍历对象
                var categories = [];//结构,:类别+长度;存储所有的类别
                var obj = {};     //用于存储新的包含数量的类别
                for(var i in data){
                    //先遍历,找到所有的分类信息,然后在外面进行处理
                    //console.log(data[i],typeof data);
                    //后台传过来的分类信息是是一个数组转换程的字符串,分类信息以 ',' 隔开,因此使用分割字符串的方式对数据进行分割,获得具体的分类信息
                    var items = data[i].split(',');
                    //将分割出来的每个数据都压入categories分类信息中,得到所有的分类信息
                    for(var j = 0;j < items.length;j++){
//                          console.log(items[j]);
                        categories.push(items[j]);
                    }
                }
                //处理分类信息
                for(var i = 0; i < categories.length;i++){
                    var v = categories[i];
                    if(obj[v] && (obj[v].value == v))  {          //obj[v] && (obj[v].value == v)若果位置变换,那么会报错,因为obj[v].value 值为undefined
                        obj[v].count = ++obj[v].count;            //若之前出现过,那么就将count+1
                    }else {                                       //若之前未出现过,则将该类型存储到obj对象中,
                        obj[v] = {};
                        obj[v].count = 1;
                        obj[v].value = v;
                        category.push(v);                         //将每个类别存入category,用于后面遍历obj中的对象
                    }
                }
                //拼接分类信息
                var html = '';

	            for(var i in category){
		            //用产生的随机数来生成按钮的颜色
		            typeindex = Math.floor(Math.random()*5);
                    html += '<p><button class="btn '+tagType[typeindex]+'" type="button">'+obj[category[i]].value+'</button></p>';
                }
                $("#category").html(html);
            }
        });
    }
	//
    function searchkeywors(){
        $("#searchBtn").on('click',function(){
            $("#keySearch").val();
            console.log($("#keySearch").val());
        });
    }
	//注册每个分类按钮的事件,通过回调函数的方式将数据回传
	function requestcategorydetailes(cb){
		//事件委派的方式为每个按钮添加跳转至相应界面的事件请求
		$("#category").on('click','button',function(){
			//console.log($(this).text());
			//查找每个的分类请求
			var queryItem = $(this).text();
			$.post(''+baseurl+'/users/requestcategorydetailes.html',{"queryItem":queryItem},function(data){
				if(data){
					//console.log(data);
					//通过回调函数的形式将数据进行返回
					cb(data);
				}
			});
		});
	}

	//显示文章列表的方法
	/*
	* showArticleLists(options)
	*
	* params: {
	*   "maincategory":'',
	*   "page":1,
	* }
	* */
	function showArticleLists(options){
		//设置默认属性
		var def = {"maincategory":"","page":1};
		var settings = $.extend({},def, options);
		console.log(options,settings);
		var page = settings.page;
		var maincategory = settings.maincategory;
		var keywords = $("#keySearch").val();
		//cate 主要用于主分类信息的查询
		$.get(''+baseurl+'/users/requestlists.html?page='+page+'&keywords='+keywords+'&cate='+maincategory,function (data) {
			if(data){
				var html = '';
				var pagecounts = data.pop(data).pagecounts;//获取总的信息条数
//                   console.log(pagecounts);
				//拼接文章列表
				for(var i in data){
					html += '<div class="blog-post">';
					html += '<h3 class="blog-post-title"><a href="articledetaile.html?id='+data[i]._id+'">'+data[i].title+'</a></h3>';
					html += '<p class="blog-textindent">'+data[i].abstract+'</p>';
					html += '<p class="blog-textindent color647686 blog-text-readmore"><a href="articledetaile.html?id='+data[i]._id+'">阅读全文...</a></p>';
					html += '<p class="blog-abstract-info"><span >'+ data[i].ctime+'</span>  <span>阅读量:(565)</span>    <a href="#">评论:(10)</a></p>';
					html += '<p class="blog-categories-info blog-textindent">分类标签: '+data[i].subcategory+'</p><hr></div>';
				}
				$("#articleLists").html(html);

				//拼接分页信息
				var html = '';
				//如果当前页大于1,才显示上一页
				//分页这里有bug,无法通过拼接字符串的方式拼接出一个showArticleLists("maincategory":"","page":1);
				if(page > 1){
					html += '<li><a href="javascript:showArticleLists({page:'+(page-1)+'})" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
				}else{
					html += '<li class="disabled"><a href="javascript:showArticleLists({page:'+(page-1)+'})" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
				}
				for(var i = 1; i <= pagecounts;i++){
					if(page == i){
						html += '<li class="active"><a href="javascript:showArticleLists({page:'+i+'})">'+i+'</a></li>';
					}else{
						html += '<li><a href="javascript:showArticleLists({page:'+i+'})">'+i+'</a></li>';
					}

				}
				//如果当前页小于总的页数,才显示下一页
				if(page < pagecounts){
					html += '<li><a href="javascript:showArticleLists({page:'+(page+1)+'})" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
				}else{
					html += '<li class="disabled"><a href="javascript:showArticleLists({page:'+(page+1)+'})" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
				}
				$("#pagelists").html(html);
			}else{
				var html ='不好意思,没有找到你想要的..';
				$("#articleLists").html(html);
			}
		});
	}
	/*function showArticleLists(page){
		var keywords = $("#keySearch").val();
		//cate 主要用于主分类信息的查询
		$.get('/users/requestlists.html?page='+page+'&keywords='+keywords+'&cate='+maincategory,function (data) {
			if(data){
				var html = '';
				var pagecounts = data.pop(data).pagecounts;//获取总的信息条数
//                   console.log(pagecounts);
				//拼接文章列表
				for(var i in data){
					html += '<div class="blog-post">';
					html += '<h3 class="blog-post-title"><a href="articledetaile.html?id='+data[i]._id+'">'+data[i].title+'</a></h3>';
					html += '<p class="blog-textindent">'+data[i].abstract+'</p>';
					html += '<p class="blog-textindent color647686 blog-text-readmore"><a href="articledetaile.html?id='+data[i]._id+'">阅读全文...</a></p>';
					html += '<p class="blog-abstract-info"><span >'+ data[i].ctime+'</span>  <span>阅读量:(565)</span>    <a href="#">评论:(10)</a></p>';
					html += '<p class="blog-categories-info blog-textindent">分类标签: '+data[i].subcategory+'</p><hr></div>';
				}
				$("#articleLists").html(html);

				//拼接分页信息
				var html = '';
				//如果当前页大于1,才显示上一页
				if(page > 1){
					html += '<li><a href="javascript:showArticleLists('+(page-1)+')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
				}else{
					html += '<li class="disabled"><a href="javascript:showArticleLists('+(page-1)+')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
				}
				for(var i = 1; i <= pagecounts;i++){
					if(page == i){
						html += '<li class="active"><a href="javascript:showArticleLists('+i+')">'+i+'</a></li>';
					}else{
						html += '<li><a href="javascript:showArticleLists('+i+')">'+i+'</a></li>';
					}

				}
				//如果当前页小于总的页数,才显示下一页
				if(page < pagecounts){
					html += '<li><a href="javascript:showArticleLists('+(page+1)+')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
				}else{
					html += '<li class="disabled"><a href="javascript:showArticleLists('+(page+1)+')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
				}
				$("#pagelists").html(html);
			}else{
				var html ='不好意思,没有找到你想要的..';
				$("#articleLists").html(html);
			}
		});
	}*/
	exports.showcategoryLists = showcategoryLists;
	exports.searchkeywors = searchkeywors;
	exports.requestcategorydetailes = requestcategorydetailes;
	exports.showArticleLists = showArticleLists;


})(window);