---
title: Python视频格式转化工具
date: 2022-04-22 15:17:38
tags:
    - 视频格式互转
categories:
    - Python
---

#### Python简单脚本，处理视频格式互转，及视频转gif（注：大文件未测试）

```python
# 转mp4格式
python3 ***.py test.avi -o test.mp4

# 转gif格式
python3 ***.py test.avi -g
```

#### 代码
```python
#!/usr/bin/env python3

import re
import argparse
from moviepy.editor import *

parser = argparse.ArgumentParser()
parser.add_argument('i', help='源视频文件路径', type=str)
parser.add_argument('-o', help='输出视频文件路径', type=str, required=False)
parser.add_argument('-g', help='转为gif动图', type=bool, required=False)
args = parser.parse_args()


def action():
    if os.path.exists(args.i) and os.path.isfile(args.i):
        pass
    else:
        print("error input!!!")
        return

    if args.o is None and args.g is None:
        print("error output!!!")
        return

    clip = VideoFileClip(args.i)
    if not args.g:
        output_file_suffix = re.search('.*\\.(.*)$', args.o).group(1)
        codec = 'mpeg4'
        if output_file_suffix == 'ogv':
            codec = 'libtheora'
        elif output_file_suffix == 'webm':
            codec = 'libvpx'
        elif output_file_suffix == 'avi':
            codec = 'png'
        clip.write_videofile(args.o, codec=codec)
    else:
        gif_path = re.sub('(.*\\.)(.*)$', '\g<1>gif', args.i)
        clip.write_gif(gif_path)


action()

```

