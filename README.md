# GAMBITO ♞

App de ajedrez en una sola página, instalable en el celular (PWA) y usable sin conexión.

**Abrir / instalar:** https://rhayalcantara.github.io/gambito/

- **Biblioteca** de partidas PGN (importar, buscar, filtrar por torneo y época, exportar) guardada en SQLite dentro del navegador.
- **Tablero** con reproductor, análisis con el motor Aurora, clasificación de jugadas (?!, ?, ??), precisión % por jugador y libro de aperturas ECO.
- **Motores:** Aurora (integrado, ligero) y Stockfish 18 (integrado, mucho más fuerte).
- **Jugar** contra Aurora o Stockfish en 8 niveles, con reloj, deshacer, tablas, girar tablero y entrada por teclado.

## Instalar en el teléfono
- **Android (Chrome):** abre el enlace → menú ⋮ → *Instalar app* (o *Agregar a la pantalla principal*).
- **iPhone (Safari):** abre el enlace → botón Compartir → *Agregar a inicio*.

Tras la primera visita funciona sin internet. Las partidas se guardan en cada dispositivo; nada se envía a ningún servidor.

## Archivos
- `index.html` — la app completa.
- `manifest.webmanifest`, `icons/` — datos de instalación.
- `sw.js` — service worker (modo sin conexión).
- `vendor/` — [sql.js](https://github.com/sql-js/sql.js) 1.8.0 (MIT).
- `vendor/stockfish/` — [Stockfish.js](https://github.com/nmrugg/stockfish.js) 18.0.8, edición *lite single-threaded* (motor [Stockfish](https://github.com/official-stockfish/Stockfish)). Licencia **GPLv3** (`vendor/stockfish/Copying.txt`); código fuente en los enlaces anteriores. Se descarga solo al elegir el motor y queda disponible sin conexión.
