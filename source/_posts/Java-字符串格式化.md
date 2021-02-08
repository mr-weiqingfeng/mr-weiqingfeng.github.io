---
title: Java-字符串格式化
date: 2019-02-26 09:55:24
tags:
    - 字符串
categories:
    - Java
---
#### String.format()的使用
##### 常规类型的格式化
```
public static void main(String[] args) {
        String result = String.format("Fuck %s", "Jack"); // 字符串类型
        System.out.println(result);
        System.out.printf("%c%n", 'A'); // 字符类型
        System.out.printf("%b%n", 3>5); // 布尔类型
        System.out.printf("%d%n", 100/5); // 整数类型(十进制)
        System.out.printf("%x%n", 17); // 整数类型(十六进制)
        System.out.printf("%o%n", 9); // 整数类型(八进制)
        System.out.printf("%f%n", 50*0.85); // 浮点类型
        System.out.printf("%a%n", 50*0.85); // 十六进制浮点类型
        System.out.printf("%e%n", 50*0.85); // 指数类型
        System.out.printf("%g%n", 50*0.85); // 通用浮点类型
        System.out.printf("%d%%%n", 85); // %% 百分比类型
        System.out.printf("%h", 'A'); // 散列码类型
    }

// 输出结果

Fuck Jack
A
false
20
11
11
42.500000
0x1.54p5
4.250000e+01
42.5000
85%
41
Process finished with exit code 0
```
##### 搭配转换符的标志
```
public static void main(String[] args) {
        System.out.printf("%+d%n", 100); // + 为正数或负数添加符号
        System.out.printf("%-5d%s%n", 100, "A"); // -d 左对齐，数字为占据空间
        System.out.printf("%05d%n", 100); // 0d 数字前边补0
        System.out.printf("% 5d%n", 100); // 空格d 数字前边补空格
        System.out.printf("%,d%n", 1000000); // , 数字分组
        System.out.printf("%(d%n", -100); // ( 使用括号包含负数
        System.out.printf("%#x%n", 17); // #x 十六进制
        System.out.printf("%#o%n", 17); // #x 八进制
        System.out.printf("%f和%<1.1f%n", 99.45); // < 格式化前一个转换符所描述的参数(前边的1不知道什么含义，后边的1表示小数点后的位数)
        System.out.printf("%.3f%n", 99.99); // . 格式化字符串
        System.out.printf("%1$d,%2$s", 99,"abc"); // $ 被格式化的参数索引
    }

// 输出结果

+100
100  A
00100
  100
1,000,000
(100)
0x11
021
99.450000和99.5
99.990
99,abc
Process finished with exit code 0
```
##### 日期和事件字符串格式化
```
public static void main(String[] args) {
        Date date = new Date();
        System.out.printf("%tc%n", date); // c 包括全部日期和时间信息
        System.out.printf("%tF%n", date); // F "年-月-日"格式
        System.out.printf("%tD%n", date); // D "月/日/年"格式
        System.out.printf("%tr%n", date); // r "HH:MM:SS PM"格式（12时制）
        System.out.printf("%tT%n", date); // T "HH:MM:SS"格式（24时制）
        System.out.printf("%tR%n", date); // R "HH:MM"格式（24时制）
    }

// 输出结果

星期二 二月 26 10:33:31 CST 2019
2019-02-26
02/26/19
10:33:31 上午
10:33:31
10:33

Process finished with exit code 0
```
定义日期格式的转换符可以使日期通过指定的转换符生成新字符串。
```
public static void main(String[] args) {
        Date date = new Date();
        System.out.printf(Locale.US,"英文月份简称：%tb%n",date);
        System.out.printf("本地月份简称：%tb%n",date);

        System.out.printf(Locale.US,"英文月份全称：%tB%n",date);
        System.out.printf("本地月份全称：%tB%n",date);

        System.out.printf(Locale.US,"英文星期的简称：%ta%n",date);
        System.out.printf("本地星期的简称：%ta%n",date);

        System.out.printf(Locale.US,"英文星期的全称：%tA%n",date);
        System.out.printf("本地星期的全称：%tA%n",date);

        System.out.printf("年的前两位数字（不足两位前面补0）：%tC%n",date);
        System.out.printf("年的前两位数字（不足两位前面补0）：%ty%n",date);

        System.out.printf("一年中的天数（即年的第几天）：%tj%n",date);

        System.out.printf("两位数字的月份（不足两位前面补0）：%tm%n",date);
        System.out.printf("两位数字的日（不足两位前面补0）：%td%n",date);
        System.out.printf("月份的日（前面不补0）：%te%n",date);
    }
    
// 输出结果

英文月份简称：Feb
本地月份简称：二月
英文月份全称：February
本地月份全称：二月
英文星期的简称：Tue
本地星期的简称：星期二
英文星期的全称：Tuesday
本地星期的全称：星期二
年的前两位数字（不足两位前面补0）：20
年的前两位数字（不足两位前面补0）：19
一年中的天数（即年的第几天）：057
两位数字的月份（不足两位前面补0）：02
两位数字的日（不足两位前面补0）：26
月份的日（前面不补0）：26

Process finished with exit code 0
```
和日期格式转换符相比，时间格式的转换符要更多、更精确。它可以将时间格式化成时、分、秒甚至时毫秒等单位。
```
public static void main(String[] args) {
        Date date = new Date();
        System.out.printf("2位数字24时制的小时（不足2位前面补0）：%tH%n", date);
        System.out.printf("2位数字12时制的小时（不足2位前面补0）:%tI%n", date);
        System.out.printf("2位数字24时制的小时（前面不补0）:%tk%n", date);
        System.out.printf("2位数字12时制的小时（前面不补0）:%tl%n", date);

        System.out.printf("2位数字的分钟（不足2位前面补0）:%tM%n", date);

        System.out.printf("2位数字的秒（不足2位前面补0）:%tS%n", date);
        System.out.printf("3位数字的毫秒（不足3位前面补0）:%tL%n", date);
        System.out.printf("9位数字的毫秒数（不足9位前面补0）:%tN%n", date);

        System.out.printf(Locale.US, "小写字母的上午或下午标记(英)：%tp%n", date);
        System.out.printf("小写字母的上午或下午标记（中）：%tp%n", date);
        System.out.printf("相对于GMT的RFC822时区的偏移量:%tz%n", date);
        System.out.printf("时区缩写字符串:%tZ%n", date);
        System.out.printf("1970-1-1 00:00:00 到现在所经过的秒数：%ts%n", date);
        System.out.printf("1970-1-1 00:00:00 到现在所经过的毫秒数：%tQ%n", date);
    }

// 输出结果

2位数字24时制的小时（不足2位前面补0）：10
2位数字12时制的小时（不足2位前面补0）:10
2位数字24时制的小时（前面不补0）:10
2位数字12时制的小时（前面不补0）:10
2位数字的分钟（不足2位前面补0）:51
2位数字的秒（不足2位前面补0）:08
3位数字的毫秒（不足3位前面补0）:662
9位数字的毫秒数（不足9位前面补0）:662000000
小写字母的上午或下午标记(英)：am
小写字母的上午或下午标记（中）：上午
相对于GMT的RFC822时区的偏移量:+0800
时区缩写字符串:CST
1970-1-1 00:00:00 到现在所经过的秒数：1551149468
1970-1-1 00:00:00 到现在所经过的毫秒数：1551149468662

Process finished with exit code 0
```