# xatzy-mvnbook

安装方式

1: docker环境
   
   centos7:安装 docker docker-compose git

    [root@localhost ~]# yum install git
    [root@localhost ~]# yum install docker
    [root@localhost ~]# curl -L https://github.com/docker/compose/releases/download/1.20.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    [root@localhost ~]# chmod +x /usr/local/bin/docker-compose
    [root@localhost ~]# docker-compose --version

   启动docker服务

    [root@localhost ~]# systemctl start docker.service
    [root@localhost ~]# systemctl enable docker.service
   
2: 下载代码

    [root@localhost ~]# git clone https://github.com/john04047210/xatzy-mvnbook.git
    [root@localhost ~]# cd xatzy-mvnbook
    [root@localhost ~]# vi docker-compose.yml
    [root@localhost ~]# // 修改文件第5行 xatzy.qiaopeng007.cn，变更为自己的域名
    [root@localhost ~]# docker-compose up -d
    [root@localhost ~]# brower http://[xatzy.qiaopeng007.cn]/mvnbook/index.html
