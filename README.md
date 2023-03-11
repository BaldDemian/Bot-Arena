# BotArena 项目记录

>从 2023-02-24 开始写
>
>前端：Vue，Bootstrap 组件库，AJAX 用来发送网络请求
>
>后端：SpringBoot, SpringSecurity, SpringCloud 以集成微服务，MySQL 数据库访问使用 MyBatisPlus
>
>Java >= 11

## Intuition

**How does a web application is built?**

- 后端分层（以 SpringBoot 的项目结构为例）

  Controller：设置路由，调用 Service 接口进行处理，发回 Response

  Service：接口，处理业务逻辑，对应多种实现

  DAO：接口，用于访问数据库，供 ServiceImpl 进行调用

  PO：持久层对象，用于将数据库中查到的数据映射到 Java 实体类的对象

  VO：对应业务层的对象，但其实和 PO 差不太多，所以可以不要（？）

  Mapper：负责承担具体的数据库访问的操作，比如 MyBatis 中使用一系列 XML 文件来写 SQL，对应的 Spring 注解是 `Repository`

  还有一些其他的配置类或者是工具类

- 前端分层（以 Vue 的项目结构为例）

  ```
  ─src
     ├─assets
     │  ├─image
     │  └─scripts 公共JS脚本
     ├─components 组件，即对公共页面（比如导航栏）的抽象
     ├─router     其中仅有一个index.js，供路由的注册
     ├─store      存储
     └─views      各个页面
  ```
  
- 微服务架构

- 前后端不分离 v.s. 前后端分离

  HTML 文件由后端生成渲染后（比如使用模板引擎）发到客户端，即前后端不分离

  HTML 文件由后端传来一些参数、由 JS 在浏览器中完成最终渲染，即前后端分离
  
- 以密文存储用户密码

  数据库中存储的用户密码是经过加密后的。在登录时，将用户输入的密码执行相同的加密算法，看和数据库中存储的密文是否 **match**

- 授权认证

  - 基于 Session 的授权认证（常用于前后端不分离的项目中）

    浏览器第一次登录成功后，服务端生成一个 Session 并将其 ID 传给浏览器。之后浏览器发送的请求均附上这个 SessionID，服务器接收到请求报文后提取出 SessionID 与本地数据库（一般是 Redis 等**内存数据库**）中的 SessionID 进行对比，完成授权认证，并将 Session 提取到应用的**上下文**中

  - 基于 Token 的授权认证（常用于前后端分离的项目）

    浏览器第一次登录成功后，服务端生成一个 Token 发给客户端（注意服务端**不存储**这个 token）。具体来说，服务端通过一个密钥和某种加密方法，将用户 ID 进行加密并放入 token 中


## 项目功能

BotArena 机器人竞技场，用户通过编写代码控制自己的机器人与其他的机器人进行对决（目前支持贪吃蛇，也许后面会支持五子棋啥的）

- PK 模块（玩家和机器人、玩家和玩家；匹配功能由微服务实现），实况直播模块（WebSocket实现）
- 对局列表：对局信息、对局回放
- 排行榜
- 用户中心（登录注册、我的Bot、Bot详细信息）

## 0. 项目启动

>2023-02-24

1. 后端的配置（JDK 11，SpringBoot 2.7.9）

2. 前端的配置（使用 Vue ui）

   注意：使用 `vue ui` 命令打开图形化界面时，可能会出现无法切换到 C:\Users\ 以外的目录的情况。解决方法是在你想要创建项目的目录下，使用**管理员权限**打开 cmd 再输入命令

   需要安装的依赖：

   - vue-router
   - vuex
     - JQuery（使用 **AJAX** 而不是 Axios 进行网络请求）
   - bootstrap `npm i bootstrap@5.3.0-alpha1`

   记得去 `package.json` 里面检查一下是否确实安装了依赖。可以把 `package.json` 理解成 npm 中的 `pom.xml`

3. 跨过第一道坎：解决跨域问题

   在前后端分离的 Web 应用中，前端 Vue 项目在 8080 端口，后端的 SpringBoot 应用在 8000 端口。当在前端（8080）使用 AJAX 向后端发送请求时，就会产生跨域问题。

   解决方式：在后端中添加配置类 `CorsConfig.class`

4. 提交至 Git 仓库

## 1

>2023-02-28~2023-02-28

- 实现前端的导航栏（功能点：根据当前所在的页面高亮导航栏上相应的 tab）
- 在前端绘制游戏的地图（贪吃蛇中的地图，其中有随机生成的沿对角线对称的障碍物。要求每次**刷新**均能随机生成一张地图，该地图要求从左下角到右上角是**可达**的）

