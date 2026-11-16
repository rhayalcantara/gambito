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
