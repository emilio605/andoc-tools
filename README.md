# Andoc Creativo — Herramientas Operacionales

Panel integrado con 4 herramientas operacionales para la gestión de onboarding, briefs y propuestas comerciales de Andoc Creativo.

## Herramientas

1. **Onboarding SOP** — Guía paso a paso con 6 fases, tareas y notas para el onboarding de clientes nuevos.
2. **Brief de Descubrimiento** — Formulario completo con 6 secciones para recopilar información en la reunión de descubrimiento.
3. **Brief IA** — Auto-completar brief desde transcripción de reunión usando Claude API.
4. **Propuesta Comercial** — Generador de propuestas con servicios editables, precios en UF e IVA.

## Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Fonts**: Google Fonts (DM Sans + DM Mono)
- **Design**: Dark theme (#0f0f13), Andoc branding (#F97316)
- **API**: Anthropic Claude Sonnet 4 (para Brief IA)
- **Deploy**: Vercel

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) para ver la app.

## Build

```bash
npm run build
```

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```
VITE_ANTHROPIC_API_KEY=tu-clave-aqui
```

## Deployment en Vercel

1. Sube el repositorio a GitHub
2. Conecta tu repositorio a Vercel
3. Configura la variable de entorno `VITE_ANTHROPIC_API_KEY` en el dashboard de Vercel
4. Deploy automático en cada push a main

## Rutas

- `/` — Home / Landing
- `/onboarding` — Onboarding SOP
- `/brief` — Brief de Descubrimiento
- `/brief-ia` — Brief IA (Auto-completar)
- `/propuesta` — Propuesta Comercial

---

Desarrollado para Andoc Creativo