### 导航栏实现

- 基于**组件**化的思想，将顶部的导航栏封装成一个**组件**，供所有页面使用

- 注意创建 Vue 的组件时，文件名中至少要有 2 个大写字母！

- 一个组件的代码框架如下

  ```vue
  <template>
  
  </template>
  
  <script>
  export default {
    name: "NavBar"
  }
  </script>
  
  <style scoped>
  
  </style>
  ```

​	分别对应 HTML，JS 和 CSS。其中 `scoped` 的作用是为本组件的样式生成一个随机字符串，使其不会影响到**组件外部**

- 在 `App.vue` 中使用组件

  ```vue
  <template>
    <NavBar/>
    <router-view></router-view>
  </template>
  
  
  <script>
  import NavBar from "@/components/NavBar.vue";
  import "bootstrap/dist/css/bootstrap.min.css"
  import "bootstrap/dist/js/bootstrap"
  
  export default {
    components: {
      NavBar
    }
  }
  
  </script>
  <style>
  body {
    background-image: url("@/assets/background.png");
    background-size: cover;
  }
  </style>
  ```

- 在 router/index.js 中完成路由的注册，即在浏览器中输入不同的路径时应返回的页面（即组件）

- 使用 `router-link` 替换掉普通的 `a` 标签，实现**无刷新**跳转。其中的 `:to={name: ""} `中的 name 与 router/index.js 中的 name 保持一致。用 path 也可以

### 用 card 将区域包围

在 components 中实现一个用于包裹内容的组件 `ContentField`

```vue
<template>
    <div class="container content-field">
        <div class="card">
            <div class="card-body">
                <slot></slot>
                <!--填充的内容将在slot之中-->
            </div>
        </div>
    </div>

</template>

<script>
export default {
  name: "ContentField"
}
</script>

<style scoped>
div.content-field {
    margin-top: 20px;
}
</style>
```

### 高亮 tab

我们首先获取当前路由的名字。然后使用 v-bound 用三目条件表达式改写标签的属性

```vue
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-black">
  <div class="container">
    <router-link class="navbar-brand" :to="{name: 'home'}">BotArena</router-link>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link :class="routeName === 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">PK</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="routeName === 'record_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'record_index'}">Record</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="routeName === 'ranklist_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'ranklist_index'}">RankList</router-link>
        </li>
      </ul>

      <!--rightmost menu-->
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            hpy
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><router-link class="dropdown-item" :to="{name: 'user_bot_index'}">My Bot</router-link></li>
            <li><a class="dropdown-item" href="#">Log Out</a></li>
          </ul>
        </li>
      </ul>

    </div>
  </div>
  </nav>
</template>

<script>
import {useRoute} from "vue-router";
import {computed} from "vue"; // real-time compute
export default {
  setup() { // this function will be called when this page is set up
    const route = useRoute() // get current route and highlight it
    let routeName = computed(() => route.name)
    return {
      routeName
    }
  }
}
</script>

<style scoped>

</style>
```

### 地图绘制

- 游戏动画的原理

  每秒 60 帧，每帧均刷新一次。那么，每一帧均需要绘制 canvas。一个常用的框架：

  ```js
  // this function will be called each frame
  const step = timeStamp => {
      // for all objects in GAME_OBJECTS
      for (let o of GAME_OBJECTS) {
          if (!o.started) {
              o.start()
              o.started = true
          } else {
              o.timeDelta = timeStamp - lastTimestamp
              o.update()
          }
      }
      lastTimestamp = timeStamp // 更新时间戳
      requestAnimationFrame(step) // 递归调用，使得step每帧被调用一次
  }
  
  requestAnimationFrame(step)
  ```

  这样就可以做到每帧均调用一次 step 函数

- canvas 入门

  注意 canvas 中的坐标系和二维数组的坐标系是**相反**的！！！

  - canvas.fillStyle = ... 设置颜色

  - canvas.fillRect() 指定矩形的左上角的坐标和长宽

  - canvas.beginPath()

    canvas.arc() 指定圆心坐标 半径 起始角度 终点角度

    canvas.fill() 画圆

- 使用随机数在随机位置生成墙，但是那个位置已经有其他墙了怎么办？不连通怎么办？

  循环 10000 次，总有 1 次找得出来，直接 break

- 如何检测地图从左下角到右上角的连通性？

  一个简单的迷宫类 DFS/BFS 算法题的运用

