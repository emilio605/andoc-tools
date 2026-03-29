# Deployment Guide — Andoc Creativo Tools

## Opción 1: Deploy en Vercel (Recomendado)

### Paso 1: Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Crea un nuevo repositorio llamado `andoc-tools`
3. Sigue las instrucciones para pushear el código local:

```bash
git remote add origin https://github.com/TU_USUARIO/andoc-tools.git
git branch -M main
git push -u origin main
```

### Paso 2: Conectar a Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en "New Project"
3. Importa tu repositorio de GitHub (`andoc-tools`)
4. Vercel automáticamente detectará que es un proyecto Vite

### Paso 3: Configurar Variables de Entorno

En el dashboard de Vercel, antes de deployar:

1. Ve a **Settings** → **Environment Variables**
2. Añade una nueva variable:
   - **Name**: `VITE_ANTHROPIC_API_KEY`
   - **Value**: Tu clave de API de Anthropic (consigue aquí: [console.anthropic.com](https://console.anthropic.com))
   - **Environments**: Selecciona "Production"

3. Click "Save"

### Paso 4: Deploy

1. Click en "Deploy" en el dashboard de Vercel
2. Vercel construirá y desplegará automáticamente
3. Una vez completado, verás una URL pública como:
   ```
   https://andoc-tools-xxxxx.vercel.app
   ```

## Opción 2: Deploy Manual en Vercel CLI

Si prefieres usar la CLI:

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones interactivas. Cuando pida variables de entorno, añade `VITE_ANTHROPIC_API_KEY`.

## Verificación Post-Deploy

1. Abre la URL pública de Vercel
2. Navega por todas las rutas:
   - `/` → Home
   - `/onboarding` → Onboarding SOP
   - `/brief` → Brief de Descubrimiento
   - `/brief-ia` → Brief IA (prueba con una transcripción de ejemplo)
   - `/propuesta` → Propuesta Comercial

3. En `/brief-ia`, prueba pegando una transcripción de ejemplo:
   ```
   Emilio: Hola, cuéntame sobre tu negocio.
   Cliente: Somos una tienda online de ropa, llevamos 3 años vendiendo...
   ```
   Click "Completar Brief con IA" y verifica que Claude procesa la transcripción.

## Troubleshooting

### Error: `VITE_ANTHROPIC_API_KEY` undefined

- Verifica que agregaste la variable en Vercel Settings → Environment Variables
- Redeploy manualmente en el dashboard de Vercel después de agregar la variable

### La app se carga pero no funciona la API

- Revisa que tu clave de API sea válida en [console.anthropic.com](https://console.anthropic.com)
- Verifica que tengas créditos en tu cuenta de Anthropic
- Comprueba en la consola del navegador si hay errores (F12 → Console)

## Próximos Pasos

- Actualiza el README.md con la URL pública de Vercel
- Comparte la URL con tu equipo en Andoc Creativo
- Monitorea los logs de Vercel en caso de errores

---

**Documentación útil:**
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Anthropic Claude API](https://docs.anthropic.com)
