---
title: Kotlin笔记
tags:
  - Kotlin
categories:
  - Kotlin
date: 2024-01-25 15:49:32
---


### 伴随对象

在Kotlin中，伴随对象是一个在类内部定义的对象，它与类的实例无关，但可以访问类的私有成员。伴随对象的主要作用是充当所在类的静态成员，类似于Java中的静态成员。<br>
以下是伴随对象的一些主要特点和使用场景：

* **静态成员**：伴随对象中的成员可以被直接通过类名访问，而不需要创建类的实例。这使得伴随对象成为存储静态成员的地方。
  ```kotlin
  class MyClass {
      companion object {
          val staticVariable = 42
          fun staticFunction() {
  
          }
      }
  }
  
  // 访问静态成员
  val value = MyClass.staticVariable
  MyClass.staticFunction()
  ```
* **工厂方法**: 伴随对象可以包含工厂方法，用于创建类的实例。这样可以隐藏实例化的细节，并提供更灵活的对象创建方式。
  ```kotlin
  class MyClass private constructor(val value: Int) {
      companion object {
          fun create(value: Int): MyClass {
              // 进行一些初始化操作
              return MyClass(value)
          }
      }
  }
  
  // 使用工厂方法创建实例
  val instance = MyClass.create(10)
  ```
* **实现接口**: 伴随对象可以实现接口，从而为其所在类提供额外的功能。
  ```kotlin
  interface MyInterface {
      fun myFunction()
  }
  
  class MyClass {
      companion object: MyInterface {
          override fun myFunction() {
              println("muFunction")
          }
      }
  }
  
  // 调用接口方法
  MyClass.myFunction()
  ```
* **扩展函数**: 伴随对象中的扩展函数可以为其所在类添加额外的功能，而无需修改类本身的代码。
  ```kotlin
  class MyClass {
    companion object {
        // 扩展函数
        fun String.myExtensionFunction() {
            // do something
        }
    }
  }
  
  // 使用扩展函数
  "Hello".myExtensionFunction()
  ```

### 密封类

密封类（Sealed Class）是一种特殊类型的类，用于表示受限的类继承结构。密封类的所有子类必须在同一个文件中声明，并且通常用于表示一组相关的子类型。
以下是密封类的一些特点：

1. **继承：** 密封类可以有子类，但这些子类必须声明在密封类的同一个文件中。
2. **有限集合：** 密封类的子类是有限的，这意味着你不能在其他文件中随意添加新的子类。
3. **封闭性：** 密封类本身是抽象的，不能直接实例化。只能创建密封类的子类的实例。
    ```kotlin
    sealed class Result {
        data class Success(val data: String) : Result()
        data class Error(val message: String) : Result()
        object Loading : Result()
    }
    
    
    fun processResult(result: Result) {
        when (result) {
            is Result.Success -> {
                println("Success: ${result.data}")
            }
    
            is Result.Error -> {
                println("Success: ${result.message}")
            }
    
            else -> {
                println("loading")
            }
        }
    }
    
    fun main() {
        // 创建 Success 实例
        val success = Result.Success("Some data")
        // 创建 Error 实例
        val errorResult = Result.Error("An error occurred")
    
        processResult(success)
    }
    ```

### 属性

在 Kotlin 中，可以使用自定义的 get 和 set 方法来重写类的属性的访问器。这允许你在属性读取或写入时添加一些自定义逻辑。

```kotlin
class Person() {
    var age: Int = 0
        set(value) {
            if (value < 0) {
                field = 0
            } else if (value > 100) {
                field = 100
            } else {
                field = value
            }
        }
        get() = field
}
```

注意，在`set`和`get`方法中，不要直接访问属性，以免形成无限递归。

* `field` 是一个特殊的标识符，用于引用属性自身。
* 在 `get` 方法中，我们返回 `field`，以确保保持属性的原始值。
* 在 `set` 方法中，我们可以使用 `field = value` 来设置属性的值。

### 备用属性

可以理解为通过一个公有属性读写私有属性的操作

```kotlin
class MyClass {
    private var _myProperty: String = ""
    var myProperty: String
        get() {
            println("Getting the value of myProperty")
            return _myProperty
        }
        set(value) {
            if (value.isNotEmpty()) {
                println("Setting the value of myProperty to $value")
                _myProperty = value
            } else {
                println("Value cannot be empty")
            }
        }
}
```

