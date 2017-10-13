/**
 * Created by Administrator on 2017-10-01.
 * 用于每个页面的请求分类分类信息功能,
 * 规定后台传过来的数据是个存好每个条目已经分好类别的数组,减少服务器负载
 *module description
 */
;(function(){
    function showcategoryLists(){
        //ajax请求分类信息
        $.get('/users/requestcategoryLists.html',function (data) {
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
                    html += '<button class="btn btn-info" type="button"><a href="">'+obj[category[i]].value+'&emsp;<span class="badge">'+obj[category[i]].count+'</span></a></button>';
                }
                $("#category").html(html);
                //console.log(obj,category);
            }
        });
    }
    function searchkeywors(){
        $(function(){
            $("#searchBtn").on('click',function(){
                $("#keySearch").val();
                console.log($("#keySearch").val());
            });

        })

    }
    window.showcategoryLists = showcategoryLists;
    window.searchkeywors = searchkeywors;
})();