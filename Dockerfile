FROM node:24-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine@sha256:378d0c32f6562f7fd9629170797f57d2b953aa09be983b3daaf4809bb039ca00 AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/petclinic-client-angular/browser /usr/share/nginx/html
EXPOSE 8080
