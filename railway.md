# Despliegue en Railway (Node + Express + MySQL)

## 1) Asegura dependencias

En tu proyecto:

- `package.json` debe incluir todas las dependencias.
- Si usas `require("dotenv").config();` en `server.js`, instala y agrega `dotenv`.

Verifica que tienes:

- `dotenv` en `package.json`
- `mysql2`, `express`, `cors`.

## 2) Configura variables de entorno en Railway

En Railway (Project settings / Environment variables), crea:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT` (normalmente `3306` si es MySQL)

Opcional (según config de Railway):

- `PORT` (Railway normalmente lo maneja por tu lado, pero tu código usa `process.env.PORT || 3000`).

> Importante: Railway no necesita `.env` subido al repo. Esas variables deben ir en el dashboard.

## 3) Base de datos

Crea las tablas `documentos` y `seguimientos`.

- Puedes usar el SQL de `db/db.sql`.
- Lo usual en Railway es inicializar la DB manualmente o con un SQL en el provisioning del servicio de MySQL.

## 4) Despliega

Opción A: desplegar desde GitHub

1. Sube tu repo a GitHub.
2. En Railway: **New Project** → selecciona GitHub repo.
3. Railway detecta Node.
4. Click en **Deploy**.

Opción B: desplegar desde tu carpeta

1. Railway: New Project → **Deploy from source**.
2. Sube el proyecto (o conecta tu Git).

## 5) Revisa logs si falla

En Railway abre **Logs**:

- Errores de `Cannot find module 'dotenv'` => falta `dotenv` en dependencies.
- Errores de conexión MySQL => revisar `DB_HOST/USER/PASSWORD/NAME/PORT`.

## 6) Endpoint de prueba

- Probar `GET /` => debe responder `API funcionando`
- Probar `GET /documentos`
