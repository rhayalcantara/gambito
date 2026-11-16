# Diseño — módulo de Torneos (Ajuste 4)

Propuesta del equipo de análisis (2026-11-15), basada en el código real de `index.html`.

## 0. Hechos del código que condicionan el diseño
1. `DB.tournaments()` ya existe (agrupa la biblioteca por `event`): los métodos nuevos se llaman `DB.trnList/trnGet/trnSave/trnDelete`.
2. Cada guardado reescribe toda la base (`flush` → `idbPut(db.export())`): el torneo se guarda al terminar cada partida y, en curso, cada 10 medias jugadas o 5 s.
3. Dos niveles de Stockfish en una sola `UciSession` funcionan (cola + `Skill Level` por `go`). Cuidar: hash compartido (→ `ucinewgame` por partida), búsquedas en cola tras cancelar (→ token), Stockfish no ve repeticiones con solo `position fen` (→ `position fen … moves …`), cola compartida con Play/análisis (→ pausar torneo mientras se juega/analiza).
4. Aurora separa Worker por propósito: usar `trn-w` / `trn-b`.
5. `Play` lee `this.setup.engine/level` ~12 veces → accesores `eng()` / `lvl()` para el modo torneo.
6. Motores UCI cargados desde archivo no persisten (id con `Date.now()`); Stockfish 10 necesita CDN; `sf18` solo por http(s).
7. `Play.applyMove` ya da tablas por 50 jugadas, repetición e insuficiencia; falta límite de jugadas.

## A. Datos
`CREATE TABLE IF NOT EXISTS tournaments(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,format TEXT,status TEXT,data TEXT,created_at INTEGER,updated_at INTEGER);` al final de `SCHEMA` (migración automática). Modo local: `mem.tournaments`, `mem.tseq`.

`data` (JSON):
```js
{ v:1, name, format:"rr1"|"rr2"|"ko"|"swiss",
  settings:{ tc:"none"|"3+2"|"5+0"|"10+0", think:"normal"|"rapido", swissRounds, koGames:1|2,
             koArmageddon:true, adjudicate:true, maxMoves:200, openings:"libro"|"variadas", seeding:"orden"|"azar" },
  players:[{ pid, name:"Aurora · Nv 6", kind:"engine"|"human", engine, engineName, level, seed, withdrawn }],
  rounds:[{ n, status, games:[gid] }],
  games:{ [gid]:{ gid, round, board, w, b|null, result:null|"1-0"|"0-1"|"1/2-1/2"|"+-"|"-+"|"bye",
                  reason, status, libId, plies, ko:{match,stage}|null, live:{sans,clock,ts}|null } },
  ko:{ size, bracket:[[{a,b,winner,games:[gid]}]] }|null, current, createdAt, finishedAt }
```
Clasificación recalculada desde `games` en cada render. Partida terminada → `DB.insertGame` con `event`=nombre del torneo, `round`=ronda (eliminatoria: "Cuartos · 2" / "Cuartos · A"), hash con `trn|tid|gid`.

## B. Algoritmos (`tourneyCoreFactory()`, puro, probado en Node)
- **RR 1 vuelta:** método del círculo (Berger); impar → descanso; colores: fijo alterna, resto por equilibrio (menos blancas → blancas; empate → alterna con la última; empate → i%2). Verificar |B−N| ≤ 1 y nunca 3 iguales seguidos (n = 3…16).
- **RR 2 vueltas:** la vuelta repite la ida con colores invertidos.
- **Eliminatoria:** cuadro P = 2^ceil(log2 n), orden de siembra recursivo [1,4,2,3]…, byes para las semillas altas. Mini-match de 2 (colores invertidos); 1–1 → armagedón (colores por sorteo; tablas = gana negras; entre motores blancas ×1,5 de tiempo; usuario con reloj 5:00 vs 4:00). koGames=1: tablas → armagedón.
- **Suizo:** rondas por defecto min(n−1, ceil(log2 n)+1); ronda 1 i vs i+n/2; bye (1 pt) al peor sin bye; emparejamiento por grupos de puntos con backtracking (límite 200 000 nodos, si falla relaja repetición con coste); colores FIDE simplificados.
- **Desempates:** RR → Pts, encuentro directo, Sonneborn-Berger, victorias, victorias con negras, semilla. Suizo → Pts, Buchholz Corte-1, Buchholz, SB, victorias, directo, semilla (bye/no jugada = rival virtual). Eliminatoria → ronda alcanzada, pts, semilla.

