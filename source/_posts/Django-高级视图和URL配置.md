---
title: Django 高级视图和URL配置
date: 2018-12-20 10:25:17
tags: 
    - Django
categories:
    - Python
---
### URL配置小技巧
为了解决开发后期视图函数过多，一个一个地导入视图函数很繁琐的问题，可以直接导入views模块自身。
```
from django.conf.urls import url
from . import views

urlpatterns = [
    url('^$', views.index),
    url('^hello/$', views.hello)
]
```
#### 具名分组
1. ##### 通过位置参数把片段传给视图：
```
from django.conf.urls import url
from . import views

urlpatterns = [
    url('^reviews/([0-9]{4}/([0-9]{2})$)', views.index),
]
```
__注意：__
- 若想捕获URL中的值，要把值放在括号里
- 在视图函数中按参数位置接收传递的值

例如：
+ 对`/reviews/2005/03/`的请求，Django调用`view.index(request,'2005','03')`函数
2. ##### 通过具名分组传递参数
```
from django.conf.urls import url
from . import views

urlpatterns = [
    url('^reviews/(?P<year>[0-9]{4}/(?P<month>[0-9]{2})$)', views.index),
]
```
这个URL配置跟前一个实现的URL模式完全一样，只不过有一处不同：捕获的值以关键字参数传递给视图函数，而不是位置参数。
例如：
+ 对`/reviews/2005/03/`的请求，Django调用`view.index(request,year='2005',month='03')`函数

#### URL配置搜索的范围
URL配置搜索的是所请求的URL，而且把它视作是普通的Python字符串。搜索的范围不包括GET或POST参数，抑或域名。例如对 http://www.example.com/myapp/ 的请求，URL 配置只查找 myapp/;对 http://www.example.com/myapp/?page=3 的请求，URL 配置只查找 myapp/。URL 配置不关心请求方法。也就是说，相同 URL 的所有请求方法(POST、GET、HEAD，等等)都交由同一个视图函数处理。
#### 捕获的参数始终是字符串
不管正则表达式匹配的是什么类型，捕获的每个参数都以普通的Python字符串传递给视图，因此在视图函数中对参数进行处理时，要注意对接收的参数转型。
#### 为视图的参数指定默认值
```
# URL配置
from django.conf.urls import url
form . import views

urlpatterns = [
    url('^review/$',views.page),
    url('^review/page(?P<num>[0-9]+)',views.page)
]

# 视图函数
def page(request, num='1'):
    pass
```
上面两个URL指向同一个视图，在视图函数中为第一个URL设置了默认参数num=1。
### 反向解析URL
目前的程序可以从用户请求的URL开始，调用正确的Django视图，并从URL中提取可能需要的参数及其值，传给视图。在项目中，如果我们需要在浏览器显示完整的URL呢？这时，就需要从Django视图对应的标识以及可能传入的参数值开始，获取相应的URl。这个过程就成为反向解析URL。
Django在不同的层中提供了执行URL反转所需的工具：
+ 在模板中，使用url模板标签
+ 在Python代码中，使用django.core.urlresolvers.reverse()函数
+ 在处理Django模型实例URL相关的高层代码中，使用get_absolute_url()方法

__使用URL模板标签__
```
# URL配置
from django.conf.urls import url
from .import views
urlpattern = [
    url('^index/([0-9]{4})/$', views.index, name='index')
]

# 模板中使用url标签
{% url 'index' 2018 %}
```
__在Python代码中，通过reverse()函数获得__
```
# URL配置
from django.conf.urls import url
from . import views

urlpatterns = [
    url('^index/$', views.index),
    url('^hello/([0-9]{4})/$', views.hello, name='hello')
]

# 视图
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse

def hello(request, year):
    return HttpResponse(year)
    
def index(request):
    year = 2018
    return HttpResponseRedirect(reverse('hello', args=(2018, )))
```
例如页面链接为`http://127.0.0.1:8000/index/2018/`，通过以上两种方式得到的url为`/index/2018/`

__某些情况下，视图是通用的，URL和视图时间存在多对一关系，URL反转时视图名称不足以唯一标识。__
