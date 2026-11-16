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
