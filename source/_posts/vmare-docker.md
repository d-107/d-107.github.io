---
title: Linux配置部署_新手向（五）——Docker的安装与使用
date: 2019-10-28 15:03:33
tags: [vmware,新手向]
categories: AprilBlank
---

### 前言
最近还是在考虑Linux下net core的部署问题，还是发现了很多麻烦的问题，这里还是继续把需要使用的东西部署介绍下吧。

### Docker
其实对于Docker我也是一星半点儿，了解的不够深入，大致感觉docker是比虚拟机更快速，更方便，体量小，部署快的"虚拟机"，这样的感觉是因为docker自成环境，互不干扰，单独部署的特点，我们可以把mysql，redis，nginx之类的都可以单独部署在docker下，也可以说有了docker，就可以为所欲为了，当然我主要介绍docker，不做那些单独部署其他的吧。

### 安装
我常规习惯切换到root来做安装程序操作。
1. 更新yum包

```bash
$ sudo yum update
```

2. 执行docker安装脚本

```bash
$ yum install -y docker
```
3. 启动Docker进程

```bash
$ sudo systemctl start docker
```

4. 设置Docker开机自启

```bash
$ sudo systemctl enable docker
```

5. 验证Docker是否安装成功

```bash
$ sudo docker run hello-world
$ docker ps -a
```

### 常用命令

**Docker版本信息**
```
docker version
```

**Docker系统信息**
```
docker info
```

**拉取镜像**
```
docker pull image_name //默认是最新版本，可以自己写版本号:version
```

**查看已有镜像**
```
docker images
```

**删除镜像**
```
docker rmi image_name
```

**删除<none>镜像**
```
docker rmi $(docker images | grep "<none>" | awk '{print $3}') 
```

**删除所有镜像**
```
docker rmi `docker images -q`
```

**按条件删除镜像**
```
docker rmi --force `docker images | grep keyname | awk '{print $3}}'` //keyname为关键词
```

**运行容器**
```
docker run image_name -d -p port:port
```

**启动、停止、重启容器**
```
docker start -i ID
docker stop -i ID
docker restart -i ID
```

**查看正在运行的容器**
```
docker ps
```

**查看所有容器**
```
docker ps -a
```

**杀死容器进程**
```
docker kill -s KILL ID
```

**保存镜像**
```
docker save -o filename.tar image_name:version
```

**加载镜像**
```
docker load -i filename.tar
```

**导出容器**
```
docker export -o filename.tar ID
```

**导入容器**
```
cat ./filepath/filename.tar | sudo docker import - image_name:version
```

**暂停容器的所有进程**
```
docker pause
```

**恢复容器的所有进程**
```
docker unpause
```

**获取容器的日志**
```
docker logs -f --tail 10 ID //获取最新10条日志记录
```

### 小结
介绍完这篇，就继续鼓捣net core在docker中的部署了，中间遇到的卡顿真是各种，但是既然想往前走，就必然会有荆棘，如果不能披荆斩麻，那就只有止步不前，学如逆水行舟，且行且珍惜。
