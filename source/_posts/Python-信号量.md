---
title: Python-信号量
date: 2018-12-26 09:44:07
tags: 
    - 信号量
    - Semaphore
    - 进程
categories:
    - Python
---
#### 实际场景
卫生间两个池，同一时间最多只能由有两个人使用，用代码实现：
```python
from multiprocessing import Process
import time
import random

def func(i):
    print('第%s个人上个大号~~~' % i)
    time.sleep(random.randint(1, 5))
    print('第%s个人上完大号啦~~~' % i)

if __name__ == '__main__':
    for i in range(5):
        p = Process(target=func, args=(i, ))
        p.start()
# 输出
# 第0个人上个大号~~~
# 第2个人上个大号~~~
# 第1个人上个大号~~~
# 第3个人上个大号~~~
# 第4个人上个大号~~~
# 第2个人上完大号啦~~~
# 第0个人上完大号啦~~~
# 第3个人上完大号啦~~~
# 第4个人上完大号啦~~~
# 第1个人上完大号啦~~~

# Process finished with exit code 0
```
从输出的结果可以看出，5个人同时进入厕所啦！但是实际只有两个池子，这显然是不对的。
如果我们用进程锁的方式可以避免这一现象，但是同一时间只能有一个人进入厕所，而厕所可以容纳两个人，另一个池子就被闲置着浪费掉了。
如果我们在厕所门上挂多把钥匙，同一时间可以由多个人进入呢？这里就引出信号量的概念。

#### 信号量
```python
from multiprocessing import Process, Semaphore
import time
import random

def func(i, sem):
    sem.acquire()
    print('第%s个人上个大号~~~' % i)
    time.sleep(random.randint(1, 5))
    print('第%s个人上完大号啦~~~' % i)
    sem.release()


if __name__ == '__main__':
    sem = Semaphore(2)
    for i in range(5):
        p = Process(target=func, args=(i, sem))
        p.start()

# 输出
# 第0个人上个大号~~~
# 第1个人上个大号~~~
# 第0个人上完大号啦~~~
# 第2个人上个大号~~~
# 第1个人上完大号啦~~~
# 第3个人上个大号~~~
# 第2个人上完大号啦~~~
# 第4个人上个大号~~~
# 第4个人上完大号啦~~~
# 第3个人上完大号啦~~~

# Process finished with exit code 0
```
`Semaphore`对象和`Lock`的使用方法类似，都是通过`acquire()`拿到钥匙，通过`release()`归还钥匙，区别在于`Semphore`可以有多把钥匙，同一时间可以由多个进程访问。