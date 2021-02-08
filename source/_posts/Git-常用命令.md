---
title: Git-常用命令
date: 2019-05-14 09:36:40
tags: 版本控制
---
#### 初始化

```
git init
```
初始化git仓库，可以是一个空的文件夹，也可以是一个已存在的文件夹
#### 把文件添加到版本库
git版本控制系统只能跟踪文本文件的改动，比如txt、网页、程序代码等等，而图片、视频这些二进制文件，虽然也能由版本控制系统管理，但是没法跟踪文件的变化。

添加一个具体的文件：
```
git add readme.txt
```
添加某一类文件：
```
git add *.txt
```
添加全部文件：
```
git add *.txt
```
要随时掌握⼯作区的状态，使⽤git status命令：
```
git status
```
如果git status告诉你有⽂件被修改过，⽤git diff可以查看修改内容：
```
git diff
```
"git diff HEAD -- readme.txt"命令可以查看⼯作区和版本库⾥⾯最新版本的区别：
```
git diff HEAD -- readme.txt
```
#### 版本回退
⽤git log命令可以告诉我们历史记录
```
git log
```
如果嫌输出信息太多，看得眼花缭乱的，可以试试加上--pretty=oneline参数：
```
git log --pretty=oneline
```
git log命令会显示历史提交记录以及 commit id (版本号)。
如果要回到历史某个版本，就必须知道当前是哪个版本，在git中，用HEAD表示当前版本。
上一个版本就是HEAD^。
上上一个版本就是HEAD^^。
向上100个版本可以写成是HEAD~100。

回退到上一个版本的命令：
```
git reset --hard HEAD^
```
也可以根据commit id号，指定回到某个版本。版本号没必要写全，前几位就可以了，git会自动去找。
```
git reset --hard 1a763f
```
回到历史某个版本后，又想再回到“未来”怎么办?
Git提供了⼀个命令git reflog⽤来记录你的每⼀次命令，查出历史记录后，根据commit id号，再回到“未来”的版本。
```
git reflog
```
#### 工作区和暂存区
Git和其他版本控制系统如SVN的⼀个不同之处就是有暂存区的概念。

工作区，就是git仓库目录。工作区有一个隐藏的目录".git"，是git的版本库。

版本库里存了很多东西，其中最重要的就是称为stage（或者叫index）的暂存区，还有Git为我们⾃动创建的第⼀个分⽀master，以及指向master的⼀个指针叫HEAD。

我们把⽂件往Git版本库⾥添加的时候，是分两步执⾏的：

第⼀步是⽤“git add”把⽂件添加进去，实际上就是把⽂件修改添加到暂存区；

第⼆步是⽤“git commit”提交更改，实际上就是把暂存区的所有内容提交到当前分⽀。
#### 撤销修改
当你改乱了⼯作区某个⽂件的内容，想直接丢弃⼯作区的修改时，⽤命令git checkout -- file：
```
git checkout -- readme.txt
```
当你不但改乱了⼯作区某个⽂件的内容，还添加到了暂存区时，想丢弃修改，分两步，第⼀步⽤命令git reset HEAD file，就回到了场景1，第⼆步按场景1操作:
```
git reset HEAD file
git checkout -- readme.txt
```
已经提交了不合适的修改到版本库时，想要撤销本次提交，参考版本回退⼀节，不过前提是没有推送到远程库。
#### 删除文件
从版本库删除文件，也会删除本地文件：
```
git rm readme.txt
```
从版本库删除文件，保留本地文件：
```
git rm readme.txt --cached
```
本地误删除了文件，从版本库恢复：
```
git checkout -- readme.txt
```
git checkout其实是⽤版本库⾥的版本替换⼯作区的版本，⽆论⼯作区是修改还是删除，都可以“⼀键还原”。
#### 远程仓库
##### 创建SSH Key
1. 打开shell（Window下打开Git Bash）,创建SSH Key。之后，可以在⽤户主⺫录⾥找到.ssh目录，⾥⾯有id_rsa和id_rsa.pub两个⽂件，这两个就是SSH Key的秘钥对，id_rsa是私钥，不能泄露出去，id_rsa.pub是公钥，可以放⼼地告诉任何⼈。
```
ssh-keygen -t rsa -C "youremail@example.com"
```
2. 登陆GitHub，打开“Account settings”，“SSH Keys”⻚⾯，然后，点“Add SSH Key”，填上任意Title，在Key⽂本框⾥粘贴id_rsa.pub⽂件的内容。
##### 添加远程库
由于远程库是空的，我们第⼀次推送master分⽀时，加上了-u参数，Git不但会把本地的
master分⽀内容推送的远程新的master分⽀，还会把本地的master分⽀和远程的master
分⽀关联起来，在以后的推送或者拉取时就可以简化命令
```
 git remote add origin git@github.com:michaelliao/learngit.git
 git push -u origin master
```
##### 从远程库克隆
```
 git clone
```
#### 分⽀管理
创建dev分⽀，然后切换到dev分⽀:
```
git checkout -b dev
```
等同于下面两条命令:
```
git checkout dev
git branck dev
```
然后，⽤git branch命令查看当前分⽀：
```
git branch
```
合并指定分⽀到当前分⽀：
```
git merge
```
删除分⽀：
```
git branch -d dev
```
查看分支合并图：
```
git log --graph
```

#### **常用命令*
```
初始化仓库
git init

添加所有未跟踪文件和修改文件到暂存区
git add .

提交本次修改到目前分支，并附提交说明
git commit -m "备注"

创建分支
git branch 分支名称

切换分支
git checkout 分支名称

查看分支
git branch

合并指定分支到当前分支
git merge 指定分支

删除分支
git branch -d 分支名称

推送到远程仓库（第一次推送到远程分支）
git push -u origin 分支名称

删除远程文件
1.先从暂存区删除文件
git rm --cached 文件名
2.提交本次删除
git commit -m 备注
3.推送到远程仓库
git push

删除本地分支
git branch -d 分支名称

删除远程分支（D 强制删除）
git push 仓库名称 -d 分支名称
git push 仓库名称 -D 分支名称

删除远程仓库
git remote rm 远程仓库名称

添加远程仓库
git remote add 远程仓库名称 远程仓库链接 
git remote add origin git@gitee.com:stormfeng/gittest.git
```