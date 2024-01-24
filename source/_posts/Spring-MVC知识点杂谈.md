---
title: Spring MVC知识点杂谈
date: 2023-12-22 16:30:58
tags:
  - spring
categories:
  - Java
---

1. 通过使用@PathVariable注解获取占位符参数
    ```java
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        // 根据id从数据库中获取用户信息
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    ```
2. 通过ServletAPI获取请求参数
    ```java
    @GetMapping("/example")
    public ResponseEntity<String> getParameter(HttpServletRequest request) {
        String name = request.getParameter("name");
        // 处理name参数的值
        return ResponseEntity.ok("Name: " + name);
    }
    ```
3. 通过控制器方法形参获取请求参数
    ```java
    @GetMapping("/example")
    public ResponseEntity<String> getParameter(@RequestParam("name") String name) {
        // 处理name参数的值
        return ResponseEntity.ok("Name: " + name);
    }
    ```
4. 使用@CookieValue注解时，可以将指定名称的Cookie值直接映射到方法的形参上，而无需手动解析Cookie数据。同理，@RequestHeader可以处理头信息
    ```java
    @GetMapping("/example")
    public ResponseEntity<String> getCookieValue(@CookieValue("cookieName") String cookieValue) {
        // 处理cookieValue的值
        return ResponseEntity.ok("Cookie Value: " + cookieValue);
    }
    ```
5. 通过实体类型形参获取请求参数，@ModelAttribute注解是可选的，可以省略
    ```java
    @PostMapping("/user")
    public ResponseEntity<String> createUser(@ModelAttribute User user) {
        // 处理从请求参数中获取到的User对象
        String response = "Name: " + user.getName() + ", Age: " + user.getAge();
        return ResponseEntity.ok(response);
    }
    ```
6. 通过CharacterEncodingFilter处理请求参数的乱码问题
    ```xml
    <web-app>
        <!-- 配置 CharacterEncodingFilter -->
        <filter>
            <filter-name>characterEncodingFilter</filter-name>
            <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
            <init-param>
                <param-name>encoding</param-name>
                <param-value>UTF-8</param-value>
            </init-param>
            <init-param>
                <param-name>forceEncoding</param-name>
                <param-value>true</param-value>
            </init-param>
        </filter>
    
        <filter-mapping>
            <filter-name>characterEncodingFilter</filter-name>
            <url-pattern>/*</url-pattern>
        </filter-mapping>
    </web-app>
    ```
7. 通过servletAPI向域对象共享数据
   ```java
   // 向请求域（request）共享数据：
   protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
           // 设置数据到请求域中
           request.setAttribute("dataKey", "This data is shared in the request scope.");
   
           // 转发请求到其他Servlet或JSP页面
           RequestDispatcher dispatcher = request.getRequestDispatcher("/otherServlet");
           dispatcher.forward(request, response);
           }
   
   // 向会话域（session）共享数据：
   protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
           // 获取当前会话对象（如果没有会话，则创建新的会话）
           HttpSession session = request.getSession();
   
           // 设置数据到会话域中
           session.setAttribute("dataKey", "This data is shared in the session scope.");
   
           // 转发请求到其他Servlet或JSP页面
           RequestDispatcher dispatcher = request.getRequestDispatcher("/otherServlet");
           dispatcher.forward(request, response);
           }
   
   // 向应用程序域（application）共享数据：
   protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
           // 获取ServletContext对象
           ServletContext servletContext = request.getServletContext();
   
           // 设置数据到应用程序域中
           servletContext.setAttribute("dataKey", "This data is shared in the application scope.");
   
           // 转发请求到其他Servlet或JSP页面
           RequestDispatcher dispatcher = request.getRequestDispatcher("/otherServlet");
           dispatcher.forward(request, response);
           }
   ```
8. 通过ModelAndView向域对象共享数据
   ```java
   @Controller
   public class MyController {
   
       @GetMapping("/example")
       public ModelAndView example() {
           // 创建ModelAndView对象，并设置视图名称
           ModelAndView modelAndView = new ModelAndView("example-view");
   
           // 向ModelAndView对象中添加数据
           modelAndView.addObject("message", "Hello, World!");
           modelAndView.addObject("number", 42);
   
           // 返回ModelAndView对象
           return modelAndView;
       }
   }
   ```
9. 通过Model向域对象共享数据
   ```java
   @Controller
   public class MyController {
   
       @GetMapping("/example")
       public String example(Model model) {
           // 向Model对象中添加数据
           model.addAttribute("message", "Hello, World!");
           model.addAttribute("number", 42);
   
           // 返回视图名称
           return "example-view";
       }
   }
   ```
