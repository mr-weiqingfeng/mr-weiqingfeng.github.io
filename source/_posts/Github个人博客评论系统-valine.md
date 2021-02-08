---
title: Github个人博客评论系统-Valine
date: 2018-12-19 15:17:18
tags: 
    - Hexo
    - Valine
    - LeanCloud
    - 博客
categories:
    - Hexo
comments: true
---
1. #### 登录[LeanCloud](https://leancloud.cn/)注册账号
2. #### 在LeanCloud -> 控制台新建应用
3. #### 在当前应用 -> 设置 -> 应用key 页面获得 __appid__ 和 __appkey__ 
{% asset_img QQ20181219-152453.png QQ20181219-152453 %}
4. #### 在 __主题配置文件__ _config.yml 中设置配置valine
```
valine:
  enable: true # When enable is set to be true, leancloud_visitors is recommended to be closed for the re-initialization problem within different leancloud adk version.
  appid: ************ # your leancloud application appid
  appkey: ************ # your leancloud application appkey
  notify: false # mail notifier , https://github.com/xCss/Valine/wiki
  verify: false # Verification code
  placeholder: Just go go # comment box placeholder
  avatar: mm # gravatar style
  guest_info: nick,mail # custom comment header nick,mail,link
  pageSize: 10 # pagination size
  visitor: false
```
5. #### 需要添加评论功能的页面添加 comments 配置项
```
title: 
date: 2018-12-19 14:07:58
comments: true
```