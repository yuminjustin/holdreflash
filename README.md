# holdreflash
#仿微博下拉或上拉刷新
名字小土，也不知道怎么叫，那就叫上拉下拉刷新呗，模仿微博的效果。在容器顶部向下拉并释放或在底部向上拉并释放，然后返回回调函数，你想干嘛干嘛，不依赖jq或zp等类库。
### 1、HTML的布局结构<br /> 
![img](http://yuminjustin.cn/uploadfile/2015/0427/01.jpg "img")<br /> 
    <div id="holdBox">  //可视区域 
        // 必要的css属性 position: relative; overflow: hidden;
          <div id="insertBox"> //容器
          // 必要的css属性 position: relative;  overflow-y: scroll;
            <ul>  //列表区域
                <li> //可子模块
                    <p>
                        <span>
                        <a href="#">标题标题标题标题标题H</a>
                        </span>
                    </p>
                </li>
            </ul>
        </div>
    </div>
### 2、js的引用，要在HTML文件末尾在body结束符里面<br /> 
![img2](http://yuminjustin.cn/uploadfile/2015/0427/02.jpg "img2") <br /> 
### 3、js代码的使用<br /> 

     var h = new HoldReflash({
        target: "#holdBox",  //可视区域 必须是id
        insertf: "#insertBox", //父容器 必须是id
        insert: "ul", //列表区域 标签名
        item: "li",//子模块 标签名
        headonly: 0, //可选参数 默认是0（false） 布尔 true的时候屏蔽顶部下拉 
        footonly:0,//可选参数 默认是0（false） 布尔 true的时候屏蔽底部上拉
        headrelease: function (o) { //顶部回掉函数 返回的函数有两个方法 如下
              //o.success(html); //成功，将要插入的html字符串传入即可
              o.fail(); //失败，注意：成功和失败不能直接放在一起，要放在if else之类的条件语句中分开使用
        },
        footrelease: function (o) {//底部回掉函数 返回的函数有两个方法 如下
              o.success(html); //同上
              //o.fail(); //同上
        }
    });
1、[详细内容](http://yuminjustin.cn/html/plugin/2015/0427/31.html)<br />  
2、demo 扫一扫<br />  
![img3](http://yuminjustin.cn/uploadfile/2015/0427/03.jpg "img3")
