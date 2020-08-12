
# 被忽略的时区问题

> 众所周知，北京时间对应的是东八区。

+ /etc/localtime
+ /etc/timezone
+ 闰秒
+ https://stackoverflow.com/questions/6841333/why-is-subtracting-these-two-times-in-1927-giving-a-strange-result
+ https://cloud.tencent.com/developer/ask/197047
+ https://blog.51cto.com/sry2004/2105531
+ https://segmentfault.com/q/1010000000317098
+ https://my.oschina.net/jiangbianwanghai/blog/121661
+ https://www.cnblogs.com/h2appy/archive/2008/11/27/1342029.html
+ https://www.zhihu.com/question/412675582
+ https://www.timeanddate.com/time/zone/china/shanghai

## 查看时区

> 通过系统命令 `date -R` 可以参考系统的当前时区，后面的 +0800 表示 `东八区`
```sh
date -R # Mon, 27 Jul 2020 17:36:15 +0800
```

## 设置时区

1. 设置环境变量 `TZ="Asia/Shanghai"`
2. 设置配置文件 `/etc/localtime` 文件 ` zdump -v /etc/localtime`
3. `tzselect`、`timeconfig` 和 `dpkg-reconfigure tzdata` 命令

> 其中 1 和 2 比较常用，3只在部分系统支持

## docker 的时区设置
+ https://stackoverflow.com/questions/57607381/how-do-i-change-timezone-in-a-docker-container
> 一般说来，docker image 默认的时区是零时区，如果不加以指定，运行时获取到的都是格林尼治时间（也叫格林威治时间），对于后台服务，可以通过 Dockerfile 指定环境变量 TZ 设置时区, 也可以在运行时指定。

### Dockerfile
```sh
ENV TZ="Asia/Shanghai"
```

### 运行时指定
```sh
# 通过 -e 指定环境变量
docker run -e TZ="Asia/Shanghai" hello-world:latest

# 通过 -v 映射宿主机的时区文件
docker run -v "/etc/localtime:/etc/localtime:ro" hello-world:latest
```



## JS 的 Date

> JS 的 Date 对象有一个 `getTimezoneOffset` 方法，通过 `(new Date()).getTimezoneOffset()` 可以获取到当前系统的时区信息
