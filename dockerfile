# Use an official Node.js runtime as the base image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm start

# Use a lightweight Nginx image to serve the built application
FROM nginx:alpine

# Copy the built app from the previous stage to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 4000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