- 所有的游戏中的对象（墙体、蛇等）均继承自一个基类 `GameObject`，其中每帧都会执行 update 方法，各对象重写自己的 update 方法，实现对象的动画绘制

## 2:star:

### :snake: 的绘制、移动、控制

-  浏览器每秒显示 60 帧动画，那么我们的 canvas 里面的内容每一帧都要重新 fill 一次
- 多理解一下 `Snake.js` 中的方法调用逻辑
- 当点的距离小于一个可以接受的误差后，我们可以认为它们两个点重合了
- 记得判断蛇是否有违法操作（如撞到墙、另一只蛇，反向移动）
- 注意每帧结束后还要移动蛇尾，或者是砍掉蛇尾
- 为了让蛇看起来更加圆润，用一个矩形覆盖每两个圆

## 3 用户登录前端和后端

### SQL 样式

遵循 [SQL样式指南 · SQL style guide by Simon Holywell](https://www.sqlstyle.guide/zh/) 调整 SQL 语句，主要要点如下：

1. 数据库名、表名、字段名全部使用**匈牙利命名法**

2. 语句的**第一个**单词的**右边**对齐

3. SQL 命令使用**全大写**

4. 在最后一条 SQL 命令的最后添加 `;`

5. 建表语句的格式总是让人心烦，包括缩进、换行等。参考样式如下：

   ```mysql
   CREATE TABLE stuff (
   	PRIMARY KEY (staff_id),
       staff_id       INT(5)       NOT NULL,
       first_name     VARCHAR(100) NOT NULL,
       pens_in_drawer INT(2)       NOT NULL,
       			   CONSTRAINT pens_in_drawer_range
       			   CHECK(pens_in_drawer BETWEEN 1 AND 99)
   );
   ```

   注意到关键点：按照最长的进行对齐。首行缩进 1 个 `tab`(4 个空格)

### 建库建表语句

```mysql
CREATE TABLE user (
    `id`       INT           NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100)  NOT NULL,
    `password` VARCHAR(100)  NOT NULL,
    `photo`    VARCHAR(1000) NOT NULL,
    PRIMARY KEY (`id`)
);
```

### SpringSecurity 入门

- SpringSecurity 默认基于 Session 的方式进行授权认证

- 更改 SpringSecurity 默认的用户名和密码

  在 `application.properties` 中添加：

  ```
  spring.security.user.name=root
  spring.security.user.password=root
  ```

- 不要忘了**放行** register 和 login 相关的接口！

### MyBatisPlus 的使用

配置 Dao

```java
package com.example.backend.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.backend.po.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDao extends BaseMapper<User> {
}
```

注意指定的 PO 中的字段名要和数据库字段名相同、PO 类名与表明相同（驼峰命名和匈牙利命名会自动切换）

将自动生成许多 CRUD 操作，一行 SQL 都不用写

- 插入记录

  `userDao.insert(user);`

- 查询记录（将查询条件放在 Wrapper 中）

  `userDao.selectList(wrapper);`

  `userDao.selectOne(wrapper);`

### API 实现

- `/user/account/token/` 验证用户名和密码，如果认证通过，返回对应的 jwt token

- `/user/account/info/` 根据 token 返回用户的信息

- `/user/account/register/` 注册用户

  todo: 对于非法密码的校验（含有非ASCII字符等、空白字段、null 字段、字段过长），现阶段的校验十分不靠谱。

  后端是一定要做完整的数据校验的，仅在前端做校验的话不安全。可以考虑使用 Spring 自带的校验注解（）

  错误码的约定

  - 100 注册成功

  - 101 用户名已被占用
  - 102 两次输入的密码不同
  - 103 密码长度小于 6
  - ...

### PostMan 调试接口

- 注意是 **http**，**不能**是 https!!!

<img src="https://img.balddemian.icu/img/202303111902169.png" alt="image-20230310142643084" style="zoom: 67%;" />

- 对于需要认证的 API，需要手动补上报文的 Authorization 头部(**bearer**)

  <img src="https://img.balddemian.icu/img/202303111902414.png" alt="image-20230310144543083" style="zoom:67%;" />

### 前端

- Store

  Store 中定义的字段和方法可以通过上下文 context 访问到

- 使用 AJAX 发送报文

  ```js
  $ajax({
      url: "",
      method: "", // post/get
      data: {
          
      },
      headers: {
          Authorization: "Bearer " + "",
      }
      ,
      success(resp) {
          // call on success  
      },
      error(resp) {
          // call on error
      },
  })
  ```

  

## -1 项目结构