10. 通过Map向域对象共享数据
   ```java
   @Controller
   public class MyController {
   
       @GetMapping("/example")
       public String example(Map<String, Object> model) {
           // 向Map中添加数据
           model.put("message", "Hello, World!");
           model.put("number", 42);
   
           // 返回视图名称
           return "example-view";
       }
   }
   ```
##### 以上几种方式，控制器方法执行之后都会返回统一的ModelAndView对象

11. 转发视图、重定向视图
   ```java
   @Controller
   public class MyController {
   
      @GetMapping("/forwardToExample")
      public String redirectToExample() {
         return "forward:/example"; // 转发到 "/example" URL
      }
   
       @GetMapping("/redirectToExample")
       public String redirectToExample() {
           return "redirect:/example"; // 重定向到 "/example" URL
       }
   }
   ```
12. HiddenHttpMethodFilter处理请求方式
   ```xml
    <!--web.xml配置过滤器-->
    <filter>
        <filter-name>hiddenHttpMethodFilter</filter-name>
        <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>hiddenHttpMethodFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
   ``` 
   ```java
   @Controller
   public class MyController {
       //   method属性来映射对应的处理方法
       @RequestMapping(value = "/example", method = RequestMethod.PUT)
       public String handlePutRequest() {
           // Handle PUT request here
           return "put-success"; // Return the view name to be rendered
       }
   }
   ```
   ```html
   <!--使用HiddenHttpMethodFilter时，可以在HTML表单中添加如下隐藏字段-->
   <form method="POST" action="/example">
      <!-- Some form fields here -->
   
      <!-- Hidden field to specify the HTTP method -->
    <!--为什么name是_method，看HiddenHttpMethodFilter源码就知道了-->
      <input type="hidden" name="_method" value="PUT">
      <button type="submit">Submit</button>
   </form>
   ```
13. ResponseBody处理json数据：添加jackson-databind依赖、开启mvc注解驱动、在处理器方法上使用@ResponseBody注解、直接返回java对象
   ```java
   @Controller
   public class UserController {
   
       @GetMapping("/users/{id}")
       @ResponseBody
       public ResponseEntity<User> getUserById(@PathVariable Long id) {
           // 假设这里从数据库或其他地方获取了用户对象
           User user = userService.getUserById(id);
           if (user != null) {
               return ResponseEntity.ok(user); // 返回用户对象，并由ResponseBody转换为JSON
           } else {
               return ResponseEntity.notFound().build();
           }
       }
   }
   
   // 或者直接用RestController也行？这个注解的作用是为控制器的所有方法都加上@ResponseBody注解
   @RestController
   public class UserController {
   
      @GetMapping("/users/{id}")
      public ResponseEntity<User> getUserById(@PathVariable Long id) {
         // 假设这里从数据库或其他地方获取了用户对象
         User user = userService.getUserById(id);
         if (user != null) {
            return ResponseEntity.ok(user); // 返回用户对象，并由ResponseBody转换为JSON
         } else {
            return ResponseEntity.notFound().build();
         }
      }
   }
   ```
14. ResponseEntity实现下载功能
   ```java
   @RestController
   public class FileDownloadController {
   
       @GetMapping("/downloadFile")
       public ResponseEntity<byte[]> downloadFile() throws IOException {
           // 模拟获取文件的byte数组，或从文件系统或其他地方读取文件内容
           byte[] fileContent = getYourFileContent();
   
           HttpHeaders headers = new HttpHeaders();
           headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
           headers.setContentDispositionFormData("attachment", "example.txt"); // 设置下载的文件名
   
           return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
       }
   
       // 模拟获取文件内容的方法
       private byte[] getYourFileContent() throws IOException {
           // 在这里实现获取文件内容的逻辑，这里使用示例的内容
           String content = "This is a sample file for downloading.";
           return content.getBytes(StandardCharsets.UTF_8);
       }
   }
   ```
