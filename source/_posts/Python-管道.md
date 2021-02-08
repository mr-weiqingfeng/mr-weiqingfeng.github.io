---
title: Python-管道
date: 2018-12-27 10:28:06
tags:
    - 管道
    - 进程
categories:
    - Python
---
#### 初识管道
```python
from multiprocessing import Pipe

conn1, conn2 = Pipe()
conn1.send('123456')

print(conn2.recv())

# 输出
# 123456

# Process finished with exit code 0
```
管道：双向通信，Pipe()返回一根管道的两端，可以进行通信，即使在两个不同的进程中，仍然可以通信。
```python
from multiprocessing import Pipe, Process

def func(conn):
    conn.send('Hello')
    pass

if __name__ == '__main__':
    conn1, conn2 = Pipe()
    Process(target=func, args=(conn1,)).start()
    print(conn2.recv())

# 输出
# Hello

# Process finished with exit code 0
```
如果想让管道双方不停发送数据，要注意可能在一方发送数据完成之后另一方仍在等待接受，阻塞在`recv()`方法的问题。比如：
```python
from multiprocessing import Pipe, Process

def func(conn):
    while True:
        print(conn.recv())
if __name__ == '__main__':
    conn1, conn2 = Pipe()
    Process(target=func, args=(conn2, )).start()
    for i in range(5):
        conn1.send('Hello %s' % i)

# 输出
# Hello 0
# Hello 1
# Hello 2
# Hello 3
# Hello 4

```
可以在一方数据发送完成之后再发送一个`None`值判断是否退出循环接收数据，来解决这个问题：
```python
from multiprocessing import Pipe, Process

def func(conn):
    while True:
        msg = conn.recv()
        if not msg:
            break
        print(msg)

if __name__ == '__main__':
    conn1, conn2 = Pipe()
    Process(target=func, args=(conn2,)).start()
    for i in range(5):
        conn1.send('Hello %s' % i)
    conn1.send(None)

# 输出
# Hello 0
# Hello 1
# Hello 2
# Hello 3
# Hello 4

# Process finished with exit code 0
```
或者可以通过捕获异常的方式处理。__在管道两端关闭不用的端口，再执行`recv()`方法时才会因为所有进程中输入/输出端口关闭而抛出`EOFError`异常:__
```python
from multiprocessing import Pipe, Process

def func(conn1, conn2):
    conn1.close()
    while True:
        try:
            msg = conn2.recv()
            print(msg)
        except EOFError:
            conn2.close()
            break

if __name__ == '__main__':
    conn1, conn2 = Pipe()
    Process(target=func, args=(conn1, conn2)).start()
    conn2.close()
    for i in range(5):
        conn1.send('Hello %s' % i)
    conn1.close()

# 输出
# Hello 0
# Hello 1
# Hello 2
# Hello 3
# Hello 4

# Process finished with exit code 0

```
