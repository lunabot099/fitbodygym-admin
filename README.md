# FitBodyGym Admin

Panel web administrativo para FitBodyGym.

## Objetivo

Este proyecto será usado por trabajadores del gimnasio para registrar clientes, controlar pagos, fechas de vencimiento y estado de membresías.

La app móvil Flutter (`fitbodygym-mobile`) consultará Supabase para validar si el correo del usuario tiene una membresía activa y no vencida.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Repos relacionados

- `fitbodygym-admin`: panel web administrativo.
- `fitbodygym-mobile`: app móvil Flutter/Dart para clientes.

## Variables de entorno

Copia `.env.example` a `.env.local` y configura:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

No subas `.env.local` al repositorio.

## Base de datos inicial

El esquema inicial está en:

```txt
supabase/migrations/001_initial_schema.sql
```

Tablas iniciales:

- `clients`: clientes registrados por el gym.
- `memberships`: pagos, planes y vencimientos.
- `active_memberships`: vista para validar acceso premium desde la app.

## Desarrollo local

```bash
npm install
npm run dev
```

## Validación

```bash
npm run lint
npm run build
```

## Deploy previsto

```txt
admin.fitbodygym.info
```
