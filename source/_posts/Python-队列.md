---
title: Python-队列
date: 2018-12-26 11:05:10
tags: 
    - 队列
    - 进程
categories:
    - Python
---
#### 基础用法
队列`Queue`遵循 __先进先出__ 的原则
```python
from multiprocessing import Queue

q = Queue(2)
q.put(1)
q.put(2)
print(q.full())
q.put(3)

# 输出
# True

```
`Queue`中的参数表示队列大小，代码中q的容量是2，当放入两个值时，q进入阻塞状态，`q.full()`方法判断队列是否已满。
```python
from multiprocessing import Queue

q = Queue(2)
q.put(1)
q.put(2)
print(q.full())
print(q.get())
print(q.get())
q.put(3)
q.put(4)
print(q.full())
q.put(5)

# 输出
# True
# 1
# 2
# True

```
`q.get()`方法从队列中取值，取出一个值后，队列中空出一个位，后面可以继续往里面放值。
```python
from multiprocessing import Queue

q = Queue(2)
q.put(1)
q.get()
print(q.empty())
print(q.get())

# 输出
# True

```
`q.empty()`方法判断队列是否已空，当队列为空的时候，`q.get()`会阻塞在当前位置。
__注意，`q.full()`和`q.empty()`不是进程安全的，结果是不可靠的。假设A进程通过`q.empty()`查询队列是否为空时，返回`True`，恰恰下一瞬间B进程往队列里放了数据，而此时队列中并不为空。__

```python
from multiprocessing import Queue

q = Queue(2)
q.put(1)
q.get()
print(q.empty())
print(q.get_nowait())

# 输出
# True
# Traceback (most recent call last):
#   File "/Users/wei/Desktop/StormFeng.github.io/myblog/test.py", line 7, in <module>
#     print(q.get_nowait())
#   File "/Library/Frameworks/Python.framework/Versions/3.5/lib/python3.5/multiprocessing/queues.py", line 126, in get_nowait
#     return self.get(False)
#   File "/Library/Frameworks/Python.framework/Versions/3.5/lib/python3.5/multiprocessing/queues.py", line 107, in get
#     raise Empty
# queue.Empty

# Process finished with exit code 1
```
调用`q.get_nowait()`不会阻塞进程，但是当队列为空的时候会报异常，可以通过 `try...except...`捕获异常。
#### 应用场景
__生产者消费者模型__
顾客去包子店买包子，要等到老板把包子做出来之后才能买。在代码中，老板把包子放进队列中，顾客通过`q.get()`方法感知包子已经生产出来了
```python
from multiprocessing import Queue, Process
import time

def produce(q):
    for i in range(4):
        time.sleep(1)
        q.put('包子')

def consume(q):
    while True:
        print('哈哈，买到%s了' % q.get())


if __name__ == '__main__':
    q = Queue()
    Process(target=produce, args=(q,)).start()
    Process(target=consume, args=(q,)).start()

# 输出
# 哈哈，买到包子了
# 哈哈，买到包子了
# 哈哈，买到包子了
# 哈哈，买到包子了

```
可以看出，生产者生产了4个包子，消费者通过`q.get()`方法感知到包子生产出来，当生产者生产完之后，消费者阻塞在`q.get()`仍然在等待。
解决上面这个问题，可以用`JoinableQueue`代替`Queue`，`JoinableQueue`比`Queue`多出两个方法`task_done()`、`q.join()`。假设队列有一个计数器，`q.put()`相当于计数器加一，`q.task_done()`相当于计数器减一;`q.join()`方法感知一个队列中的数据全部被执行完毕。
```python
from multiprocessing import JoinableQueue, Process
import time

def produce(q):
    for i in range(4):
        time.sleep(1)
        q.put('包子')
    q.join()


def consume(q):
    while True:
        print('哈哈，买到%s了' % q.get())
        q.task_done()

if __name__ == '__main__':
    q = JoinableQueue()
    p = Process(target=produce, args=(q,))
    c = Process(target=consume, args=(q,))

    p.start()
    c.daemon = True
    c.start()
    p.join()
    
# 输出
# 哈哈，买到包子了
# 哈哈，买到包子了
# 哈哈，买到包子了
# 哈哈，买到包子了

# Process finished with exit code 0
```
c 设置成守护进程，意味着会随着主进程执行完毕自动结束，消费者通过`q.task_done()`方法处理完数据，生产者中的`q.join()`方法不再阻塞，p进程结束，代码执行到`p.join()`，`p.join()`不再阻塞，主进程结束，随着主进程结束，守护进程 c 结束，代码执行完毕。

__总结__
- 生产者每生产一个数据，通过`put()`方法放进队列，`join()`方法表示已经停止生产数据，且要等待生产的数据都处理完毕，当消费者处理完所有的数据，`join()`方法不再阻塞。
- 消费者每消费一个数据，通过`task_done()`方法表示一个数据已经处理完成，当所有的数据处理完，生产者的`join()`方法感知到数据处理完，不再阻塞，进程结束。
- 生产者在主进程中通过`join()`方法感知进程结束，当自己执行完毕，主进程中代码结束。
- 消费者把自己设置成守护进程，当主进程结束，消费者进程会随着结束，代码执行完毕。

