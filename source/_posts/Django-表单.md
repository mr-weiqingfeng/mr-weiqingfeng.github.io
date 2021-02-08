---
title: Django 表单
date: 2018-12-19 16:34:05
tags: 
    - Django
categories:
    - Python
---
### 从请求对象中获取数据

每一个视图都有一个必须的参数request，这个request是一个HttpRequest对象，比如：
```
def hello(request):
    return HttpResponse('Hello world')
```
执行视图函数时，可以通过request参数的属性和方法，获取所需的参数
#### HttpRequest对象的一些方法和属性
属性/方法 | 说明 | 示例
:- | :- | :-
request.path | 完整的路径，不含域名，但是包含其前导斜线 | '/hello/'
request.get_host() | 主机名/域名 | '127.0.0.1:8000' / 'www.baidu.com'
request.get_full_path() | 包含查询字符串(如果有)的路径 | '/index/?name=jack'
request.is_secure() | 通过HTTPS访问时为True，否则为False | True/False
#### 关于请求的其他信息
request.META的值是一个Python字典，包含请求的所有HTTP首部，例如：
```
SERVER_PROTOCOL:HTTP/1.1
HTTP_CACHE_CONTROL:max-age=0
PYTHONUNBUFFERED:1
DJANGO_SETTINGS_MODULE:mysite.settings
wsgi.file_wrapper:<class 'wsgiref.util.FileWrapper'>
wsgi.errors:<_io.TextIOWrapper name='<stderr>' mode='w' encoding='UTF-8'>
HTTP_ACCEPT:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
XPC_FLAGS:0x0
__CF_USER_TEXT_ENCODING:0x1F5:0x19:0x34
HTTP_HOST:127.0.0.1:8000
LC_CTYPE:zh_CN.UTF-8
TZ:Asia/Shanghai
PYTHONIOENCODING:UTF-8
wsgi.url_scheme:http
wsgi.input:<_io.BufferedReader name=5>
PYCHARM_MATPLOTLIB_PORT:61701
SERVER_SOFTWARE:WSGIServer/0.2
wsgi.run_once:False
HTTP_ACCEPT_LANGUAGE:zh-CN,zh;q=0.9
PYTHONPATH:/Users/wei/PycharmProjects/mysite:/Applications/PyCharm.app/Contents/helpers/pycharm_matplotlib_backend
CONTENT_TYPE:text/plain
TMPDIR:/var/folders/3s/px2jv1cx29v4g9j3q5lh3df00000gn/T/
XPC_SERVICE_NAME:com.jetbrains.pycharm.5568
SHELL:/bin/bash
Apple_PubSub_Socket_Render:/private/tmp/com.apple.launchd.cU2YPr0kgj/Render
HTTP_COOKIE:sessionid=c73inpxt1lzf7canjdp1r71g04q5lfxo; csrftoken=s89tX1Mdb0iCJJJtgR44TbyBuq2AEU5R6gW4Tprk7G5UZQ2L9S09YIi4XgL0cmSa
HTTP_USER_AGENT:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36
HOME:/Users/wei
PATH:/usr/local/opt/openssl/bin:/Library/Frameworks/Python.framework/Versions/3.5/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/VMware Fusion.app/Contents/Public:/opt/X11/bin:/Users/wei/Library/Android/sdk/build-tools/27.0.3:/Users/wei/Library/Android/sdk/platform-tools:/Users/wei/Library/Android/sdk/tools:/Applications/MAMP/Library/bin
__PYVENV_LAUNCHER__:/Library/Frameworks/Python.framework/Versions/3.5/bin/python3.5
SERVER_NAME:1.0.0.127.in-addr.arpa
VERSIONER_PYTHON_VERSION:2.7
SSH_AUTH_SOCK:/private/tmp/com.apple.launchd.blyfS2VSD5/Listeners
REMOTE_HOST:
QUERY_STRING:
HTTP_UPGRADE_INSECURE_REQUESTS:1
PWD:/Users/wei/PycharmProjects/mysite
RUN_MAIN:true
wsgi.multithread:True
CSRF_COOKIE:s89tX1Mdb0iCJJJtgR44TbyBuq2AEU5R6gW4Tprk7G5UZQ2L9S09YIi4XgL0cmSa
GATEWAY_INTERFACE:CGI/1.1
SERVER_PORT:8000
LOGNAME:wei
HTTP_ACCEPT_ENCODING:gzip, deflate, br
wsgi.multiprocess:False
REMOTE_ADDR:127.0.0.1
wsgi.version:(1, 0)
SCRIPT_NAME:
VERSIONER_PYTHON_PREFER_32_BIT:no
PATH_INFO:/
USER:wei
HTTP_CONNECTION:keep-alive
PYCHARM_HOSTED:1
DISPLAY:/private/tmp/com.apple.launchd.2m8DsWaCsr/org.macosforge.xquartz:0
CONTENT_LENGTH:
REQUEST_METHOD:GET
```
当访问request.META不存在的键时，会抛出keyError异常，应当用try/except的方式或者get()方法访问：
```
def index(request):
    try:
        ua = request.META['HTTP_USER_AGENT']
    except KeyError:
        ua = 'unknown'
    return HttpResponse(ua)
# 或者
def index(request):
    ua = request.META.get('HTTP_USER_AGENT','unknown')
    return HttpResponse(ua)
```
#### request.GET 和 request.POST
request.GET 和 request.POST包含了用户提交的信息，它们都是类似字典的对象，和标准的Python字典相似，都有get()、keys()、values()方法。通过type()和dir()方法查看GET的类型和属性：
```
print(type(request.GET))
# <class 'django.http.request.QueryDict'>
print(dir(request.GET))
# ['appendlist', 'clear', 'copy', 'dict', 'encoding', 'fromkeys', 'get', 'getlist', 'items', 'keys', 'lists', 'pop', 'popitem', 'setdefault', 'setlist', 'setlistdefault', 'update', 'urlencode', 'values'...]
```
在访问request.GET 和 request.POST获取数据时，要注意可能会因为不存在key而抛出异常，要先判断再取值：
```
def search(request):
    if 'q' in request.GET and request.GET['q']:
        message = 'get q value'
    else:
        message = 'get a none'
    return HttpResponse(message)
```
### 表单验证
表单比较简单的时候，可以在视图函数中对用户提交的数据进行验证：
```
def search(request):
    errors = []
    if 'q' in request.GET and request.GET['q']:
        if len(q) > 20:
            errors.append('数据过长，请输入小于20个字符进行搜索')
        else:
            return render(request,'search_result.html',{...})
    else:
        errors.append('请输入关键字进行搜索')
    return render(request,'search_fom.html',{'errors':errors})
```
当表单变得复杂的时候，我们需要处理每一个表单字段，这时应该使用Django中的高级库处理、验证表单
#### django.forms
为要处理的每个HTML表单定义一个Form类。按照约定，把Form类放在单独的forms.py文件中，mysite/forms
```
from django import forms
class ContactForm(forms.Form):
    subject = forms.CharField()
    email = forms.EmailField(required=False)
    message = forms.CharField()
```
这个类能把自己显示为HTML，在django shell命令窗口，执行下面的代码:
``` 
>>> from mysite.forms import ContactForm
>>> f = ContactForm()
>>> print(f)
<tr><th><label for="id_subject">Subject:</label></th><td><input type="text" name="subject" id="id_subject" required></td></tr>
<tr><th><label for="id_email">Email:</label></th><td><input type="email" name="email" id="id_email"></td></tr>
<tr><th><label for="id_message">Message:</label></th><td><input type="text" name="message" id="id_message" required></td></tr>
>>> print(f.as_ul())
<li><label for="id_subject">Subject:</label> <input type="text" name="subject" id="id_subject" required></li>
<li><label for="id_email">Email:</label> <input type="email" name="email" id="id_email"></li>
<li><label for="id_message">Message:</label> <input type="text" name="message" id="id_message" required></li>
>>> print(f.as_p())
<p><label for="id_subject">Subject:</label> <input type="text" name="subject" id="id_subject" required></p>
<p><label for="id_email">Email:</label> <input type="email" name="email" id="id_email"></p>
<p><label for="id_message">Message:</label> <input type="text" name="message" id="id_message" required></p>
```
可以只显示某个字段的HTML:
```
>>> print(f['email'])
<input type="email" name="email" id="id_email">
```
还能验证数据：
```
>>> f = ContactForm({'subject':'Title','email':'','message':'hello'})
>>> f.is_valid()
True
```
当传入不完整的表单时，表单对象就变成无效的了：
```
>>> f = ContactForm({'subject':'Title','email':''})
>>> f.is_valid()
False
>>> f.errors
{'message': ['这个字段是必填项。']}
>>> f['message'].errors
['这个字段是必填项。']
>>> f['email'].errors
[]
```
具有有效数据的表单实例有个cleaned_data属性，它的值一个字典
```
>>> f = ContactForm({'subject':'Title','email':'','message':'hello'})
>>> f.is_valid()
True
>>> f.cleaned_data
{'subject': 'Title', 'email': '', 'message': 'hello'}
```
__注意，f 在调用 is_valid() 之后才有 cleaned_data属性__
#### 在视图中使用表单对象
定义一个Form对象，在视图函数中，将request.GET或者request.POST交给Form对象处理
```
# Form对象
class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()
    
# 视图函数
def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data
            # do_login(user['username'], user['password'])
            return HttpResponseRedirect('index')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})
    
# 模板
<form action="" method="post">
    <table>
        {{ form.as_table }}
    </table>
    {% csrf_token %}
    <input type="submit" value="Login">
</form>
```
#### 改变字段渲染方式
表单框架把各个字段的表现逻辑交给widget参数负责。每种字段的widget参数都有默认值。Field类表示验证逻辑，而widget表示表现逻辑。
```
from django import forms
class ContactForm(forms.Form):
    subject = forms.CharField()
    email = forms.EmailField(required=False)
    message = forms.CharField(widget=forms.Textarea)
```
上面代码中的message字段设置了forms.Textarea值后，显示为<textarea\>
#### 设定最大长度
为CharField指定max_length参数，用于验证参数长度。此外还有min_length参数。
```
from django import forms
class ContactForm(forms.Form):
    subject = forms.CharField(max_length=100)
    email = forms.EmailField(required=False)
    message = forms.CharField(widget=forms.Textarea)
```
#### 自定义验证规则
Django的表单系统会自动查找名称以clean_开头、以字段名结尾的方法。如果存在这样的方法，在验证过程中调用。clean_***方法会在指定字段的默认验证逻辑执行完毕后调用。
```
from django import forms
class ContactForm(forms.Form):
    subject = forms.CharField(max_length=100)
    email = forms.EmailField(required=False)
    message = forms.CharField(widget=forms.Textarea)
def clean_message(self):
    message = self.cleaned_data['message']
    num_words = len(message.split())
    if num_words < 4:
        raise forms.ValidationError('Not enough words!')
    return message
```
#### 指定标注
为字段添加label参数：
```
email=forms.EmailField(required=False,label='You e-mail address')
```