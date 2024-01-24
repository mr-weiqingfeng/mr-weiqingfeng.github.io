---
title: mybatis
date: 2023-12-22 16:27:31
tags:
  - mybatis
categories:
  - Java
---

### mybatis-config.xml配置文件
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <properties resource="jdbc.properties"/>

    <!-- 下划线自动映射为驼峰 -->
    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>

    <!-- 设置别名，不区分大小写。这个包下的所有 Java 类在Mapper文件中都可以直接使用类名来引用，无需写全限定名-->
    <typeAliases>
        <package name="com.wei.bean"/>
        <!--        <typeAlias type="com.wei.bean.User"/>-->
    </typeAliases>

    <!-- 数据源配置 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <!-- 使用JDBC数据源 -->
            <dataSource type="POOLED">
                <!-- 配置数据库连接信息 -->
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 映射文件配置 -->
    <mappers>
        <!-- 这里配置Mapper接口的路径 -->
        <!--        <mapper resource="com/wei/mapper/UserMapper.xml"/>-->
        <!-- 如果使用注解方式配置Mapper，可以用package配置路径 -->
        <package name="com.wei.mapper"/>
    </mappers>


</configuration>
```

### 测试程序
```java
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(Resources.getResourceAsStream("mybatis-config.xml"));
SqlSession sqlSession = sqlSessionFactory.openSession();
List<User> objects = sqlSession.selectList("com.wei.mapper.UserMapper.getAllUsers");
System.out.println(objects);
```

### Mybatis获取参数值的各种情况
```java
// 基本类型和包装类：直接通过参数名称获取。
// Java 方法
int getUserId(int userId);

<!-- MyBatis 映射文件 -->
<select id="getUserId" resultType="int">
        SELECT id FROM users WHERE id = #{userId}
</select>

        
// JavaBean 对象：直接通过属性名获取
// Java 方法
User getUser(User user);

<!-- MyBatis 映射文件 -->
<select id="getUser" resultType="User">
        SELECT * FROM users WHERE id = #{id} AND username = #{username}
</select>


// Map：通过键名获取
// Java 方法
User getUser(Map<String, Object> paramMap);

<!-- MyBatis 映射文件 -->
<select id="getUser" resultType="User">
        SELECT * FROM users WHERE id = #{id} AND username = #{username}
</select>


// 多个参数：使用 @Param 注解来指定参数名称，或者使用 param1、param2 等默认的参数名
// Java 方法
User getUserByIdAndName(@Param("id") int id, @Param("username") String username);

<!-- MyBatis 映射文件 -->
<select id="getUserByIdAndName" resultType="User">
        SELECT * FROM users WHERE id = #{id} AND username = #{username}
</select>


// 动态 SQL：在动态 SQL 中可以根据条件获取参数值
// Java 方法
List<User> searchUsers(User user);

<!-- MyBatis 映射文件 -->
<select id="searchUsers" resultType="User">
        SELECT * FROM users
<where>
<if test="id != null">AND id = #{id}</if>
<if test="username != null">AND username = #{username}</if>
</where>
</select>


// 集合类型：对于 List、Set 等集合类型，可以通过索引来获取元素
// Java 方法
List<User> getUsersByIdList(List<Integer> idList);

<!-- MyBatis 映射文件 -->
<select id="getUsersByIdList" resultType="User">
        SELECT * FROM users WHERE id IN
    <foreach collection="list" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

### Mybatis处理模糊查询
在 MyBatis 中处理模糊查询，你可以使用 SQL 的模糊查询通配符 % 和 _，结合 Java 代码来构建查询语句。通配符 % 表示匹配任意字符（包括零个字符），而通配符 _ 表示匹配单个字符
```java
// 在查询参数中添加通配符：在 Java 代码中，将模糊查询的通配符 % 添加到查询参数的前后
// Java 方法
List<User> getUsersByName(String keyword);

<!-- MyBatis 映射文件 -->
<select id="getUsersByName" resultType="User">
        SELECT * FROM users WHERE name LIKE CONCAT('%', #{keyword}, '%')
</select>


// 使用动态 SQL 进行模糊查询：在 MyBatis 的映射文件中，使用动态 SQL 来判断是否添加模糊查询条件
<!-- 使用 <if> 进行动态模糊查询 -->
<select id="getUsersByName" resultType="User">
        SELECT * FROM users
    <where>
        <if test="keyword != null and keyword != ''">
                AND name LIKE CONCAT('%', #{keyword}, '%')
        </if>
    </where>
</select>


// 使用特殊字符转义：如果查询参数中本身包含 % 或 _ 这样的特殊字符，并且不希望它们被视为通配符，可以使用 ESCAPE 子句来指定转义字符
// Java 方法
List<User> getUsersByKeyword(String keyword);

<!-- MyBatis 映射文件 -->
<select id="getUsersByKeyword" resultType="User">
        SELECT * FROM users WHERE name LIKE '%' || #{keyword} || '%' ESCAPE '/'
</select>

```

