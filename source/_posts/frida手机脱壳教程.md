---
title: frida手机脱壳教程
date: 2023-12-25 14:32:38
tags:
  - frida
categories:
  - Android
---

## frida脱壳教程

### 1. PC安装
- 安装frida依赖库
   ```
   pip install frida
   ```

### 2. 手机安装
1. 查看手机类型，并去 https://github.com/frida/frida/releases 下载对应server，例如 `frida-server-16.0.18-android-x86_64.xz`
   ```
   adb shell getprop ro.product.cpu.abi
   ```
2. 解压文件，把`frida-server-16.0.18-android-x86_64`复制到手机目录中，并修改权限，然后运行：
   ```
   adb push path\frida-server /data/local/tmp
   chmod +x frida-server
   ./frida-server
   ```

### 3. 脱壳
1. PC命令行运行`frida-ps -U`，检查是否成功连接frida-server，查看应用包名
2. 脱壳指定程序`frida-dexdump -U -f com.xxx.xxx` 或者 frida-dexdump -FU 快速转存前台应用程序

### 4. Frida spawn 启动app
- 命令行指定包名、指定hook.js路径，启动app
    ```
    frida -U -f com.xxx.xxx -l hook.js
    ```

### 2023.10.25 发现一个很牛逼的js文件，可以提取360加固的dex
1. 模拟器开启frida服务
2. 命令行运行 `frida -U -f {包名} -l dexDump.js --no-pause`

原文链接：[[原创]Frida-Apk-Unpack 脱壳工具-Android安全-看雪论坛-安全社区|安全招聘|bbs.pediy.com](https://bbs.kanxue.com/thread-251924.htm) <br>
Github链接：https://github.com/GuoQiang1993/Frida-Apk-Unpack