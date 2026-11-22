# web-kokar — mockup de la web de Kokar

Sigue también las reglas de `../CLAUDE.md` (sincronización con GitHub, ahorro de contexto, OpenCode).

## Qué es y para quién
Mockup navegable de la web de **Kokar** (nombre provisional, el brief decía «[NOMBRE DE LA EMPRESA]»), empresa de un amigo de Rodrigo: consultoría para entidades públicas y privadas, escuela de cursos en línea y editorial (venta de libros). Sirve para que el cliente apruebe el diseño antes de construir la web real. Referencia de estilo: goberna.pe, **solo como inspiración**: nada de sus textos, logo, imágenes ni código. Sin fotos de personas reales identificables.

## Estado
- **Fase 1 (hecha):** análisis de la referencia y dos portadas en `propuestas/`:
  - `a-territorio/`: oscura e institucional. Azul tinta `#0D1B2E`, latón `#D9B45A`, verde agua `#6FC3B2`. Newsreader + Public Sans. Fondo canvas con curvas de nivel.
  - `b-red/`: clara y moderna. Salvia `#EEF1EC`, bosque `#12302A`, cobalto `#2F5BFF`, menta `#9FE2C6`. Schibsted Grotesk. Fondo canvas con malla de puntos y red.
  - `index.html` en la raíz: página para que el cliente elija entre A y B.
- **Esperando:** que el cliente elija dirección. Después viene la fase 2 (sitio completo) con la elegida.

## Estructura
- HTML/CSS/JS estático, sin build. Cada página es autocontenida.
- `capturas/`: capturas usadas como miniaturas en la página selectora.
- `tools/serve.mjs`: servidor local (`node tools/serve.mjs 5180`), también en `.claude/launch.json`.
- Deploy: Vercel, proyecto `web-kokar`, despliega al hacer push a `main`. `.vercelignore` deja fuera `tools/`, `.claude/` y los .md.

## Páginas previstas para la fase 2
Inicio, Nosotros, Consultoría (general + detalle público/privado), Escuela (catálogo con filtros, ficha de curso, login de campus de maqueta), Librería (catálogo, ficha, carrito de maqueta), Publicaciones (listado + artículo), Contacto. En todas: menú con buscador y carrito, footer completo, WhatsApp flotante, responsive, y en el footer «Mockup de propuesta. Textos e imágenes de ejemplo».

## Lo que falta para la versión real
- Tienda con pagos reales (Culqi, Mercado Pago o Izipay), boletas y envíos.
- Campus de cursos (LMS) con usuarios, avances y certificados.
- Blog editable por el cliente (CMS).
- Nombre, logo, textos, fotos, cifras y clientes reales; dominio propio.
