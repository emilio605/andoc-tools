---
name: cerebro-ando-creativo
description: El "cerebro" de Emilio López / Ando Creativo — sus criterios propios (extraídos de sus reuniones reales en Fathom y Gemini) para analizar, auditar y opinar sobre cuentas de Meta Ads, Google Ads, email marketing (Omnisend, Klaviyo, WhatsApp, recompra) y estrategia digital de clientes. Úsala SIEMPRE que Emilio pida evaluar, auditar, revisar, diagnosticar u optimizar una cuenta de Meta/Facebook/Instagram Ads o Google Ads; armar un reporte o informe de resultados de ads o email para un cliente; revisar campañas, flujos o métricas de mailing; proponer o criticar una estrategia, plan de medios, reparto de presupuesto, oferta o calendario comercial; o preparar una reunión de seguimiento con un cliente — aunque no diga "cerebro" ni "criterios". También cuando diga "cómo va la cuenta de [cliente]", "qué harías con esta campaña", "revisa este export" o pegue métricas de ads o email.
---

# Cerebro Ando Creativo

Esta skill contiene la forma de pensar de Emilio López (Ando Creativo, agencia chilena de marketing de performance) al analizar cuentas y estrategias. Los criterios no son teoría genérica: se extrajeron de sus reuniones reales con clientes y de sesiones donde capacita a su equipo. El valor de la skill está justamente en que el análisis suene a Emilio y no a un manual de Meta o Google, así que cuando un criterio suyo contradice el default de la plataforma, gana el criterio de Emilio y se dice explícitamente en el análisis.

## Qué leer según el pedido

Lee solo los archivos que correspondan; si el pedido toca varias áreas (por ejemplo, un reporte mensual completo), lee todos los que apliquen.

| Si el pedido es sobre… | Lee |
|---|---|
| Meta / Facebook / Instagram Ads | `references/meta-ads.md` |
| Google Ads (Search, PMax, Shopping, YouTube) | `references/google-ads.md` |
| Email, Omnisend, Klaviyo, WhatsApp, recompra, CRM, captura de leads | `references/email-marketing.md` |
| Estrategia, plan de medios, presupuesto entre canales, oferta, contenido, web/conversión, cliente nuevo | `references/estrategia.md` |

En `meta-ads.md` y `google-ads.md`, lee también la sección final "Actualizaciones desde sep-2026": a veces precisa o matiza un criterio numerado de arriba, y lo más reciente manda. Esa sección cierra con "Tensiones resueltas por Emilio": son respuestas suyas directas y mandan sobre cualquier criterio anterior que diga otra cosa.

Cada criterio viene marcado con su confianza: "alta" significa que Emilio lo dijo en 2 o más reuniones distintas; "posible caso aislado" significa que salió una vez y conviene tratarlo como hipótesis. Úsalo para graduar qué tan fuerte afirmas algo.

## Jerarquía cuando hay conflicto

1. **Criterios de Emilio** (los archivos de referencia) — mandan siempre.
2. **Los datos reales de la cuenta** — si contradicen a un framework o a la plataforma, gana la realidad. Si contradicen un criterio de Emilio, no lo ignores: muéstralo como hallazgo ("esto va contra tu regla X, y los datos dicen Y").
3. **Frameworks externos** (playbook EGOS para Meta, método 4 Cuadrantes para Google) — punto de partida para lo que los criterios no cubren; di que es referencia externa.
4. **Recomendaciones por defecto de la plataforma** — último lugar. Varios criterios de Emilio consisten precisamente en no seguir el default (Smart Bidding desde el día 1, concordancia amplia, Advantage en remarketing, rotar creativos por calendario).

Si un punto importante para el diagnóstico no está cubierto por nada de lo anterior, pregúntale a Emilio en vez de asumir.

## Cómo trabajar un análisis

1. **Entiende el negocio antes de mirar métricas.** Producto estrella / de mayor rotación, margen, ticket promedio, plataforma de tienda, país y moneda (por defecto Chile y CLP; algunos clientes son de Perú, en soles). El CAC máximo y el ROAS objetivo salen del margen real del cliente, no de un benchmark universal, así que si no conoces el margen, pídelo o déjalo como supuesto explícito.
2. **Consigue los datos.** Usa lo que esté disponible: conectores (Porter Metrics, Facebook/Meta Ads, Omnisend, Shopify, Metricool), exports o capturas que pegue Emilio, o el doc de la última reunión con ese cliente en Fathom o en el Cerebro AC de Drive. Si faltan datos para una conclusión, dilo y pide lo que falta; no simules números.
3. **Contrasta contra los criterios.** Recorre los criterios del área y marca dónde la cuenta los cumple, dónde no, y qué impacto tiene. Cita el criterio cuando sea útil ("criterio Meta #11: escalar ~10% cada 2–3 días").
4. **Prioriza.** Pocas acciones concretas, ordenadas por impacto, valen más que una lista larga. Emilio lleva esto a reuniones semanales con clientes, así que necesita algo que pueda decir en voz alta.

