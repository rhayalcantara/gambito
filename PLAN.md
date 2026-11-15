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
| 6 | Prueba local (servidor + Chrome) | en progreso |
| 7 | Repo público + GitHub Pages | pendiente |
| 8 | Verificación en la URL pública + QR | pendiente |
