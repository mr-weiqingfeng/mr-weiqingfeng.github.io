---
title: ubuntu svn记录
date: 2024-06-18 09:51:31
tags:
   - svn
categories:
   - ubuntu
---

### ubuntu上svn记住账号密码
`svn`每次`update`都要输入密码，有效解决办法是修改`~/.subversion/auth/svn.simple`下的配置文件：
```text
K 8
passtype
V 6
simple
K 15
svn:realmstring
V 58
<http://192.168.60.224:80> CollabNet Subversion Repository
K 8
username
V 11
weiqingfeng
K 8
password
V 6
123456
END
```
修改`passtype`和`password`两个配置项.

### svn拉取部分文件
有时会遇到一个非常大的svn项目，可以根据自己的需要，拉取指定的文件，而不用全部拉到本地：
```shell
# 检出顶层文件夹
svn checkout --depth immediates http://192.168.60.224/svn/wanzi/WanZiPackage WanZiPackage
cd WanZiPackage
# 检出指定文件夹
svn update --set-depth infinity config
cd games
svn update --set-depth infinity 1358_sgbxdw
# 检出指定文件
svn update games.xml

# svn版本回退到指定提交记录,3368指当前版本号
cd /Users/wei/PycharmProjects/WanZiPackage/config/sdk/douyin
svn merge -r 3368:3366 /Users/wei/PycharmProjects/WanZiPackage/config/sdk/douyin
```