15. 上传文件：添加依赖、配置文件上传解析器、写代码
   ```xml
    <!--添加依赖-->
   <dependency>
      <groupId>commons-fileupload</groupId>
      <artifactId>commons-fileupload</artifactId>
      <version>1.4</version>   
   </dependency>
   ```
   ```xml
   <!--注意id一定是multipartResolver，否则找不到!!!-->
   <!--配置处理文件上传的解析器-->
   <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
       <!-- 设置最大上传文件大小，单位为字节 -->
       <property name="maxUploadSize" value="10485760"/> <!-- 10MB -->
   </bean>
   ```
   ```java
    @PostMapping("/upload")
    public Object uploadFile(@RequestParam("file") MultipartFile file, HttpSession session) throws IOException {
        System.out.println("in request");
        if (!file.isEmpty()) {
            String originalFilename = file.getOriginalFilename();
            String suffixName = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFileName = UUID.randomUUID().toString() + suffixName;
            ServletContext servletContext = session.getServletContext();
            String uploadDir = servletContext.getRealPath("upload"); // WEB-INF的同级目录
            System.out.println("uploadDir:" + uploadDir);
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdir();
            }
            String filePath = uploadDir + File.separator + newFileName;
            file.transferTo(new File(filePath));
            return new HashMap<String, String>() {{
                put("msg", "success");
            }};
        }
        return null;
    }[Spring MVC工程配置步骤.md](..%2F..%2F..%2F..%2F%B0%A2%C0%EF%D4%C6%C5%CC%2F%CD%AC%B2%BD%C5%CC%2FJava%B1%CA%BC%C7%2FSpring%20MVC%B9%A4%B3%CC%C5%E4%D6%C3%B2%BD%D6%E8.md)
   ```
16. 过滤器和拦截器有什么区别
    1. 生命周期
        - 过滤器是Servlet规范中定义的一种组件，它在请求进入Servlet容器之前和响应离开Servlet容器之后进行处理，生命周期由Servlet容器管理。因此，过滤器可以在请求到达Servlet容器前对请求进行预处理，也可以在响应离开Servlet容器后对响应进行后处理。
        - 拦截器是Spring框架提供的一种组件，它在请求进入Spring的DispatcherServlet之前和响应离开DispatcherServlet之后进行处理，生命周期由Spring容器管理。因此，拦截器可以在请求到达Controller前进行预处理，也可以在Controller处理完成后进行后处理。
    2. 范围
        - 过滤器是在Servlet容器级别上工作的，它们可以对所有经过Servlet容器的请求和响应进行拦截处理。例如，可以用过滤器对所有URL进行认证和授权处理
        - 拦截器是在Spring MVC框架级别上工作的，它们只能拦截Spring MVC中的请求。拦截器通常用于实现特定的业务逻辑，如记录日志、处理权限等
    3. 配置方式
        - 过滤器通常在web.xml中进行配置，通过<filter>和<filter-mapping>来定义过滤器的名称、类和拦截路径等配置
        - 拦截器配置则是在Spring的配置类中通过实现WebMvcConfigurer接口的addInterceptors方法进行注册
    4. 作用范围
        - 过滤器能够拦截静态资源，例如图片、CSS文件等，以及所有的Servlet请求
        - 拦截器只能拦截Spring MVC的控制器请求，无法拦截静态资源
    5. 处理时机
        - 过滤器在请求到达Servlet容器时就开始处理，而拦截器在请求到达Spring的DispatcherServlet之后才开始处理
        - 过滤器在请求处理完成后续开始处理响应，而拦截器在Controller处理完成后、视图渲染之前进行处理
    6. 示例：
        ```java
        public class AuthInterceptor implements HandlerInterceptor {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
                // 根据用户的身份认证信息，判断是否有访问该URL的权限
                if (!userHasPermission(request)) {
                    response.sendRedirect("/login"); // 重定向到登录页面
                    return false; // 中断请求处理
                }
                return true; // 继续处理请求
            }
        
            // ...其他方法实现...
        }
        ```

总的来说，过滤器更加底层，可以拦截所有经过Servlet容器的请求和响应，而拦截器更加高层，只能拦截到Spring MVC中的请求。因此，在实际应用中，如果只需要拦截Spring MVC的请求，推荐使用拦截器；如果需要对所有请求进行处理，包括静态资源，可以使用过滤器

17. preHandle()方法返回true时，拦截器各个方法的执行顺序
    1. preHandle方法
        - 如果preHandle方法返回true，表示拦截器的前置处理通过，请求将继续向后传递到下一个拦截器或Controller。
        - 如果preHandle方法返回false，表示拦截器的前置处理失败，请求将中断，后续的拦截器和Controller都不会执行，直接返回响应给客户端。
    2. Controller的处理
        - 如果preHandle方法返回true，请求将进入到Controller中进行处理。
    3. postHandle方法
        - 当Controller的处理完成后，进入拦截器的postHandle方法，可以对响应结果进行修改或处理。
    4. afterCompletion方法
        - 最后进入拦截器的afterCompletion方法，在视图渲染后执行，用于进行一些清理工作或释放资源。

    综上所述，当preHandle方法返回true时，拦截器的方法执行顺序为：preHandle -> Controller处理 -> postHandle -> afterCompletion。

    请注意，拦截器是按照配置的顺序执行的，因此如果您在配置类中注册了多个拦截器，它们将按照注册的顺序依次执行。如果某个拦截器的preHandle方法返回false，后续的拦截器和Controller都不会执行。如果所有拦截器的preHandle方法都返回true，则请求会进入Controller进行处理，然后按照注册的顺序依次执行拦截器的postHandle和afterCompletion方法。