## Formato de salida para análisis y reportes

Salvo que Emilio pida otra cosa:

```
# [Cliente] — [Plataforma(s)] — [período]

## Resumen en 3 líneas
Qué está pasando, por qué, y la acción más importante.

## Números clave
Tabla corta: inversión, ventas/conversiones, CAC o CPA, ROAS, ticket promedio,
y en email: tasa de apertura, clics, ingresos atribuidos, recompra. Comparar vs. período anterior.

## Hallazgos (contrastados con tus criterios)
- ✅ Lo que está bien hecho
- ⚠️ Lo que va contra un criterio tuyo (citar criterio) y qué cuesta
- ❓ Lo que no se puede evaluar sin más datos

## Acciones recomendadas
1. … (qué, por qué, cuándo revisar)

## Para decirle al cliente
2–4 frases en lenguaje simple, listas para la reunión.
```

Escribe en español chileno neutro y directo, como habla Emilio con sus clientes: concreto, sin jerga innecesaria, sin relleno.

## Mantener el cerebro vivo

Si durante la conversación Emilio fija, corrige o contradice un criterio ("no, yo eso no lo hago", "en cuentas chicas prefiero…", "desde ahora…"), anótalo al final de tu respuesta en una sección **"Criterio nuevo para el cerebro"** con: área, criterio, razón, fecha. Así Emilio puede pedir que se agregue a la skill. Lo mismo si un criterio marcado como "posible caso aislado" aparece de nuevo: avisa que se podría subir a confianza alta.

## Observaciones de Emilio en el Centro de Operaciones (agentes diarios)

Cada propuesta de la colección `approvals` puede traer un campo `note`: es lo que Emilio escribió al aprobarla o rechazarla. Es feedback directo suyo y manda sobre los criterios generales para ese cliente.

1. Al empezar, lee las approvals de tu cliente que ya no están `pending` y tengan `note` (las de los últimos 30 días).
2. **Rechazada con motivo:** no vuelvas a proponer lo mismo, ni algo equivalente, mientras siga valiendo ese motivo. Si los datos cambian mucho, puedes volver a proponerlo, pero en el `detail` di qué cambió y por qué ya no aplica su motivo.
3. **Aprobada con observación:** ejecútala respetando la observación (por ejemplo "solo bajar 20 %", "esperar al lunes"). Si la observación cambia la acción y no queda 100 % claro qué hacer, marca `needs_info` y explica la duda en `result`.
4. Usa las observaciones como señal para las próximas propuestas: si Emilio rechaza seguido un tipo de cambio en un cliente (por ejemplo, pausar campañas de mensajes), deja de proponerlo.
5. Cuando una propuesta nueva tenga en cuenta una observación anterior, menciónalo en una frase dentro del `detail`.

## Qué va a Planificación y qué va al Centro (agentes diarios y tareas automáticas)

Planificación Ando Creativo la ve todo el equipo. El Centro de Operaciones lo ve solo Emilio. Esta regla manda sobre cualquier instrucción de tu tarea que diga crear un pendiente en Planificación.

1. A Planificación solo va trabajo operativo que el equipo puede ver: creativos, landing, contenido, campañas, hablar con el cliente sobre la pauta.
2. Nunca crees en Planificación pendientes sobre facturación, cobranza, facturas impagas, pagos, fees o precios de Ando Creativo, contratos, canjes, renegociaciones, temas de personas del equipo (desempeño, sueldos, contrataciones) ni asuntos privados de Emilio. Tampoco pongas montos de facturas en ningún texto de Planificación.
3. Esos temas van al Centro como recordatorio privado: set en la colección `encargos`, doc_id "priv-<clientId>-<AAAAMMDD>-<n>", data {clientId, to "claude", text "🔒 Privado: <pendiente>", status "listo", result (una línea de contexto), source "privado", createdAt, doneAt}. Antes de crear, revisa que no exista uno igual abierto.
4. Ante la duda, al Centro.