### 编译时常量

编译时常量是在编译时已知且不可改变的值，其值必须是基本数据类型（如整数、浮点数、字符串）或者引用自 String
或基本数据类型的常量。<br>

* const 关键字只能用于基本数据类型和 String 类型的常量。
* 编译时常量只能在顶层（文件顶部）或者在对象声明中定义。不能在类、函数或局部作用域中使用 const。
* 常量的名称通常使用大写字母和下划线，符合常量的命名规范。

```kotlin
const val PI = 3.1415926

class MyClass {
    // TODO: 类实现
}
```

### 延迟初始化属性

在 Kotlin 中，延迟初始化属性是一种用于推迟属性的初始化直到首次访问的机制。通常，属性在创建对象时就需要被初始化，但有时你希望将初始化推迟到实际需要的时候。为此，Kotlin
提供了 lateinit 关键字。

```kotlin
class MyClass {
    lateinit var myLateInitProperty: String
    val age: Int = 0
    fun initializeProperty() {
        myLateInitProperty = "Initialized"
    }

    fun printProperty() {
        if (::myLateInitProperty.isInitialized) {
            println("Property value: $myLateInitProperty")
        } else {
            println("Property is not initialized yet.")
        }
    }
}

fun main() {
    val s = MyClass()
    s.printProperty()
    s.initializeProperty()
    s.printProperty()
}
```

### ::操作符

`::`是 Kotlin 中的引用操作符，用于引用函数、属性或类。它允许你获取对函数、属性或类的引用，而不是调用或创建实例。<br>
具体而言，:: 有两种主要用法：

1. **函数引用：**
    ```kotlin
    fun sayHello() {
        println("Hello, World!")
    }
    
    val functionReference = ::sayHello
    functionReference() // 等同于调用 sayHello()
    ```
2. **属性引用：**
    ```kotlin
    class MyClass {
        var myProperty: String = "Hello, World!"
    }
    
    val propertyReference = MyClass::myProperty
    println(propertyReference.get()) // 输出属性的值，等同于访问 myProperty
    ```

### 代理属性

```kotlin
class MyClass {
    // 延迟初始化： 使用 lazy 函数可以创建延迟初始化的属性，只有在首次访问时才会进行初始化。这在避免不必要的计算或资源消耗上很有用。
    val lazyProperty: String by lazy {
        println("Initialized lazyProperty")
        "Lazy Value"
    }

    // 观察属性变化： 使用 ObservableProperty 或 vetoable 等委托可以实现对属性变化的监听，从而执行一些额外的操作。
    var observedProperty: String by Delegates.observable("Initial Value") { _, old, new ->
        println("Property changed from $old to $new")
    }

    // 属性验证： 使用委托属性可以在属性被设置时执行验证逻辑，确保满足特定条件。
    val validatedProperty: Int by Delegates.vetoable(0) { _, old, new ->
        new > 0
    }

    // 属性缓存： 通过自定义委托可以实现对属性值的缓存，避免重复计算。
    private var cachedValue: String? = null
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        if (cachedValue == null) {
            cachedValue = "Calculate and cache the value"
        }
        return cachedValue!!
    }
}

// 数据库操作： 在使用数据库时，可以使用委托属性来实现对数据库操作的封装，以简化代码并提高可维护性。
class DataBaseDelegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        // 查询数据库并返回结果
        return "Database value"
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        // 更新数据库
        println("Updating database with value: $value")
    }
}

class Example {
    var dataBaseValue: String by DataBaseDelegate()
}
```

### lazy和lateinit

1. **lazy**<br>
   `lazy` 函数是 Kotlin 标准库中提供的一种方式，用于实现属性的延迟初始化。`lazy` 接受一个 lambda 表达式，该 lambda
   表达式中的代码块只有在首次访问属性时才会执行。被 `lazy` 修饰的属性是只读的。
    * `lazy` 属性是只读的，一旦初始化后，其值不能再变更。
    * `lazy` 属性的初始化是线程安全的，确保在多线程环境中仅执行一次初始化。
