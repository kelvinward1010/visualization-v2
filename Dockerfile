# Sử dụng node image chính thức từ Docker Hub
FROM node:20 as build

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và cài đặt các phụ thuộc
COPY package*.json ./
RUN npm install

# Sao chép mã nguồn và build ứng dụng
COPY . .
RUN npm run build

CMD ["npm", "run", "dev"]

# # Sử dụng một web server đơn giản để phục vụ ứng dụng
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
