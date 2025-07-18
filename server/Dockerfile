# 使用官方 Node.js 镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 复制 prisma schema
# COPY prisma ./prisma

# 安装 pnpm
RUN npm install -g pnpm

# 设置 Prisma 二进制目标
ENV PRISMA_CLI_BINARY_TARGETS="linux-musl-openssl-3.0.x"

# 安装依赖
RUN pnpm install --frozen-lockfile

# 生成 Prisma 客户端
# RUN pnpm prisma generate

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 创建上传目录
RUN mkdir -p /app/uploads

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "run", "start:prod"] 