18. 拦截器的配置
    ```xml
    <mvc:interceptors>
        <mvc:interceptor>
            <mvc:mapping path="/**"/>  <!-- 拦截所有请求，包括根路径和子路径，注意这里是两个*！！！ -->
            <mvc:exclude-mapping path="/"/>  <!--排除首页-->
            <bean class="com.wei.demo1.interceptor.MyInterceptor"/>
        </mvc:interceptor>
    </mvc:interceptors>
    ```
18. 配置类
    ```java
    package com.wei.app;
    
    import com.wei.interceptor.TestInterceptor;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.ComponentScan;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.multipart.MultipartResolver;
    import org.springframework.web.multipart.commons.CommonsMultipartResolver;
    import org.springframework.web.servlet.HandlerExceptionResolver;
    import org.springframework.web.servlet.config.annotation.*;
    import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
    import org.thymeleaf.spring5.SpringTemplateEngine;
    import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver;
    import org.thymeleaf.spring5.view.ThymeleafViewResolver;
    import org.thymeleaf.templateresolver.ITemplateResolver;
    import java.util.List;
    import java.util.Properties;
    
    // 扫描组件、配置视图解析器、default-servlet-handler、开启mvc注解驱动、view-controller、配置文件上传解析器、异常处理、配置拦截器
    
    @Configuration
    @ComponentScan(value = {"com.wei.controller"})
    @EnableWebMvc
    public class WebConfig implements WebMvcConfigurer {
    
    
        /**
         * default-servlet-handler
         *
         * @param configurer
         */
        @Override
        public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
            configurer.enable();
        }
    
        /**
         * 配置拦截器
         *
         * @param registry
         */
        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            TestInterceptor testInterceptor = new TestInterceptor();
            registry.addInterceptor(testInterceptor).addPathPatterns("/**").excludePathPatterns("/");
        }
    
        /**
         * 配置view-controller
         *
         * @param registry
         */
        @Override
        public void addViewControllers(ViewControllerRegistry registry) {
            registry.addViewController("/hello").setViewName("hello");
        }
    
        /**
         * 自定义异常处理
         *
         * @param resolvers
         */
        @Override
        public void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
            Properties properties = new Properties();
            properties.setProperty("java.lang.ArithmeticException", "error");
            SimpleMappingExceptionResolver simpleMappingExceptionResolver = new SimpleMappingExceptionResolver();
            simpleMappingExceptionResolver.setExceptionMappings(properties);
            simpleMappingExceptionResolver.setExceptionAttribute("exception");
            resolvers.add(simpleMappingExceptionResolver);
        }
    
        /**
         * 文件上传解析器
         *
         * @return
         */
        @Bean
        public MultipartResolver multipartResolver() {
            CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
            commonsMultipartResolver.setMaxUploadSize(10485760);
            return commonsMultipartResolver;
        }
    
    
        @Bean
        public SpringResourceTemplateResolver resourceTemplateResolver() {
            SpringResourceTemplateResolver springResourceTemplateResolver = new SpringResourceTemplateResolver();
            springResourceTemplateResolver.setPrefix("/WEB-INF-templates/");
            springResourceTemplateResolver.setSuffix(".html");
            springResourceTemplateResolver.setTemplateMode("HTML5");
            springResourceTemplateResolver.setCharacterEncoding("UTF-8");
            return springResourceTemplateResolver;
        }
    
        @Bean
        public SpringTemplateEngine templateEngine(ITemplateResolver templateResolver) {
            SpringTemplateEngine springTemplateEngine = new SpringTemplateEngine();
            springTemplateEngine.setTemplateResolver(templateResolver);
            return springTemplateEngine;
        }
    
        @Bean
        public ThymeleafViewResolver thymeleafViewResolver(SpringTemplateEngine templateEngine) {
            ThymeleafViewResolver thymeleafViewResolver = new ThymeleafViewResolver();
            thymeleafViewResolver.setCharacterEncoding("UTF-8");
            thymeleafViewResolver.setTemplateEngine(templateEngine);
            return thymeleafViewResolver;
        }
    }
    ```
