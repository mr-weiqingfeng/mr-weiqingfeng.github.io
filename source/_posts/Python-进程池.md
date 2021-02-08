---
title: Python-进程池
date: 2018-12-27 15:06:56
tags:
    - 进程
    - 进程池
categories:
    - Python
---

#### 基本概念
操作系统一次性创建一个属于进程的池子，这个池子能够容纳指定数量的进程，进程结束之后并不会释放内存，而是归还到池子中，等到进程池的再次调度。跟单纯的进程相比，不用再频繁的依赖操作系统的调度，提高了效率。
```python
from multiprocessing import Pool

def func(index):
    print('hello %s' % index)

if __name__ == '__main__':
    pool = Pool(5)
    pool.map(func, range(100))
    pool.apply()

# 输出
# hello 0
# hello 1
# hello 2
# ...
# hello 99

# Process finished with exit code 0

```
`pool.map()`默认异步的执行任务，且自带`close`和`join`效果。
#### apply()和apply_async()方法
`appky()`方法用于同步提交任务，`apply_async()`方法用于异步提交任务。
```python
from multiprocessing import Pool
import time

def func(index):
    time.sleep(1)
    print('hello %s' % index)
    return index

if __name__ == '__main__':
    pool = Pool(5)
    for i in range(5):
        result = pool.apply(func, args=(i, ))
        print(result)

# 输出
# hello 0
# 0
# hello 1
# 1
# hello 2
# 2
# hello 3
# 3
# hello 4
# 4

# Process finished with exit code 0
```
从结果可以看出，`func()`方法按照提交的顺序输出结果，说明`apply()`方法是同步的。`func()`函数的返回值就是`apply()`的返回值。

```python
from multiprocessing import Pool
import time

def func(index):
    time.sleep(1)
    print('hello %s' % index)

if __name__ == '__main__':
    pool = Pool(5)
    for i in range(5):
        pool.apply_async(func, args=(i, ))
    pool.close()
    pool.join()

# 输出  
# hello 0
# hello 3
# hello 2
# hello 4
# hello 1

# Process finished with exit code 0
```
而这里使用`apply_async()`方法，在控制台可以看出1秒之后，5个结果同时输出，说明执行是异步的。代码中`pool.close()`方法表示进程池停止接收任务，`pool.join()`方法感知进程池中任务执行结束。
`apply_async()`异步调用，和主进程完全异步，需要手动`close`和`join`。
代码中开启了5个进程，就算任务数是100、200...个远远多于开启的进程数，系统也只会同时执行5个进程，可以打印出进程id，发现永远是5个不变的进程id在循环执行。
如果我们从`apply_async()`方法中获取返回值会发生什么现象呢：
```python
from multiprocessing import Pool
import time

def func(index):
    time.sleep(1)
    print('hello %s' % index)
    return index

if __name__ == '__main__':
    pool = Pool(5)
    for i in range(5):
        result = pool.apply_async(func, args=(i, ))
        print(result.get())
    pool.close()
    pool.join()
    
# 输出hello 0
# 0
# hello 1
# 1
# hello 2
# 2
# hello 3
# 3
# hello 4
# 4

# Process finished with exit code 0
```
可以看出，异步任务变成了同步，这是因为代码会在`result.get()`方法阻塞，等待函数`func()`的返回值，在拿到返回值之后才提交下一个任务。
改进：
```python
from multiprocessing import Pool
import time

def func(index):
    time.sleep(1)
    print('hello %s' % index)
    return index

if __name__ == '__main__':
    pool = Pool(5)
    res_lst = []
    for i in range(5):
        result = pool.apply_async(func, args=(i, ))
        res_lst.append(result)
    pool.close()
    pool.join()
    [print(res.get()) for res in res_lst]

# 输出
# hello 1
# hello 2
# hello 0
# hello 3
# hello 4
# 0
# 1
# 2
# 3
# 4

# Process finished with exit code 0
```
使用`map()`函数实现同样的效果：
```python
from multiprocessing import Pool
import time

def func(index):
    time.sleep(1)
    print('hello %s' % index)
    return index

if __name__ == '__main__':
    pool = Pool(5)
    print(pool.map(func, range(5)))

# 输出hello 2
# hello 0
# hello 3
# hello 4
# hello 1
# [0, 1, 2, 3, 4]

# Process finished with exit code 0
```
#### 回调函数
```python
from multiprocessing import Pool
import time
import os

def func(index):
    time.sleep(1)
    print('hello %s' % index)
    print('func id:%s' % os.getpid())
    return index

def callback(res):
    print('处理%s' % res)
    print('callback id:%s' % os.getpid())

if __name__ == '__main__':
    print('main id:%s' % os.getpid())
    pool = Pool(5)
    pool.apply_async(func, args=(1,), callback=callback)
    pool.close()
    pool.join()


# 输出
# main id:12288
# hello 1
# func id:12289
# 处理1
# callback id:12288

# Process finished with exit code 0
```
回调函数`callback()`接收`func()`函数的返回值作为自己的参数。从打印的进程id可以看出，`callback()`函数是在主进程执行的。