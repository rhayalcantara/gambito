# Plan — GAMBITO como app instalable (PWA) en GitHub Pages

Fecha: 2026-11-15 · Origen: `~/Downloads/Qwen_html_20261115_8gumn75v4.html` (fases 1–5 terminadas)
Destino: repo público `rhayalcantara/gambito` → https://rhayalcantara.github.io/gambito/

## Qué se hace
1. Carpeta `~/proyectos/gambito` con `index.html` (copia del archivo final).
2. Íconos PNG (192, 512, maskable 512, apple-touch 180) generados del caballo del logo.
3. `manifest.webmanifest` (nombre, colores, pantalla completa) y metas para iPhone.
4. sql.js (`sql-wasm.js` + `.wasm`) copiado dentro del repo y cargado primero desde ahí (sin depender del CDN).
5. `sw.js`: precarga de la app y caché de fuentes de Google → funciona sin internet tras la primera visita.
6. Repo público en GitHub + GitHub Pages activado.
7. Verificación: carga, sin errores en consola, instalable (manifest + service worker), motor responde, funciona offline.

## Notas
- Las partidas quedan guardadas en cada teléfono (IndexedDB), no en GitHub.
- Stockfish sigue siendo opcional y necesita internet; Aurora funciona offline.

## Lista de tareas
| # | Tarea | Estado |
|---|---|---|
| 1 | Carpeta + index.html | finalizado |
| 2 | Íconos | finalizado |
| 3 | Manifest + metas iPhone | finalizado |
| 4 | sql.js local | finalizado |
| 5 | Service worker offline | finalizado |
| 6 | Prueba local (servidor + Chrome) | finalizado |
| 7 | Repo público + GitHub Pages | finalizado |
| 8 | Verificación en la URL pública + QR | finalizado |

## Ajuste 1 (2026-11-15) — tablero que se va hacia arriba al ver una partida en el celular
Causa: `scrollIntoView` de la jugada actual desplaza toda la página.
| # | Tarea | Estado |
|---|---|---|
| 1 | Desplazar solo dentro de la caja de jugadas (nunca la página) | finalizado |
| 2 | Celular/Tablero: jugadas en una línea horizontal bajo el tablero, actual centrada, las demás se desvanecen | finalizado |
| 3 | Aplicar en Downloads y en el repo, subir versión del SW, probar y publicar | finalizado |

## Ajuste 2 (2026-11-15) — Stockfish 18 integrado
Versión: **stockfish.js 18.0.8 "lite single-threaded"** (`.js` 20 KB + `.wasm` 7,3 MB, NNUE pequeña).
- Single-threaded porque GitHub Pages no permite las cabeceras COOP/COEP que exige la versión multihilo; la "full" pesa 113 MB (inviable en el teléfono).
- Licencia GPLv3: se incluye `Copying.txt` y el enlace al código fuente (nmrugg/stockfish.js) en el README.
- Se carga solo cuando se elige (no se descarga al abrir la app); queda guardado para usarse sin internet.

| # | Tarea | Estado |
|---|---|---|
| 1 | Copiar `vendor/stockfish/` (js + wasm + licencia) | finalizado |
| 2 | Registrar "Stockfish 18" en el selector de motores (se activa si los archivos existen) | finalizado |
| 3 | Análisis: con Stockfish la profundidad del control se escala (3→8 … 8→18) | finalizado |
| 4 | Service worker: guardar el motor en caché al primer uso (offline) | finalizado |
| 5 | Probar: jugar en niveles 1 y 8, analizar partida, offline, consola limpia | finalizado |
| 6 | Publicar y verificar en GitHub Pages | finalizado |

Extra encontrado y corregido: `UciSession` usaba `new Chess(...)` (no definido en ese script) → cualquier motor UCI, incluido Stockfish 10, se quedaba colgado. Niveles 5–8 con motores UCI: profundidad 10/14/18/22 (antes 6–9, Stockfish respondía al instante).

## Ajuste 3 (aprobado) — búsqueda de partidas: paginación, jugador/rival y rango de fechas
**1. Paginación**
- 50 partidas por página (selector 25 / 50 / 100), consulta con `LIMIT/OFFSET` (rápido aunque haya miles).
- Barra «‹ Anterior · Página 2 de 8 · Siguiente ›» al pie de la tabla; vuelve a la página 1 al cambiar cualquier filtro.
- "Seleccionar todas" marca solo la página visible.

**2. Jugador y rival**
- Campo **Jugador** y campo **Rival (opcional)**, con sugerencias de nombres de la biblioteca.
- Solo jugador → todas sus partidas, con blancas o negras.
- Jugador + rival → solo las partidas entre ellos dos, en cualquier color (ej. rhayalcantara vs bunildovelez y viceversa).
- Coincidencia parcial y sin distinguir mayúsculas («kasp» encuentra «Kasparov, Garry»).

**3. Rango de fechas**
- **Desde** y **Hasta** (calendario del teléfono). Se puede poner solo uno.
- Fechas incompletas del PGN («1858.??.??») entran si su año/mes cae en el rango; sin año, quedan fuera cuando hay rango.
- Reemplaza al filtro "Todas las épocas" (una época es solo un rango); las vistas guardadas con época se convierten solas.

**Interfaz:** botón «Filtros (n)» que abre/pliega una fila con Jugador, Rival, Desde, Hasta y «Limpiar»; en el celular va en columna.

| # | Tarea | Estado |
|---|---|---|
| 1 | Consulta con filtros jugador/rival/fechas + LIMIT/OFFSET (SQLite y modo local) | finalizado |
| 2 | Interfaz de filtros (plegable, sugerencias, limpiar) | finalizado |
| 3 | Paginación (barra, tamaño de página, selección por página) | finalizado |
| 4 | Vistas guardadas compatibles (época → rango) | finalizado |
| 5 | Pruebas: 300+ partidas, combinaciones de filtros, fechas incompletas, celular y escritorio | finalizado |
| 6 | Aplicar en Downloads y repo, subir versión SW, publicar | finalizado |

Verificado (321 partidas de prueba): jugador 101 = SQL 101; jugador+rival 23 = 23; ambos en 2021: 4 = 4; «2021.??.??» entra en el rango 2021; vista antigua «2020s» → 2020-01-01…2029-12-31 (276 = 276); celular 390 px sin desborde.
