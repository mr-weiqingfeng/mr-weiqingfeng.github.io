---
title: Java-深复制和浅复制
date: 2019-02-21 14:50:32
tags:
    - Java
---
在Java中，我们可以通过继承`Cloneable`接口，实现`clone()`方法来实现对自定义类的复制。
#### 浅复制
当类中只有基本数据类型时，只需要继承`Cloneable`接口，不用重写`clone()`方法即可实现对象的复制：
``` 
public class Child implements Cloneable {
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

public class Test {
    public static void main(String[] args) throws CloneNotSupportedException {
        Child child = new Child();
        Child clone = (Child) child.clone();
        System.out.println(child);
        System.out.println(clone);
    }
}

# 输入
Child@4554617c
Child@74a14482

Process finished with exit code 0
```
上面的代码中，`clone`是由`child`复制得到的，打印`child`和`clone`，从输出结果可以看出，`child`和`clone`的十六进制哈希码并不相同，说明它们是两个不同的对象。
当类中有引用数据类型时，会出现什么情况呢？
```
public class Toy implements Cloneable{
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

public class Child implements Cloneable {
    private Toy toy;

    public Toy getToy() {
        return toy;
    }

    public void setToy(Toy toy) {
        this.toy = toy;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

public class Test extends Object{
    public static void main(String[] args) throws CloneNotSupportedException {
        Child child = new Child();
        child.setToy(new Toy());
        Child clone = (Child) child.clone();
        System.out.println(child);
        System.out.println(clone);

        System.out.println(child.getToy());
        System.out.println(clone.getToy());
    }
}

Child@4554617c
Child@74a14482
Toy@1540e19d
Toy@1540e19d

Process finished with exit code 0
```
`Child.class`中有一个引用数据类型的`toy`变量，通过`setToy()`赋值`toy`变量，分别打印`child`和`clone`，`child.getToy()`和`clone.getToy()`，可以看出，`child`和`clone`的哈希码不相同，是两个不同的对象，而`child.getToy()`和`clone.getToy()`的哈希码相同，得到的是同一个对象。
从上面的结果可以看出，在没有重写`clone()`方法的情况下，复制，只是对引用的复制。
#### 深复制
为了解决上面的问题，我们需要重写`clone()`方法，来实现深复制。
```
public class Toy implements Cloneable{
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

public class Child implements Cloneable {
    private Toy toy;

    public Toy getToy() {
        return toy;
    }

    public void setToy(Toy toy) {
        this.toy = toy;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Child newChild = (Child) super.clone();
        newChild.setToy((Toy) this.toy.clone());
        return newChild;
    }
}

public class Test extends Object{
    public static void main(String[] args) throws CloneNotSupportedException {
        Child child = new Child();
        child.setToy(new Toy());
        Child clone = (Child) child.clone();
        System.out.println(child);
        System.out.println(clone);

        System.out.println(child.getToy());
        System.out.println(clone.getToy());
    }
}

Child@4554617c
Child@74a14482
Toy@1540e19d
Toy@677327b6

Process finished with exit code 0
```
在`clone()`方法中，对引用数据类型进行复制，然后再赋值给本类对应的变量，便可以得到一个全新的对象，由打印的结果可以看出，`child`和`clone`是两个互不相干的不同的对象。