### Mybatis批量删除
```java
<!-- 使用 <foreach> 实现批量删除 -->
<delete id="deleteUsersByIdList">
  DELETE FROM users WHERE id IN
  <foreach collection="idList" item="id" open="(" separator="," close=")">
    #{id}
  </foreach>
</delete>


// Java 接口
public interface UserMapper {
    void deleteUsersByIdList(List<Integer> idList);
}
```

### Mybatis动态设置表名
```xml
<!-- 使用 ${} 实现动态表名，不能使用#{} -->
<select id="getOrdersFromTable" resultType="Order">
  SELECT * FROM ${tableName}
  WHERE order_id = #{orderId}
</select>

```

### Mybatis获取自增的主键
```xml
<!--在映射文件（mapper.xml）中插入数据，并配置 useGeneratedKeys 和 keyProperty 属性。-->
<insert id="insertUser" parameterType="User" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO users (username, email, password) VALUES (#{username}, #{email}, #{password})
</insert>
```

### Mybatis处理多对一的映射关系：级联属性、association标签、分步查询
```xml
<resultMap id="BaseResultMap" type="com.wei.bean.Employee">
    <id property="employeeId" column="employee_id" jdbcType="INTEGER"/>
    <result property="employeeName" column="employee_name" jdbcType="VARCHAR"/>
    <result property="departmentId" column="department_id" jdbcType="INTEGER"/>
    <!--第一种方式：通过级联属性查询多对一映射关系-->
    <!--        <result property="department.departmentId" column="department_id" jdbcType="INTEGER"/>-->
    <!--        <result property="department.departmentName" column="department_name" jdbcType="VARCHAR"/>-->
    <!--第二种方式：通过association标签-->
    <!--        <association property="department" javaType="department">-->
    <!--            <id property="departmentId" column="department_id" jdbcType="INTEGER"/>-->
    <!--            <result property="departmentName" column="department_name" jdbcType="VARCHAR"/>-->
    <!--        </association>-->
    <!--第三种方式：分步查询-->
    <association property="department" javaType="department" select="com.wei.mapper.DepartmentMapper.selectByPrimaryKey" column="department_id"/>
</resultMap>
```

### 延迟加载
```xml
<!--首先在mybatis-config.xml文件中开启延迟加载-->
<settings>
    <setting name="mapUnderscoreToCamelCase" value="true"/>
    <!--延迟加载是一种加载策略，它在查询主对象时，并不会立即加载关联对象的数据。相反，关联对象的数据只有在第一次访问该关联对象时才会被触发加载-->
    <setting name="lazyLoadingEnabled" value="true"/>
    <!--激进的延迟加载在加载主对象的同时，会立即加载主对象的所有关联对象，以后再访问关联对象时，无需再次触发数据库查询-->
    <setting name="aggressiveLazyLoading" value="false"/>
</settings>

<!--设置全局延迟加载后，分步查询语句默认开启，如果要单独设置关闭的话，可以设置fetchType属性手动控制-->
<association property="department" javaType="department" select="com.wei.mapper.DepartmentMapper.selectByPrimaryKey" column="department_id" fetchType="lazy"/>
```

### Mybatis处理一对多的映射关系
```xml
<!--第一种方式，单条查询语句-->
<resultMap id="BaseResultMap" type="department">
    <id property="departmentId" column="department_id" jdbcType="INTEGER"/>
    <result property="departmentName" column="department_name" jdbcType="VARCHAR"/>
    <collection property="employees" ofType="employee">
        <id property="employeeId" column="employee_id" jdbcType="INTEGER"/>
        <result property="employeeName" column="employee_name" jdbcType="VARCHAR"/>
    </collection>
</resultMap>

<select id="queryAllEmployee" resultMap="BaseResultMap">
    select *
    from t_department
    left join t_employee te on t_department.department_id = te.department_id
    where te.department_id = #{department_id}
</select>

<!--第二种方式，分步查询-->
<resultMap id="BaseResultMap" type="department">
    <id property="departmentId" column="department_id" jdbcType="INTEGER"/>
    <result property="departmentName" column="department_name" jdbcType="VARCHAR"/>
    <collection property="employees" ofType="employee" select="com.wei.mapper.EmployeeMapper.queryEmployeeByDeptId"
                column="department_id"/>
</resultMap>

<select id="queryAllEmployee" resultMap="BaseResultMap">
    select *
    from t_department
    where department_id = #{department_id}
</select> 
```


