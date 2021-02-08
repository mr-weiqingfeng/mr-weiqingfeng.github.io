---
title: Python-守护进程
date: 2018-12-25 16:00:18
tags:
    - 进程
categories:
    - Python
---
#### 没有使用守护进程的例子
```python
from multiprocessing import Process
import time

def func():
    while True:
        time.sleep(0.5)
        print('still alive')

if __name__ == '__main__':
    Process(target=func).start()
    time.sleep(2)
    print('main process')
    
# 输出
# still alive
# still alive
# still alive
# main process
# still alive
# still alive
# still alive
# ...
```
从上面的例子可以看出，当主进程结束的时候，子进程仍然在运行
#### 守护进程
```python
from multiprocessing import Process
import time

def func():
    while True:
        time.sleep(0.5)
        print('still alive')

if __name__ == '__main__':
    p = Process(target=func)
    p.daemon = True
    p.start()
    time.sleep(2)
    print('main process')
# 输出
# still alive
# still alive
# still alive
# main process

# Process finished with exit code 0
```
可以看出，子进程设置成守护进程后，会随着主进程代码的执行完毕而结束
#### 结束一个进程、判断进程是否存活
```python
from multiprocessing import Process
import time

def func():
    while True:
        time.sleep(2)
        print('still alive')

if __name__ == '__main__':
    p = Process(target=func)
    p.start()
    print(p.is_alive())
    p.terminate()
    time.sleep(1)
    print(p.is_alive())
    
# 输入
# True
# False

# Process finished with exit code 0
```
子进程运行2秒，在开启子进程之后立刻执行 `p.terminate()` 关闭这个子进程，`p.is_alive()`返回一个布尔值，用于判断子进程是否存活。
__注意，调用`terminate()`之后立刻调用`is_alive()`，会得到一个"错误"的结果 `True` ,这是因为`terminate()`会向系统请求关闭一个子进程，立刻调用`is_alive()`系统还没"反应过来"__

---
#### 总结：进程常用属性和方法
__方法__

方法名 | 说明
:-: | :-:
start() | 开启一个子进程
join() | 感知一个子进程的结束
terminate() | 结束一个子进程
is_alive() | 查看某个子进程是否还在运行

__属性__

属性 | 说明
:-: | :-:
name | 进程名
pid | 进程id
daemon | 值为True的时候表示这是一个守护进程，守护进程会随着主进程的结束而结束，一定要在start()方法之前设置