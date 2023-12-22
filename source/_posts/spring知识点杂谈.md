---
title: spring知识点杂谈
date: 2023-12-22 16:01:54
tags:
    - Java
    - Spring
---

### FactoryBean

FactoryBean是一个特殊的Bean，用于创建其他Bean实例。FactoryBean接口允许你自定义Bean的创建逻辑，*可*以在需要时延迟实例化、提供复杂的创建过程或根据条件创建不同的实例

```java
public class MyFactoryBean implements FactoryBean<MyBean> {

    @Override
    public MyBean getObject() throws Exception {
        // 在这里定义创建MyBean实例的逻辑
        return new MyBean();
    }

    @Override
    public Class<?> getObjectType() {
        return MyBean.class;
    }

    @Override
    public boolean isSingleton() {
        return true; // 或者根据需求返回true或false，表示单例或原型
    }

}
```

在Spring配置文件中，将FactoryBean定义为Bean并使用它创建其他Bean实例

```xml
<bean id="myFactoryBean" class="com.example.MyFactoryBean"/>
<bean id="myBean" factory-bean="myFactoryBean" factory-method="getObject"/>
```
通过使用FactoryBean，你可以自定义Bean的创建逻辑，并将其集成到Spring容器中。这使得你能够更灵活地控制Bean的创建过程，并根据需要进行延迟实例化、提供条件化的实例化逻辑等
### @Repository、@Service、@Controller、@Bean有什么区别
@Repository、@Service、@Controller和@Bean是Spring框架中用于注解类的注解，它们有不同的作用和用途。

@Repository注解：

用于标记数据访问层（DAO）组件，表示该类是一个持久化层的组件。
通常与数据库交互相关的类使用该注解，用于封装数据访问的操作。
具有异常转译的功能，将底层的数据访问异常转换为Spring的统一数据访问异常体系。

@Service注解：

用于标记业务逻辑层（Service）组件，表示该类是一个服务层的组件。
通常用于封装业务逻辑，处理业务操作和业务规则。
通常在Service类中会使用@Autowired注解来自动注入所需的DAO或其他依赖。
@Controller注解：

用于标记表现层（Controller）组件，表示该类是一个控制器层的组件。
通常用于接收请求、处理请求和返回响应的控制器类。
可以使用@RequestMapping等注解来映射URL和处理请求。

@Bean注解：

用于标记方法，表示该方法将返回一个由Spring容器管理的Bean实例。
通常用于配置类中的方法，将返回的对象注册为一个Bean，并添加到Spring容器中。
与其他注解不同，@Bean注解用于方法级别而非类级别。

总结：
1. @Repository、@Service、@Controller是在Spring中为不同层次的组件提供特定功能和角色的注解。
2. @Repository用于数据访问层（DAO）组件。
3. @Service用于业务逻辑层（Service）组件。
4. @Controller用于表现层（Controller）组件。
5. @Bean用于将一个方法返回的对象注册为Bean，适用于配置类中。

需要注意的是，@Repository、@Service和@Controller都是对@Component注解的特殊化。@Component注解可以用于通用的组件注解，而@Repository、@Service和@Controller提供了更明确的语义，以便更好地描述类的角色和职责。

### 注解实现的自动装配
1. 创建一个Java类作为配置类，使用@Configuration注解标记该类为配置类。
    ```java
    @Configuration
    @ComponentScan(basePackages = "com.example")
    public class AppConfig {
        // 配置其他Bean或组件
    }
    ```
2. 其他类中使用@Component、@Service、@Repository等注解标记组件。
   2.1 创建DAO接口和实现类：
    ```java
    public interface UserDao {
        void saveUser(User user);
    }
    
    @Repository
    public class UserDaoImpl implements UserDao {
        public void saveUser(User user) {
            // 实现保存用户的逻辑
        }
    }
    ```
   2.2 创建Service接口和实现类：
    ```java
    public interface UserService {
    void saveUser(User user);
    }
    
    @Service
    public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;
    
        public void saveUser(User user) {
            // 调用DAO来保存用户
            userDao.saveUser(user);
        }
    }
    ```
   2.3 创建Controller类
    ```java
    @Controller
    public class UserController {
    @Autowired
    private UserService userService;
    
        @RequestMapping("/user")
        public String saveUser() {
            // 创建用户对象
            User user = new User();
            // 设置用户属性
    
            // 调用Service来保存用户
            userService.saveUser(user);
    
            // 返回视图
            return "user";
        }
    }
    ```
3. 测试代码
    ```java
    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(MyApplication.class);
        UserController userController = applicationContext.getBean(UserController.class);
        userController.saveUser();
    }
    ```
### xml实现的自动装配
1. 创建xml配置文件，并注册bean，一定要注意的是，xml需要依赖set方法实现！！！
   ```xml
    <bean class="com.wei.spring.controller.UserController" id="userController" autowire="byType"/>
    <bean class="com.wei.spring.service.UserServiceImpl" id="userService" autowire="byType"/>
    <bean class="com.wei.spring.dao.UserDaoImpl" id="userDao"/>
   ```



