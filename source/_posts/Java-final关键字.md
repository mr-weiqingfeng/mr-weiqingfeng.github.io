---
title: Java-final关键字
date: 2019-02-25 10:21:05
tags:
    - final关键字
categories:
    - Java
---
#### final关键字
    程序中可能使用到final的三种情况：数据、方法、类
##### final数据
有时，数据的恒定不变是很有用的，比如：
1. 一个永不改变的编译时常量
2. 一个在运行时被初始化的值，而你不希望它被改变

在Java中，这类常量必须是基本数据类型，并且以关键字`final`表示。在对这个常量进行定义的时候，必须对其进行赋值。

一个既是`static`又是`final`的域只占据一段不能改变的存储空间。

**对于基本数据类型，`final`使数值恒定不变；而对于对象引用，`final`使引用恒定不变。一旦引用被初始化指向一个对象，就无法再把它改为指向另一个对象。然而，对象其自身却是可以被修改的。**
##### 空白final
Java允许生成“空白final”,所谓空白final是指声明为`final`但又未给定初值的域。无论什么情况，编译器都确保空白final在使用前必须被初始化。
```
public class Test extends Object{
    public static void main(String[] args) {
        Person p = new Person(1);
        System.out.println(p.getAge());
    }
}
class Person{
    private final int age;

    public Person(int age) {
        this.age = age;
    }

    public int getAge() {
        return age;
    }
}
```
##### final参数
Java允许在参数列表中以声明的方式将参数指为`final`。**这意味这你无法在方法中更改参数引用所指向的对象**。
##### final方法
使用`final`方法的原因有两个。第一个原因是把方法锁住，以防任何继承类修改它的含义。这是出于设计的考虑：想要确保在继承中使方法行为保持不变，并且不会被覆盖。
第一个原因是效率。
##### final和private关键字
类中所有的`private`方法都隐式的指定为`final`。由于无法取用`private`方法，所以也就无法覆盖它。可以对`private`方法添加`final`修饰词，但这并不能给该方法增加任何额外的意义。
##### final类
当将某个类的整体定义为`final`时，就表明了你不打算继承该类，而且也不允许别人这样做。换句话说，你并不希望它有子类。
