---
title: docker配置cloudflare
tags:
  - 群晖
date: 2025-04-22 18:23:06
---


#### docker配置cloudflare
```shell
# 客户端设置科学上网
docker run --name cloudflared --network bridge --dns=1.1.1.1 --dns=8.8.8.8 --restart=always cloudflare/cloudflared:latest tunnel run --token xxx
```
