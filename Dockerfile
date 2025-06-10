# Use an official Nginx image to serve static files
FROM nginx:alpine

# Remove the default static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy your static files into the container
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
