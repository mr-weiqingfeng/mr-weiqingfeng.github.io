---
title: Python-进程锁
date: 2018-12-25 17:17:59
tags:
    - 进程
categories:
    - Python
---
#### 应用场景
假设现在余票系统中只有一张票，有10人同时抢票，在没有任何防护措施的情况下，可能会出现意想不到的结果
__ticket.json__
```
{count:1}
```
__主程序__
```python
from multiprocessing import Process
import time
import json

def buy(index):
    with open('ticket.json') as f:
        ticket = json.load(f)
        time.sleep(0.1)
    if ticket['count'] > 0:
        ticket['count'] -= 1
        print('第%s位买到票了' % index)
    else:
        print('第%s位没有买到票了' % index)
    with open('ticket.json', 'w') as f:
        json.dump(ticket, f)


if __name__ == '__main__':
    for i in range(10):
        Process(target=buy, args=(i, )).start()

# 输出
# 第0位买到票了
# 第1位买到票了
# 第3位买到票了
# 第2位买到票了
# 第4位买到票了
# 第5位买到票了
# 第6位买到票了
# 第7位买到票了
# 第8位买到票了
# 第9位买到票了

# Process finished with exit code 0
```
本来只有一张票的，结果10位用户都买到票了，这显然是不符合实际的，这是因为多进程同时操作文件的时候，可能都读到余票为1，然后执行了买票的操作。
#### 解决方案：加锁
对一个文件来说，我们不能同时让多个进程访问，想象一下，每个文件都有一把钥匙，当一个进程来访问的时候必须手持钥匙才允许访问，其他的进程则只能等待，访问完之后把钥匙归还，下一个进程才能拿到钥匙再次访问。
```python
from multiprocessing import Process
import time
import json
from multiprocessing import Lock

def buy(index, lock):
    lock.acquire()
    with open('ticket.json') as f:
        ticket = json.load(f)
        time.sleep(0.1)
    if ticket['count'] > 0:
        ticket['count'] -= 1
        print('第%s位买到票了' % index)
    else:
        print('第%s位没有买到票了' % index)
    with open('ticket.json', 'w') as f:
        json.dump(ticket, f)
    lock.release()

if __name__ == '__main__':
    lock = Lock()
    for i in range(10):
        Process(target=buy, args=(i, lock)).start()
```
第一个进程拿到进程锁之后，后面的进程会阻塞在`lock.require()`方法，直到上一个进程释放进程锁之后，后面的进程才能拿到进程锁继续后面的操作。换句话说，`lock.require()`和`lock.release()`之间的代码同一时间只能由一个进程执行。
