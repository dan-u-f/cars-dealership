
# Etapa 1: compilar React con Node.js
FROM node:24-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# Etapa 2: preparar Django con Python
FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar las dependencias de Python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el proyecto Django
COPY . .

# Incorporar React compilado
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Reunir los archivos estáticos
RUN python manage.py collectstatic --noinput

# Render proporciona el puerto mediante PORT
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py shell -c \"exec(open('seed_dealers.py', encoding='utf-8').read())\" && python manage.py shell -c \"exec(open('seed_cars.py', encoding='utf-8').read())\" && exec gunicorn dealership.wsgi:application --bind 0.0.0.0:${PORT:-10000}"]
