# 📋 TAREAS - Instagram Sorteo App

## Objetivo
Implementar alternativas para realizar sorteos en Instagram sin depender de la API de Meta, facilitando el uso y la experiencia del usuario.

---

## Tareas principales

- [x] **Documentar alternativas y plan de trabajo**
+ [x] 1. Importación manual de comentarios
    - [x] Frontend: Campo para pegar o subir comentarios (texto/CSV/Excel) (COMPLETADO)
    - [x] Backend: Procesar datos, filtrar duplicados, sorteo (COMPLETADO)
    - [x] UI: Mostrar ganador y estadísticas (COMPLETADO)
    - [x] Exportar participantes a CSV (COMPLETADO)
 [x] 2. Scraping desde el navegador
    - [x] Frontend: Botón "Extraer comentarios del post abierto" (COMPLETADO)
    - [x] JS: Script para leer comentarios del HTML de Instagram (COMPLETADO)
    - [x] Backend: Recibir y procesar datos extraídos (reutiliza /api/sorteo-manual)


### Documentación del flujo scraping

- El usuario debe abrir el post de Instagram en una pestaña del navegador y estar logueado.
- Desde la app, puede hacer clic en "Extraer comentarios del post abierto".
- Se muestran instrucciones y un script que:
    - Carga automáticamente todos los comentarios visibles (paginando si es necesario).
    - Extrae usuario y texto de cada comentario.
    - Copia los comentarios al portapapeles en formato compatible.
- El usuario vuelve a la app y pega los comentarios para el sorteo.
- No requiere permisos ni API de Meta, pero depende del HTML de Instagram (puede romperse si cambia).
- [ ] 3. Extensión de navegador
    - [ ] Chrome/Firefox: Detectar post abierto y extraer datos
    - [ ] Comunicación con la app para enviar datos
    - [ ] UI: Integración y flujo de usuario

---


## Progreso y notas

- La importación manual ya está completamente funcional:
    - El usuario puede pegar comentarios o subir archivo CSV/TXT.
    - El frontend envía los datos al backend.
    - El backend filtra duplicados y realiza el sorteo.
    - El resultado se muestra en la UI moderna, con ganador y estadísticas.

- Recomendaciones para el usuario:
    - Exporta los comentarios desde Instagram (copiar/pegar o usar herramientas externas).
    - Usa el formato `usuario: comentario` para máxima compatibilidad.

- Siguientes pasos:
    - Refinar la visualización de resultados y la experiencia de usuario.
    - Implementar extensión de navegador como opción avanzada.
    - Actualizar documentación (README, TAREAS) con nuevas funcionalidades y flujos.

---

¿Quieres agregar alguna tarea o priorizar alguna alternativa? ¡Avísame y lo documento aquí!
