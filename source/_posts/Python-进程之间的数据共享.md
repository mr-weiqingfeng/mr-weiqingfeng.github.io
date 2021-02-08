---
title: Python-进程之间的数据共享
date: 2018-12-27 14:45:27
tags:
    - 进程
categories:
    - Python
---
#### Manager的基本用法
```python
from multiprocessing import Process, Manager

def func(arg):
    arg['count'] -= 1

if __name__ == '__main__':
    m = Manager()
    dic = m.dict({'count': 1})
    p = Process(target=func, args=(dic, ))
    p.start()
    p.join()
    print(dic)

# 输出
# {'count': 0}

# Process finished with exit code 0
```
代码中初识化一个`Manager`对象，`Manager`对象可用于进程之间的数据共享，在主进程中创建了一个count的值为1，传入子进程中进行减一的操作，再在主进程中打印dic的值，发现dic中count的值已经变成了0，说明主进程和子进程共享了dic变量的值。
__注意，`Manager`对象不是进程安全的，如果多个进程同时操作一个`Manager`对象，有可能会出现数据竞争的现象：__
```python
from multiprocessing import Process, Manager

def func(arg):
    arg['count'] -= 1

if __name__ == '__main__':
    m = Manager()
    dic = m.dict({'count': 10})
    p_lst = []
    for i in range(10):
        p = Process(target=func, args=(dic, ))
        p.start()
        p_lst.append(p)
    [p.join() for p in p_lst]
    print(dic)

# 输出
# {'count': 2}

# Process finished with exit code 0
```
上面的例子中输出的结果可能是2，也可能是3...，按照我们正常的思维，输出0才是正确的结果，出现这个结果正是由于多个进程同时访问`Manager`对象，可能一个进程操作完之后数据还未写入，另一个进程进行了读取的操作，才导致的数据错误。
解决这个问题，可以用进程锁的方式：
```python
from multiprocessing import Process, Manager, Lock

def func(arg, lock):
    lock.acquire()
    arg['count'] -= 1
    lock.release()

if __name__ == '__main__':
    m = Manager()
    lock = Lock()
    dic = m.dict({'count': 10})
    p_lst = []
    for i in range(10):
        p = Process(target=func, args=(dic, lock))
        p.start()
        p_lst.append(p)
    [p.join() for p in p_lst]
    print(dic)

# 输出
# {'count': 0}

# Process finished with exit code 0
```
这样，便可以避免进程之间的数据竞争问题。