## C. Partidas
- Extraer de Play: `engineRequest(engineId, level, chess, {startFen, ply, movetimeCap, mtScale})` y `gameEndReason(chess, plies, maxPlies)` (incluye límite 200 jugadas); Play pasa a usarlas sin cambiar comportamiento.
- `UciSession`: `opts.moves` → `position fen X moves …`; `newGame()` → `ucinewgame` + `isready`.
- **`GameRunner`**: sesiones `trn-w`/`trn-b`; bucle con token; pausa/reanudar; velocidad Normal/Rápido/Saltar (solo cambia retardo y animación, nunca la fuerza); tiempo de reflexión fijo por torneo (Normal = L.mt, Rápido = max(80, L.mt×0,35)); reintentos y jugada legal de respaldo; adjudicación opcional (victoria: desde jugada 30, 4 evals ≥ 800 cp mismo signo por ambos; tablas: desde jugada 60, |cp| ≤ 15 diez medias jugadas; nunca en armagedón ni con Aurora 1–4); aperturas "variadas" (la vuelta repite la apertura de la ida con colores invertidos).
- **`Tourney`** (controlador): torneo activo en `DB.meta("trnActive")`; siguiente partida; al terminar, transacción: insertar en biblioteca, resultado, avanzar eliminatoria / generar ronda suiza, `trnSave`; `announce(...)`. Las partidas de motores de la ronda corren en serie; la del usuario queda pendiente ("Jugar mi partida"); la ronda siguiente empieza al terminar todas. Pausa automática si se juega en Jugar o se analiza; pausa con `document.hidden`.
- **Modo torneo en Play:** `Play.ctx={tid,gid,engine,level,myColor,clock,event,round,oppName,armageddon}`; bloquea motor/nivel/reloj/color/deshacer/FEN/evaluación; "Nueva partida" → "Volver al torneo"; guarda progreso; al terminar `saveToLibrary` con event/round y `Tourney.reportUser(...)`; reanudar tras cerrar la app.

## D. Interfaz
- Nueva pestaña **Torneos** (`#/torneos`, `#/torneos/nuevo`, `#/torneos/7`) con icono trofeo; 4 pestañas caben en la barra inferior (≤360 px: letra 10,5 px).
- Lista de torneos (progreso, estado, abrir/eliminar).
- Asistente en 3 pasos (modal accesible): 1) nombre y formato con sus opciones; 2) participantes (Incluirme + motor/nivel, semillas, 2–16; suizo ≥3); 3) tu reloj, reflexión de motores, adjudicación, aperturas, sembrado, estimación de duración.
- Pantalla del torneo: partida en vivo (tablero, barra de evaluación, tarjetas, jugadas, pausa, Normal/Rápido/Saltar, detener) + pestañas Clasificación / Rondas / Cuadro; botón destacado "Jugar mi partida"; `aria-live` para resultados.

## E. Riesgos principales
Motores ausentes al reanudar (ofrecer cargar / retirar); búsquedas en cola (token); coste de guardado (frecuencia limitada); teléfono en segundo plano (pausa); suizo sin emparejamiento (relajar); nombres repetidos (sufijo "(2)"); eliminar torneo no borra partidas de la biblioteca.

## F. Pasos y tamaño (~1 100 líneas, todo en `index.html`, `<script>` nuevo antes de Play)
1. DB (~35) · 2. Refactor motor (~40) · 3. `TrnCore` + pruebas Node (~300) · 4. `GameRunner` (~170) · 5. `Tourney` (~250) · 6. Modo torneo en Play (~60) · 7. HTML/CSS/icono (~240) · 8. route/bind (~10) · 9. Pruebas navegador y móvil, `sw.js` → `gambito-v5`, publicar.
