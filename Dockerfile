# ------------------------------
# Stage 1: Build the frontend app
# ------------------------------
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Build your production-ready static files
RUN npm run build


# ------------------------------
# Stage 2: Serve the built app with Nginx
# ------------------------------
FROM nginx:alpine

# Remove default nginx page and copy build output
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx in the foreground (container won't exit)
CMD ["nginx", "-g", "daemon off;"]
