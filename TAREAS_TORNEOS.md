# Tareas — módulo de Torneos (Ajuste 4) · equipo de desarrollo

Diseño aprobado: `DISENO_TORNEOS.md`. Pruebas y fuentes del bloque: `~/Downloads/pruebas_torneos/`
(`aplicar_torneos.py` regenera `index.html` desde `~/Downloads/gambito-index.pre-torneos.html` + `src/`).

| # | Paso | Estado |
|---|---|---|
| 1 | DB: tabla `tournaments` + `trnList/trnGet/trnSave/trnDelete` (SQLite y modo local) | finalizado |
| 2 | Refactor motor: `engineRequest`, `gameEndReason`, `UciSession` (`moves`, `newGame`, búsqueda anulada) | finalizado |
| 3 | `TrnCore` (tourneyCoreFactory) + pruebas Node | finalizado |
| 4 | `GameRunner` | finalizado |
| 5 | `Tourney` (controlador) | finalizado |
| 6 | Modo torneo en Play | finalizado |
| 7 | HTML/CSS/icono (pestaña, lista, asistente, pantalla del torneo) | finalizado |
| 8 | route/bind | finalizado |
| 9 | Pruebas navegador y móvil, `sw.js` → `gambito-v5` | finalizado (falta publicar: lo hace Rhay) |

## Notas / desviaciones
- Ida y vuelta: la vuelta va en orden inverso de rondas (mismas parejas, colores invertidos) para que nunca haya 3 colores iguales seguidos en el cambio de vuelta; con n impar el que descansa en la última ronda de la ida descansa también en la primera de la vuelta.
- Todos contra todos impar: el descanso no es partida ni da puntos (se muestra «descansa»); el bye de 1 punto es solo del suizo.
- «Detener» termina el torneo (estado «Detenido», las partidas pendientes quedan anuladas, clasificación con lo jugado). «Pausa» es la pausa temporal.
- Aperturas «variadas»: solo en partidas motor–motor (la partida del usuario empieza desde la posición inicial). En la vuelta y en la partida 2 de la eliminatoria se repite la apertura.
- La partida del usuario usa el tiempo de reflexión de Play (nivel/reloj), no el ajuste «Reflexión de los motores».
- El torneo se pausa solo mientras se está en la vista Jugar (también en la partida propia del torneo), al analizar en Tablero o con la app en segundo plano.
- Retirar a un jugador (motor no disponible al reanudar): sus partidas pendientes se dan por perdidas (+/−).

---

# Ajuste 5 — Ritmo de juego en torneos · equipo de desarrollo

Plan: formato único `tc = "base+inc"` en **segundos** (`"60+0"`, `"180+2"`, `"900+10"`) o `"none"`. Funciones puras nuevas en `TrnCore`
(`normTc`, `parseTc`, `tcLabel`, `startClock`, `clockMovetime`, `hasMating`, `flagResult`, `estimateSecs`) probadas en Node;
`GameRunner` lleva `clock {w,b}` (solo descuenta el tiempo real de búsqueda, +inc tras cada jugada, bandera con sondeo cada 50 ms),
guardado en `game.live.clock`; `Play` en modo torneo usa `TrnCore.hasMating`; asistente con «Ritmo de juego» siempre visible.

| # | Paso | Estado |
|---|---|---|
| 1 | `TrnCore`: tc normalizado (migra «3+2» en minutos → «180+2»), reloj inicial/armagedón 4/5, movetime con reloj, material de mate, bandera, estimación | finalizado |
| 2 | `GameRunner`: relojes motor–motor, bandera, persistencia en `live.clock`, snapshot al ocultar/cerrar | finalizado |
| 3 | `Tourney`/`TrnUI`: migración de torneos antiguos, relojes en tarjetas en tiempo real, reloj final, ritmo en el subtítulo | finalizado |
| 4 | Asistente paso 3: Ritmo de juego (presets + personalizado con validación), estimación y aviso > 30 min | finalizado |
| 5 | `Play` modo torneo: ritmo del torneo, armagedón 4/5, `hasMating` compartido | finalizado |
| 6 | `sw.js` → `gambito-v6`; `core_test.js` ampliado | finalizado |
| 7 | Verificación: node --check, perft, core_test, navegador (casos a–h), Lighthouse a11y | finalizado |

## Notas / desviaciones (Ajuste 5)
- Formato `tc` en segundos (el que ya usaba el código: "180+2"); `normTc` convierte valores < 30 como minutos ("3+2" → "180+2"). Torneos v1 con ritmo: `settings.tcUserOnly=true` (el ritmo sigue aplicando solo a tus partidas, como cuando se crearon); v1 sin ritmo = "Sin reloj". Torneos nuevos: `v:2`.
- El reloj del motor se descuenta al aplicar la jugada (no al terminar la búsqueda), para que el guardado sea coherente jugadas↔reloj; una búsqueda interrumpida por recarga no se cobra.
- Guardado al ocultar/cerrar: además de IndexedDB, respaldo síncrono en `localStorage["gambito-trnLive"]` (IndexedDB no termina de escribir durante la recarga); al arrancar se aplica si es más reciente.
- Motores con Aurora limitada por profundidad: suelen gastar mucho menos que el movetime, por eso en 1+0 los relojes bajan poco.
- La partida del usuario sigue usando L.mt de Play (sin escala «Reflexión»), con la regla de reloj de Jugar.
- `src/core.js` y `src/runtime.js` regenerados desde index.html; `src/modal.html`/`style.css` NO reflejan el nuevo paso 3 (index.html es la verdad).