2. **lateinit**<br>
   `lateinit` 是 Kotlin 中的一个关键字，用于标记属性为延迟初始化。被 `lateinit` 修饰的属性必须是可变的，并且不能是基本数据类型（如
   Int、Double 等）或者是可空类型。`lateinit`
   属性的初始化必须在使用之前完成，否则会抛出 `UninitializedPropertyAccessException` 异常。
    * `lateinit` 属性是可变的，其值可以在初始化后进行修改。
    * `lateinit` 属性的初始化不是线程安全的，需要在单线程环境或者确保线程安全的情况下使用。
   #### 区别总结
    * 只读 vs 可变： `lazy` 属性是只读的，而 `lateinit` 属性是可变的。
    * 线程安全性： `lazy` 属性的初始化是线程安全的，`lateinit` 属性的初始化不是线程安全的。
    * 基本类型： `lazy` 属性可以用于基本数据类型，而 `lateinit` 属性不能用于基本数据类型。

### 扩展

* **扩展函数**<br>
  扩展函数使用 fun 关键字定义，然后通过点符号（.）将其附加到已有的类上。以下是一个简单的扩展函数的例子：
    ```kotlin
    fun String.addExclamationMark(): String {
        return "$this!"
    }
    
    fun main() {
        val message = "Hello"
        val newMessage = message.addExclamationMark()
        println(newMessage)  // 输出 "Hello!"
    }
    ```
* **扩展属性**<br>
  除了扩展函数，Kotlin 还支持扩展属性。扩展属性允许你向类添加新的属性。但需要注意的是，由于扩展属性没有实际的字段，因此它们不能有初始化器。
    ```kotlin
    val String.lengthSquared: Int
        get() = length * length
    
    fun main() {
        val message = "Hello"
        val lengthSquared = message.lengthSquared
        println(lengthSquared)  // 输出 25 (5 * 5)
    }
    ```

### 嵌套类和内部类

1. **普通嵌套类：**
    ```kotlin
    class Outer {
        class Nested {
            fun nestedFunction() {
                println("Nested class function")
            }
        }
    }
    
    fun main() {
        val nestedInstance = Outer.Nested()
        nestedInstance.nestedFunction()
    }
    ```
   在这个例子中，Nested 是 Outer 的嵌套类。要创建嵌套类的实例，可以使用外部类的名称作为限定符。
2. **内部类（Inner Class）：**<br>
   内部类是一种特殊的嵌套类，**_它持有对外部类实例的引用_**。在 Kotlin 中，使用关键字 inner 声明内部类。
    ```kotlin
    class Outer {
        inner class Inner {
            fun innerFunction() {
                println("Inner class function")
            }
        }
    }
    
    fun main() {
        val outerInstance = Outer()
        val innerInstance = outerInstance.Inner()
        innerInstance.innerFunction()
    }
    ```
   在这个例子中，`Inner` 是 `Outer` 的内部类，因此它可以访问外部类的成员，并且创建内部类的实例时需要通过外部类的实例。

### 对象表达式和对象声明

1. **对象表达式**
    ```kotlin
    val myObject = object : SomeClass() {
        // 匿名对象的成员和方法
        override fun someMethod() {
            // 实现某个方法
        }
        
        val property: Int = 42
    }
    ```
2. **对象声明**<br>
   在 Kotlin 中，对象声明（Object Declaration）是一种创建单例对象的方式。它使用 `object`
   关键字，可以用来创建一个只有一个实例的类，通常用于表示单例模式或在应用程序中共享的唯一实例。
    ```kotlin
    object MySingleton {
        // 对象声明的成员
        fun someFunction() {
            println("Function in MySingleton")
        }
    
        val property: Int = 42
    }
    ```
   **特性：**
    * **懒加载（Lazy Initialization）**： 对象声明在首次访问时被初始化，这样可以实现懒加载，只有在需要的时候才会创建实例。
    * **线程安全（Thread-Safe）**： 对象声明的初始化是线程安全的，确保只有一个实例被创建。
    * **无法继承：** 对象声明不能被继承，因为它们已经是单例。

### 代理模式