### Mybatis一级缓存
一级缓存是 MyBatis 默认开启的一种缓存机制。
</br>它是指在同一个 SqlSession 中，对于相同的查询（SQL 语句和参数完全相同），MyBatis 会缓存查询结果，避免重复查询数据库，从而提高查询性能。
```java
// 获取 SqlSession 对象
SqlSession sqlSession = sqlSessionFactory.openSession();

// 第一次查询，结果将会缓存在一级缓存中
Employee employee1 = sqlSession.selectOne("getEmployeeById", 1);

// 第二次查询，将从一级缓存中获取结果，不再访问数据库
Employee employee2 = sqlSession.selectOne("getEmployeeById", 1);

// 关闭 SqlSession，一级缓存将被清空
sqlSession.close();
```
以下情况会失效：
1. 不同的 SqlSession：一级缓存是基于 SqlSession 的，不同的 SqlSession 对象之间无法共享缓存。每个 SqlSession 都有自己的一级缓存，当 SqlSession 关闭时，其对应的一级缓存也会被清空。因此，如果使用了不同的 SqlSession 对象执行相同的查询，缓存将会失效。
2. SqlSession 手动清空缓存：通过 sqlSession.clearCache() 方法可以手动清空一级缓存。在调用此方法后，缓存将被清空，后续查询将重新查询数据库并重新缓存结果。
3. 更新操作：对于增删改的操作，MyBatis 会清空对应表的所有缓存，以保证缓存数据与数据库数据一致。因此，在执行了更新操作后，相关表的缓存将会失效。
4. 不同的命名空间：每个命名空间（Mapper 接口）对应一个单独的缓存区域。不同命名空间的查询结果会分别缓存在各自的缓存区域中，不会相互影响。因此，跨命名空间的查询结果缓存也会失效。
5. 相同的查询条件，但 Mapped Statement 不同：尽管 SQL 语句和查询参数相同，但如果调用的是不同的 Mapped Statement，缓存仍会失效。这是因为每个 Mapped Statement 对象都有自己的缓存区域，它是由 Mapper 接口、方法名、参数类型组成的唯一标识。
6. 缓存刷新时间过期：一级缓存的生命周期与 SqlSession 一致，当 SqlSession 关闭时，缓存会被清空。也可以通过设置缓存刷新时间来控制缓存的过期时间，当缓存过期时，查询将重新查询数据库并更新缓存。

### Mybatis二级缓存
```xml
<!--在核心配置文件中开启二级缓存，默认是开启的-->
<setting name="cacheEnabled" value="true" />
<!--然后在mapper映射文件中使用<cache>元素来配置缓存-->
<!-- employee.xml -->
<mapper namespace="com.example.mapper.EmployeeMapper">
    <cache eviction="LRU" flushInterval="60000" size="100" readOnly="true" />
<!-- 其他映射配置 -->
</mapper>

<!--MyBatis 的一级缓存（本地缓存）是在同一个 SqlSession 中保存数据的，它是在查询执行后将查询结果缓存起来。-->
<!--具体来说，当 SqlSession 执行查询操作并返回结果后，MyBatis 会将查询结果缓存到一级缓存中，-->
<!--以便后续相同的查询可以直接从缓存中获取结果，而不需要再次查询数据库。-->

<!--MyBatis 的二级缓存是在 SqlSession 的提交（commit）或回滚（rollback）时才会进行数据的保存。-->
<!--具体来说，当 SqlSession 执行了写操作（例如插入、更新、删除），并提交事务或回滚事务时，-->
<!--MyBatis 会自动将相关表的二级缓存清空，以保证缓存数据与数据库数据的一致性-->
```

对于 MyBatis 的二级缓存，查询的实体类类型需要满足以下要求:

1. 必须是可序列化的：MyBatis 的二级缓存默认是通过 Java 的序列化机制来实现缓存数据的存储和恢复。因此，实体类必须实现 java.io.Serializable 接口，以便能够正确地进行序列化和反序列化
2. 必须具有默认构造函数：当 MyBatis 从缓存中恢复数据时，会使用默认构造函数来创建实体类的对象。如果实体类没有默认构造函数，MyBatis 就无法正确地创建实体类对象，会导致缓存恢复失败
3. 建议重写 equals 和 hashCode 方法：在进行缓存数据的比较和存储时，MyBatis 会使用实体类的 equals 和 hashCode 方法。如果实体类没有重写这两个方法，可能导致缓存数据的比较和存储不准确

### Mybatis缓存查询的顺序
1. 当执行查询操作时，MyBatis 会先检查二级缓存（Shared Cache）是否存在对应的查询结果。如果在二级缓存中找到了对应的查询结果，MyBatis 将直接从二级缓存中获取数据，避免再次查询数据库，以提高查询性能。
2. 如果二级缓存中没有对应的查询结果，MyBatis 会继续查找一级缓存（本地缓存）。如果在同一个 SqlSession 中执行相同的查询，且一级缓存中有缓存结果，MyBatis 将直接从一级缓存中获取数据，不再进行数据库查询，以提高查询性能。
3. 如果既没有命中二级缓存，也没有命中一级缓存，MyBatis 将执行实际的数据库查询操作，并将查询结果放入一级缓存和二级缓存中，以便下次相同的查询可以命中缓存。


