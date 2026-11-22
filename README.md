# Núcleo

Plataforma educativa de Sistemas Operativos con 12 lecciones, explorador, diccionario, simuladores de CPU, memoria contigua integrada y reemplazo de páginas, apuntes, cuentas, historial y tutor OpenAI.

## Ejecutar

Requiere Node.js 22 o superior. No hay paquetes que instalar.

```sh
npm start
```

Abrir http://127.0.0.1:8080. En macOS también puede ejecutarse Iniciar_Nucleo.command; en Windows, Iniciar_Nucleo.bat. El servidor debe permanecer abierto. Esta versión incluye un servidor: abrir index.html directamente no habilita cuentas ni tutor.

La configuración de este equipo se conserva en `.env.local`, con permisos privados. Nunca copiar ese archivo a un sitio público, chat, presentación o repositorio. `.env.example` enumera las variables para otro entorno sin incluir valores secretos.

## Módulos

- Mi ruta: 12 lecciones, analogías, prácticas y preguntas con reintentos.
- Explorar: CPU, RAM, almacenamiento y sistema operativo.
- Laboratorio CPU: FCFS, SJF no expropiativo, Round Robin y Prioridad no expropiativa. Mayor número implica mayor prioridad. Empates por llegada y registro.
- CPU y RAM: First Fit, Best Fit y Worst Fit, asignación, liberación, unión de huecos contiguos y separación de esperas. Las llegadas entran antes de reinsertar el proceso que agotó quantum.
- Paginación: FIFO y LRU, aciertos, fallos, tasa y comparación.
- Apuntes: crear, consultar, editar, descargar y eliminar textos. Invitado en localStorage; cuenta en Supabase.
- Cuenta: registro, inicio, confirmación de correo, recuperación de contraseña, progreso sincronizado e historial de ejercicios.
- Tutor Bit: Responses API. El servidor recalcula el contexto del ejercicio y mantiene la clave fuera del navegador.

## Base de datos

Proyecto nuevo de Supabase: `tjxlxfeklbqlhhygtfpc`. Tablas:

- learning_progress: lecciones, logro CPU y logros de los otros laboratorios.
- study_files: textos por usuario.
- simulation_history: configuración y resumen calculado en el servidor.

El esquema instalado está en `supabase/schema.sql`. La migración se aplica una sola vez en una base nueva. Las tres tablas tienen RLS y políticas que comprueban `auth.uid() = user_id`. El rol anónimo no tiene permiso de lectura. La aplicación utiliza la clave publicable, nunca service_role. El servidor protege las sesiones con cookies HttpOnly, cifradas y SameSite, y valida el origen de los cambios.

La URL de retorno configurada en Supabase es http://127.0.0.1:8080. Tras publicar, se debe añadir el origen final y cambiar Site URL para confirmación y recuperación en producción. No desactivar la confirmación de correo para ocultar problemas de entrega.

## Reglas y límites

Una CPU, una ráfaga por proceso, tiempos discretos, sin E/S, swapping, compactación ni costo de cambio de contexto. Paginación es independiente de CPU y RAM contigua. Máximo 8 procesos, llegadas 0–100, duración 1–50, prioridad 1–9, quantum 1–20, capacidad y solicitudes de 1–100.000 KB. La cadena de páginas admite 1–150 referencias de 0–999 y 1–10 marcos.

Retorno = finalización − llegada. CPU aislada: espera = retorno − duración. Integrado: retorno = duración + espera CPU + espera RAM. Los procesos mayores que la capacidad se marcan no admisibles.

El progreso del modo invitado se mantiene separado del de cada cuenta. Para combinar las lecciones se requiere pulsar Importar en Mi cuenta. Los textos de invitado no se suben automáticamente. El historial conserva hasta los últimos 30 ejercicios consultados en pantalla.

## Comprobaciones

```sh
npm test
```

Las pruebas cubren casos conocidos, conservación de trabajo y memoria, orden de eventos, separación de esperas, reemplazo de páginas, validaciones y protecciones del servidor. La prueba original incluye 400 simulaciones deterministas.

La validación con estudiantes reales no se sustituye por pruebas automáticas. Sigue siendo una actividad de evaluación educativa a realizar antes de afirmar resultados de aprendizaje.

## Publicación

Se incluye configuración para Netlify con funciones de servidor. Ejecutar `node preparar-publicacion.mjs` genera `public/` a partir de una lista permitida. El archivo netlify.toml usa esa carpeta y las funciones de netlify/functions. No publicar la carpeta raíz ni .env.local como archivos estáticos.

Configurar en el servicio de hosting las variables OPENAI_API_KEY, OPENAI_MODEL, SUPABASE_URL, SUPABASE_ANON_KEY y SESSION_SECRET. SESSION_SECRET debe tener al menos 32 caracteres aleatorios y mantenerse estable para conservar las sesiones. Temporalmente, Bit está disponible para todos sin iniciar sesión, incluso en producción. Para volver a exigir cuenta, configurar BIT_REQUIRE_LOGIN=true en Netlify y volver a desplegar. Las cuentas y sus datos siguen requiriendo sesión. El tutor tiene límites básicos por minuto en el proceso del servidor. Para una publicación de alto tráfico se requiere un límite de cuota centralizado y presupuesto de uso.

La clave suministrada tiene la vigencia configurada en OpenAI Platform. Si expira o se revoca, debe reemplazarse en el entorno del servidor. No se incluye en paquetes de distribución.

## Fuentes de integración

- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://developers.openai.com/api/reference/resources/responses/methods/create

Los informes y diapositivas del Hito 3 se conservan como documentación de esa entrega; no describen las funciones añadidas después.
# Nucleo-SOP
