---
title: Python-事件
date: 2018-12-26 10:00:57
tags:
    - 事件
    - Event
    - 进程
categories:
    - Python
---
#### Python进程中事件的概念
通过一个信号来控制多个进程同时执行或者阻塞。
一个信号可以使所有的进程都进入阻塞状态，也可以控制所有的进程解除阻塞。
```python
from multiprocessing import Event
e = Event()
print(e.is_set()) # 查看一个事件的状态，事件被创建之后，默认返回值为False
print(111)
e.wait() # 根据e.is_set()的值来决定是否阻塞
print(111)

# 输出
# False
# 111

```
当`e.is_set()`返回值为`False`时，`e.wait()`方法使程序进入阻塞状态；当`e.is_set()`返回值为`True`时，`e.wait()`不再阻塞程序。`wait()`方法是依据事件的状态来决定自己是否阻塞。
`e.set()`将事件的状态改成`True`，相对应的方法是`e.clear()`，将事件的状态改成`False`。
#### 实际应用场景
1. 员工正在工作，3秒钟后收到老板通知要出差，立马放下手头的工作准备出发:
```python
from multiprocessing import Event, Process
import time

def func(e):
    while True:
        print('小王：正在工作~~~')
        e.wait()
        print('小王：收到，马上出发！')
        time.sleep(2)
        print('小王：老板，我回来了，我继续工作了！')
        e.clear()

if __name__ == '__main__':
    e = Event()
    Process(target=func, args=(e,)).start()
    time.sleep(3)
    print('老板：小王收拾行李准备出差！')
    e.set()

# 输出
# 小王：正在工作~~~
# 老板：小王收拾行李准备出差！
# 小王：收到，马上出发！
# 小王：老板，我回来了，我继续工作了！
# 小王：正在工作~~~

```

2. 红绿灯模型:
```python
from multiprocessing import Event, Process
import time

def light(e):
    while True:
        if e.is_set():
            e.clear()
            print('红灯亮了~~~')
        else:
            e.set()
            print('绿灯亮了~~~')
        time.sleep(1)

def car(e):
    if not e.is_set():
        print('咦，红灯亮了，等等再走吧！')
        e.wait()
    print('绿灯亮了，走！')

if __name__ == '__main__':
    e = Event()
    Process(target=light, args=(e, )).start()
    for i in range(10):
        time.sleep(1)
        Process(target=car, args=(e,)).start()
        
# 输出
# 绿灯亮了~~~
# 红灯亮了~~~
# 咦，红灯亮了，等等再走吧！
# 绿灯亮了~~~
# 绿灯亮了，走！
# 绿灯亮了，走！
# 红灯亮了~~~
# 咦，红灯亮了，等等再走吧！
# 绿灯亮了~~~
# 绿灯亮了，走！
# 绿灯亮了，走！
# 红灯亮了~~~
# 咦，红灯亮了，等等再走吧！
# 绿灯亮了~~~
# 绿灯亮了，走！
# 绿灯亮了，走！
# 红灯亮了~~~
# 咦，红灯亮了，等等再走吧！
```