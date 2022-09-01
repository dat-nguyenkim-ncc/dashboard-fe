# FROM git.bcgplatinion.io:4567/fintech-control-tower/gitlab-runner/node:14

# WORKDIR /app
# ARG Environment
# #RUN npm install -g serverless

# COPY . /app
# RUN    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-2.0.30.zip" -o "awscliv2.zip"
# RUN    unzip awscliv2.zip
# RUN    ./aws/install
# RUN    yarn install && yarn build:$Environment
# CMD     ["aws"]

# build environment
FROM node:13.12.0-alpine as build

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY package.json ./
# RUN npm ci --silent
# RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm install
# RUN npm run test
# RUN npm run build


# production environment
FROM nginx:stable-alpine

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
