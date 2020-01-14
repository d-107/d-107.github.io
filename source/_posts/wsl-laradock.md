
---
title: win10 子系统（wsl1）运行 laradock
date: 2020-01-14 12:21:00
tags: docker
categories: 南瓜
---


子系统出来挺长时间了，看看配置，公司的渣机也就能玩玩wsl1，也就是第一代子系统。

算了，就这么鼓捣吧。

子系统选择 Ubuntu。

![](wsl-laradock/cover.png)

<!-- more -->

#### 安装子系统
略

#### 配置 docker
[官网配置手册]([https://docs.docker.com/install/linux/docker-ce/ubuntu/](https://docs.docker.com/install/linux/docker-ce/ubuntu/)


先卸载旧版docker：
```
sudo apt-get remove docker docker-engine docker.io containerd runc
```

然后再继续安装：
```
# 更新索引
sudo apt-get update

# 安装软件，允许 apt 通过 https 访问存储库
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

# 添加Docker的官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 设置存储库
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# 安装 docker 客户端
sudo apt-get install docker-ce

# 赋权
sudo usermod -aG docker $USER

# 安装 docker-compose
sudo apt install docker-compose

```

#### 关联 wsl 到 docker-for-windows
在 wsl 中运行
```
echo "export DOCKER_HOST=tcp://localhost:2375" >> ~/.bashrc && source ~/.bashrc
```

#### wsl 目录挂载
wsl 目录挂载默认在 `/mnt/c`，跟 docker-for-windows 的工作方式不一致，因此需要做下调整。

```
sudo vi /etc/wsl.conf

[automount]
root = /
options = "metadata"
```
保存以后，重启 wsl。

#### 启动laradock
在 windows 的 laradock 目录中打开命令行，运行 `bash` 即可快速进入 wsl 中的对应目录，然后再执行 `docker-compose up` 命令就能启动服务。

启动完以后，宿主机直接访问即可。

如果配置虚拟域名，一样是在宿主机的 hosts 添加。
