# 使用官方 nginx 镜像
FROM nginx:alpine

# 复制静态文件到 nginx 目录
COPY . /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 