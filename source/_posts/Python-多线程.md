---
title: Python-多线程
date: 2018-12-27 16:23:03
tags:
    - 多线程
categories:
    - Python
---
#### 使用多线程的两种方式
1. 直接使用
```python
from threading import Thread
import time

def func(arg):
    time.sleep(1)
    print('hello %s' % arg)

for i in range(5):
    Thread(target=func, args=(i, )).start()

# 输出
# hello 0
# hello 1
# hello 4
# hello 2
# hello 3

# Process finished with exit code 0
```
2. 继承 Thread 类
```python
from threading import Thread
import time

class MyThread(Thread):
    def __init__(self, arg):
        super().__init__()
        self.arg = arg
    def run(self):
        time.sleep(1)
        print(self.arg)

MyThread(10).start()
# 输出
# 10

# Process finished with exit code 0
```
---
__在同一个进程中，多个线程之间的数据是共享的:__
```python
from threading import Thread

count = 100

def func():
    global count
    count -= 1

t = Thread(target=func)
t.start()
t.join()
print(count)
```
可以看出，在线程中通过`global`的方式引入全局变量，并进行了减法操作，然后主线程中打印`count`的值，`count`的值确实被改变，说明在一个进程中，全局变量在多个线程之间是共享的。

__进程和线程的区别__:
- 进程是最小的内存分配单位
- 线程是操作系统调度的最小单位
- 进程内至少包含一个线程
- 进程中可以开启多个线程
- 开启一个线程所需要的时间远远小于开启一个进程

---

#### 守护线程
和守护进程相似，主线程结束，守护线程会随之结束：
```python
from threading import Thread
import time

def func():
    time.sleep(1)
    print('fuck')

if __name__ == '__main__':
    t = Thread(target=func)
    t.daemon = True
    t.start()

# 输出

# Process finished with exit code 0
```
控制台什么都没有输出，这是因为主线程立即运行完毕，线程t被设置成守护线程，也随着主线程的结束而结束。
主线程在其他__非守护进程__运行完毕之后才算执行完毕。因为主线程的结束意味着进程的结束，进程整体的资源都将被回收，而进程必须必须保证非守护线程都运行完毕后才能结束。
需要注意的是，守护进程会在主进程结束之后等待其他子进程的结束才结束：
```python
from threading import Thread
import time

def func():
    time.sleep(1)
    print('func')

def func2():
    time.sleep(2)
    print('func2')
if __name__ == '__main__':
    t = Thread(target=func)
    t.daemon = True
    t.start()
    Thread(target=func2).start()

# 输出
# func
# func2

# Process finished with exit code 0
```
#### 线程锁
先看一个死锁现象：
```python

```