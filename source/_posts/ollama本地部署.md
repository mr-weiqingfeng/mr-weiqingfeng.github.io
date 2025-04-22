---
title: ollama本地部署
tags:
  - AI
date: 2025-04-18 14:18:07
---

Mac本地安装ollama：
```shell
brew install ollama
```

启动ollama：
```shell
ollams serve
```

ollama下载模型：
```shell
ollama pull deepseek-coder:6.7b
```

ollama执行模型运行：
```shell
ollama run deepseek-coder:6.7b
```

ollama webUI部署：
```shell
# 如果启动失败，docker设置代理
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```