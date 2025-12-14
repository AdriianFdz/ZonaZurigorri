# Usa la misma imagen que en Compose
FROM kong:3.9.1

# Copia el kong.yml al contenedor
COPY kong.yml /usr/local/kong/declarative/kong.yml

# Variables de entorno
ENV KONG_DATABASE=off
ENV KONG_DECLARATIVE_CONFIG=/usr/local/kong/declarative/kong.yml
ENV KONG_PROXY_ACCESS_LOG=/dev/stdout
ENV KONG_ADMIN_ACCESS_LOG=/dev/stdout
ENV KONG_PROXY_ERROR_LOG=/dev/stderr
ENV KONG_ADMIN_ERROR_LOG=/dev/stderr
ENV KONG_ADMIN_LISTEN="0.0.0.0:8001,0.0.0.0:8444 ssl"

ENV KONG_NGINX_WORKER_PROCESSES=1
ENV KONG_MEM_CACHE_SIZE=64m

# Exponer los mismos puertos que en Compose
EXPOSE 8000 8443 8001 8444

# Comando para iniciar Kong
CMD ["kong", "start"]