代理模式目的是通过创建一个代理对象来控制对另一个对象的访问。代理对象通常充当客户端和目标对象之间的中介，可以用于实现懒加载、访问控制、缓存、日志记录等功能。<br>
java中实现代理模式是两个类实现同一个接口，其中一个类持有另一个类的引用，从而实现代理。传统的代理模式如下：

```kotlin
interface Image {
    fun display()
}

class RealImage(private val filename: String) : Image {
    init {
        loadFromDisk()
    }

    private fun loadFromDisk() {
        println("Loading image: $filename")
    }

    override fun display() {
        println("Displaying image: $filename")
    }
}

class ProxyImage(private val filename: String) : Image {
    private var realImage: RealImage? = null
    override fun display() {
        if (realImage == null) {
            realImage = RealImage(filename)
        }
        realImage?.display()
    }
}

fun main() {
    val proxyImage = ProxyImage("example.jpg")
    proxyImage.display()
}
```

Kotlin中可以通过委托实现代理，可以选择性地覆写由委托实现的接口成员：

```kotlin
interface Image {
    fun display()
}

class RealImage(private val filename: String) : Image {
    init {
        loadFromDisk()
    }

    private fun loadFromDisk() {
        println("Loading image: $filename")
    }

    override fun display() {
        println("Displaying image: $filename")
    }
}

class ProxyImage(private val realImage: RealImage) : Image by realImage {
    override fun display() {
        println("call display method")
        realImage.display()
    }
}


fun main() {
    val realImage = RealImage("example.jpg")
    val proxyImage = ProxyImage(realImage)
    proxyImage.display()
}
```

### 委托属性

在 Kotlin 中，委托属性（Delegated Properties）是一种属性的实现方式，它允许你将属性的 get 和 set
操作委托给另一个对象。这使得你能够在属性的访问和修改过程中插入自定义的行为，例如懒加载、验证、观察等。<br>
Kotlin 标准库提供了一些常用的委托属性，比如 lazy、observable 等，同时你也可以自定义委托属性。
```kotlin
class CustomDelegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "Custom Delegate"
    }
}

class Example {
    val customProperty: String by CustomDelegate()
}

fun main() {
    val example = Example()
    println(example.customProperty)
}
```
在这个例子中，`CustomDelegate` 类定义了 `getValue` 方法，该方法接收两个参数，`thisRef` 表示委托属性所在的对象，`property` 表示属性的元数据。`getValue` 方法返回属性的值。

`Example` 类中的 `customProperty` 使用了 `CustomDelegate` 的实例作为委托，因此当访问 `customProperty` 时，实际上是调用了 `CustomDelegate` 的 `getValue` 方法。

### operator fun 关键字
`operator fun` 是 Kotlin 中用于定义运算符重载的关键字。在 Kotlin 中，你可以通过定义一系列特定的函数来重载运算符，使得你的自定义类型支持类似于内置类型的运算符语法。
以下是一些常见的运算符及其对应的函数：
* `plus` 对应 `+`
* `minus` 对应 `-`
* `times` 对应 `*`
* `div` 对应 `/`
* `rem` 对应 `%`
* `unaryMinus` 对应一元负号 `-`
* `inc` 对应 `++`
* `dec` 对应 `--`
* `get` 对应 `[]`（用于索引访问）
* `set` 对应 `[]=`（用于索引赋值）
* `invoke` 对应 `()`（用于函数调用）

例如，定义一个自定义类 Point，并重载 plus 运算符:
```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.plus(other: Point): Point {
    return Point(this.x + other.x, this.y + other.y)
}

fun main() {
    val point1 = Point(1, 2)
    val point2 = Point(3, 4)

    val sum = point1 + point2
    println("Sum: $sum")  // 输出 Sum: Point(x=4, y=6)
}
```

### 中缀函数
中缀函数是一种特殊类型的函数，允许你使用更简洁、更自然的语法调用函数。为了声明中缀函数，函数必须满足以下条件：
1. 必须是成员函数或扩展函数。
2. 必须只有一个参数。
3. 参数不能接受可变数量的参数（varargs）。

```kotlin
class Person(val name: String) {
    infix fun says(message: String) {
        println("$name says: $message")
    }
}

fun main() {
    val jack = Person("jack")
    jack says "fuck you"
    jack.says("fuck it")
}
```
