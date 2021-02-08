---
title: Github个人博客搭建-Hexo
date: 2018-12-19 11:47:05
tags: 
    - Hexo
    - 博客
categories:
    - Hexo
comments: true
---
### 环境搭建
#### Node.Js安装
下载地址：https://nodejs.org/en/
#### Hexo安装
```angular2
npm install -g hexo-cli
```
### Github博客发布流程
#### 基础项目搭建
```
hexo init myblog // 初始化项目

cd myblog

npm install // 安装依赖包
```
#### 项目配置文件设置
```
// 配置git项
deploy:
  type: git
  repo: git@github.com:StormFeng/StormFeng.github.io.git
  branch: master
```
#### 项目发布到Github
```
hexo d -g
```
### Hexo常用命令
```
hexo n '新的博客名' / hexo new '新的博客名'
hexo new page '新的页面'
hexo d -g // 部署到GitHub
```
### Hexo添加分类、标签(next主题)
文章.md设置:
```
tags:
    - Hexo
    - Python
categories:
    - Hexo
    - Python
```
新建tags页和categories页，在博客根目录输入 `hexo new page tags` 和 `hexo new page categories`
打开tags/index.md，修改如下：
```
title: tags
date: 2018-12-19 14:20:09
type: 'tags'
comments: false
```
### Hexo插入本地图片
1. 在hexo根目录_config.yml文件中配置 post_asset_folder:
```
post_asset_folder: true
```
2. 在文章统计目录新建与文章同名文件夹，用于放置图片资源，文档中通过以下方式引用
```
{% asset_path slug %}
{% asset_img slug [title] %}
{% asset_link slug [title] %}
```

### 项目备份到Github
#### 提交hexo项目文件夹到分支hexo
```
git clone git@github.com:StormFeng/StormFeng.github.io.git
cd StormFeng.github.io
git checkout -b hexo // 创建并切换到分支hexo
cp -r myblog StormFeng.github.io // 将hexo项目文件夹myblog复制到StormFeng.github.io
git add .
git commit -m "hexo"
git push
```
#### 在另一台电脑上pull hexo项目
```
git clone git@github.com:StormFeng/StormFeng.github.io.git
git pull origin hexo
cd StormFeng.github.io.git/myblog
npm install myblog
```
至此，hexo项目myblog可以在另一台电脑上使用，项目整体提交到hexo分支，hexo生成的静态文件(博客页面)提交到主分支master
#### 提交更新到hexo和git
```
# 切换到hexo根目录
hexo d -g

# 切换到项目根目录
git add .
git commit -m 'hexo'
git push
```