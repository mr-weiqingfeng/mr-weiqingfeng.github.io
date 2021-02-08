---
title: Python-进程误区
date: 2018-12-25 17:57:02
tags:
    - 进程
categories:
    - Python
---
#### 子进程不能用户交互，跟Android中子进程不能进行UI操作有点类似
```python
from multiprocessing import Process

def func():
    print(input())

if __name__ == '__main__':
    Process(target=func).start()

# 输出
# Process Process-1:
# Traceback (most recent call last):
#   File "/Library/Frameworks/Python.framework/Versions/3.5/lib/python3.5/multiprocessing/process.py", line 252, in _bootstrap
#     self.run()
#   File "/Library/Frameworks/Python.framework/Versions/3.5/lib/python3.5/multiprocessing/process.py", line 93, in run
#     self._target(*self._args, **self._kwargs)
#   File "/Users/wei/Desktop/StormFeng.github.io/myblog/test.py", line 8, in func
#     print(input())
# EOFError: EOF when reading a line

# Process finished with exit code 0
```
