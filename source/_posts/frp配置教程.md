---
title: frp配置教程
date: 2025-10-09 09:25:17
tags:
  - 群晖
  - 内网穿透
---

#### 群晖安装Frpc客户端，配置内容如下
```toml
serverAddr = "www.example.com"
serverPort = 7000
auth.token = "123456"

[[proxies]]
name = "nas"
type = "tcp"
localIP = "127.0.0.1"
localPort = 5000
remotePort = 6443
```

#### 服务端安装Frps服务端
从frp release页下载：[https://github.com/fatedier/frp/releases](https://github.com/fatedier/frp/releases)，解压到指定位置，然后配置**frps.toml**文件。注意要和客户端配置保持一致。
```toml
bindPort = 7000
auth.token = "123456"
```
启动服务端frp服务：
```shell
./frps -c ./frps.toml
```
配置frp服务开机自启动：
```shell
vim /etc/systemd/system/frps.service
sudo systemctl enable --now frps
```
**frps.service**的内容为：
```
[Unit]
Description=frps
After=network.target

[Service]
Type=simple
User=root
ExecStart=/root/frp/frps -c /root/frp/frps.toml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

**注意服务端要放行7000端口，用于与frp客户端通信；放行6443端口，用于从外部访问**

