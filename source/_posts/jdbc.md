---
title: jdbc
date: 2023-12-22 16:27:01
tags:
  - jdbc
categories:
  - Java
---

1.获取自增长的主键，再获取`PreparedStatement`时候带上参数就可以了

```
Connection connection = getDBConnection();
PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
```
2.批量插入数据，preparedStatement

```

// 数据库连接时候设置允许批量插入: rewriteBattchedStatements=true
Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/db_name?rewriteBatchedStatements=true", "username", "password");

// 创建PreparedStatement对象，注意sql语句后面不能加分号
String sql = "INSERT INTO table_name (column1, column2) VALUES (?, ?)";
PreparedStatement statement = connection.prepareStatement(sql);

// 启用批量处理模式
statement.setString(1, "value1"); // 设置第一个占位符的值
statement.setString(2, "value2"); // 设置第二个占位符的值
statement.addBatch(); // 添加第一行数据

statement.setString(1, "value3");
statement.setString(2, "value4");
statement.addBatch(); // 添加第二行数据

// 执行批量处理
int[] result = statement.executeBatch();
```
3.数据库事务可以通俗地理解为一组数据库操作的执行单元，它们要么全部成功地执行，要么全部回滚（即撤销）到最初的状态。事务的目的是确保数据库中的数据始终处于一致的状态。
```
import java.sql.*;

public class BankTransactionExample {
    public static void main(String[] args) {
        Connection conn = null;
        try {
            // 建立数据库连接
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bank", "username", "password");

            // 将自动提交设置为 false
            conn.setAutoCommit(false);

            // 执行转账操作
            transferFunds(conn, "account1", "account2", 100);

            // 提交事务
            conn.commit();

            System.out.println("转账成功！");
        } catch (SQLException e) {
            // 发生异常时回滚事务
            try {
                if (conn != null) {
                    conn.rollback();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            System.out.println("转账失败，发生异常：" + e.getMessage());
        } finally {
            // 关闭数据库连接
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private static void transferFunds(Connection conn, String fromAccount, String toAccount, double amount) throws SQLException {
        // 执行扣款操作
        updateAccountBalance(conn, fromAccount, -amount);

        // 执行存款操作
        updateAccountBalance(conn, toAccount, amount);
    }

    private static void updateAccountBalance(Connection conn, String account, double amount) throws SQLException {
        PreparedStatement pstmt = null;
        try {
            // 执行更新操作
            pstmt = conn.prepareStatement("UPDATE accounts SET balance = balance + ? WHERE account_number = ?");
            pstmt.setDouble(1, amount);
            pstmt.setString(2, account);
            pstmt.executeUpdate();
        } finally {
            // 关闭 PreparedStatement
            if (pstmt != null) {
                pstmt.close();
            }
        }
    }
}
```
4.`Druid`工具类封装，用本地线程变量保存`Connection`对象，可以保证统一线程获取的是同一个链接，也可以省略释放链接时传递值
```
import com.alibaba.druid.pool.DruidDataSourceFactory;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

public class com.wei.jdbc.DBUtils {

    private static DataSource dataSource;
    private static ThreadLocal<Connection> connectionThreadLocal = new ThreadLocal<>();

    static {
        InputStream resourceAsStream = com.wei.jdbc.DBUtils.class.getClassLoader().getResourceAsStream("jdbc.properties");
        Properties properties = new Properties();
        try {
            properties.load(resourceAsStream);
            dataSource = DruidDataSourceFactory.createDataSource(properties);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        Connection connection = connectionThreadLocal.get();
        if (connection == null || connection.isClosed()) {
            connection = dataSource.getConnection();
            connectionThreadLocal.set(connection);
        }
        return connection;
    }

    public static void releaseConnection() throws SQLException {
        Connection connection = connectionThreadLocal.get();
        if(connection!=null) {
            connectionThreadLocal.remove();
            connection.setAutoCommit(true);
            connection.close();
        }
    }

    public static void main(String[] args) {
        try {
            System.out.println(getConnection());
            System.out.println(getConnection());
            releaseConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```
