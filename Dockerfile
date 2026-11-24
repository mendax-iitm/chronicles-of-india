FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all static web assets to nginx html root
COPY . /usr/share/nginx/html

# Set proper permissions for static files
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Healthcheck testing HTTP availability
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost:80/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
