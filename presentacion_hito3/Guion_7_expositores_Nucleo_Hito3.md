# Núcleo — Guion de exposición del Hito 3

Duración orientativa: 13 minutos. Los tiempos se ajustan durante el ensayo. La distribución organiza la exposición y no representa porcentajes de trabajo individual.

| Persona | Diapositivas | Tema | Tiempo aproximado |
|---|---|---|---|
| Flavio | 1–2 | Apertura y problema | 1:25 |
| Isaura | 3–4 | Componentes y procesos | 1:30 |
| Jhissel | 5–6 | Ruta y experiencia educativa | 1:30 |
| Nancy | 7–8 | Algoritmos y ejemplo Round Robin | 1:40 |
| Luis | 9–10 | Arquitectura y avance funcional | 1:30 |
| Karla | 11–12 | Alcance y próximos hitos | 1:30 |
| Maycol | 13–14 | Demostración y cierre | 3:50 |

## 1. Núcleo

**Flavio · 0:25**

Buenas tardes. Somos el equipo de Núcleo, nuestro proyecto de Sistemas Operativos. En el Hito 2 planteamos un simulador de planificación y memoria. En este Hito 3 construimos una primera experiencia funcional para principiantes: explica los conceptos y permite experimentar con la CPU. Presentaremos el enfoque educativo, lo que ya funciona y lo que ampliaremos en las próximas entregas.

## 2. El primer contacto con Sistemas Operativos

**Flavio · 1:00**

Cuando una persona comienza, palabras como quantum o cola de listos pueden parecer difíciles. Una tabla puede mostrar resultados, pero no siempre ayuda a entender por qué cambia el turno de un proceso. Este es el problema que queremos atender. Núcleo combina explicaciones breves con ejercicios donde el estudiante puede observar cada decisión. Nuestro objetivo es facilitar la comprensión. Todavía debemos validar ese aporte con estudiantes nuevos, por eso no afirmamos que ya hayamos medido una mejora del aprendizaje. Isaura explicará los conceptos que sirven de base.

## 3. CPU, RAM y almacenamiento

**Isaura · 0:45**

La CPU ejecuta instrucciones. La RAM mantiene temporalmente datos e instrucciones en uso. El almacenamiento conserva los archivos guardados incluso al apagar el equipo. Podemos compararlo con una mesa de estudio: la persona realiza el trabajo, la mesa sostiene lo que está usando y una estantería conserva los materiales. Es una analogía inicial. El explorador permite seleccionar cada componente y leer una explicación con un ejemplo. La gestión real de bloques de memoria está prevista para el Hito 4.

## 4. El viaje de un proceso

**Isaura · 0:45**

Un programa es un conjunto de instrucciones. Un proceso es una instancia de ese programa en ejecución con estado y recursos. El recorrido comienza con un programa guardado. Al abrirlo, el sistema operativo prepara el proceso y sus recursos. Si está listo, espera un turno y luego ejecuta en la CPU. En nuestro ejercicio cada proceso tiene una sola ráfaga y termina al completarla. Un proceso listo puede estar esperando sin ejecutar. Ahora Jhissel mostrará cómo organizamos el aprendizaje de estas ideas.

## 5. Una ruta para comenzar desde cero

**Jhissel · 0:45**

La ruta contiene seis lecciones. Comienza con los componentes y la diferencia entre programa y proceso. Después presenta FCFS, SJF, Round Robin y Prioridad. Cada lección tiene una explicación, una analogía, una demostración y dos preguntas. El estudiante puede seguir la secuencia recomendada o volver a un tema. El progreso y los puntos se guardan en el navegador. Los puntos reconocen la actividad completada, no son una medición científica de cuánto aprendió la persona.

## 6. Aprender con retroalimentación

**Jhissel · 0:45**

La experiencia pide que el estudiante participe. Puede manipular una demostración y responder una pregunta. Si se equivoca, recibe una explicación y puede intentar otra vez, sin perder vidas. Bit acompaña con mensajes, y el diccionario aclara conceptos como retorno o quantum. En el laboratorio también se puede predecir quién quedará en la CPU antes de avanzar. Esta ayuda está escrita en la aplicación. El tutor con inteligencia artificial se incorporará en el Hito 4. Nancy explicará las reglas de planificación.

## 7. Cuatro reglas para compartir una CPU

**Nancy · 0:50**

El laboratorio incluye cuatro políticas. FCFS atiende por orden de llegada. SJF selecciona la menor duración entre los procesos listos. Round Robin reparte turnos limitados por un quantum. Prioridad elige al proceso listo con el número más alto. SJF y Prioridad no interrumpen al proceso activo en esta versión. Los empates se resuelven por llegada y después por orden de registro. Estas reglas son visibles para que el estudiante pueda explicar los resultados y comparar el mismo ejercicio.

## 8. Round Robin, paso a paso

**Nancy · 0:50**

Este es el caso del informe del Hito 2. P1 llega en cero y dura cuatro unidades. P2 llega en uno y dura tres. Con quantum dos, P1 ejecuta de cero a dos, P2 de dos a cuatro, P1 de cuatro a seis y P2 de seis a siete. P1 finaliza en seis y P2 en siete. El retorno es finalización menos llegada. La espera es retorno menos duración porque aquí no hay bloqueos. Sus esperas son dos y tres unidades respectivamente. Luis explicará cómo el sistema calcula y muestra este recorrido.

## 9. Cómo construimos la simulación

**Luis · 0:45**

La aplicación funciona con HTML, CSS y JavaScript en el navegador. Separamos el contenido educativo, la interacción visual y el motor de planificación. El motor calcula una secuencia de estados del reloj simulado. La interfaz muestra la cola, el proceso activo y la historia de ejecución. Cambiar la velocidad visual solo cambia el ritmo de reproducción, no las cuentas. El progreso utiliza localStorage del navegador. En esta entrega no se necesita una base de datos ni una conexión con OpenAI.

## 10. El avance funcional del Hito 3

**Luis · 0:45**

Ya contamos con seis lecciones, el explorador y el diccionario. El laboratorio permite agregar, editar y eliminar procesos, reproducir, pausar, avanzar, retroceder y comparar los cuatro algoritmos. Se comprobaron casos conocidos y reglas de consistencia como que cada proceso ejecute exactamente su duración. Esto valida aspectos del cálculo. La revisión con estudiantes nuevos sigue pendiente. El cincuenta por ciento es la meta de alcance de esta entrega, no una medición automática de desarrollo ni un porcentaje de aprendizaje. Karla presentará los límites y las próximas entregas.

## 11. Alcance de esta entrega

**Karla · 0:40**

Nuestro laboratorio representa una CPU y una ráfaga por proceso. Usa tiempo simulado y duraciones conocidas. No agrega costo por cambiar de proceso ni representa entrada y salida o bloqueos. El explorador explica RAM y almacenamiento de forma conceptual. La asignación y liberación de memoria, la paginación y los archivos simulados todavía corresponden al Hito 4. Los datos de progreso se mantienen en el navegador actual. Estas condiciones permiten explicar con precisión qué muestra el sistema.

## 12. Hitos 4 y 5

**Karla · 0:50**

En el Hito 4 incorporaremos memoria contigua, paginación, archivos y su integración. También planeamos Supabase para cuentas y progreso entre dispositivos, y un tutor OpenAI que explique el estado real del ejercicio. El motor seguirá calculando las respuestas. Para el Hito 5 completaremos contenidos, probaremos la experiencia con estudiantes nuevos y ajustaremos lo que les resulte difícil. Después realizaremos la publicación y la documentación final. A continuación Maycol hará la demostración del sistema que ya tenemos.

## 13. Demostración del sistema

**Maycol · 3:15**

Ahora mostraré el recorrido de un estudiante. Primero abrimos Mi ruta y entramos a la primera lección para ver la explicación y su actividad. Luego, en Explorar, seleccionamos RAM para distinguirla del almacenamiento. Finalmente entramos al Laboratorio y usamos Guíame. Con el ejemplo inicial y Round Robin, quantum dos, avanzamos hasta t igual a dos. P2 recibe la CPU, mientras P3 y P1 quedan listos. Observamos la explicación de Bit. Después hacemos una predicción, reproducimos hasta terminar y comparamos los cuatro algoritmos con los mismos datos. El resultado cambia por la política de planificación, no por el ritmo de la animación.

## 14. Lo que hoy puede hacer el estudiante

**Maycol · 0:35**

En esta primera entrega el estudiante puede explorar conceptos, seguir una lección y observar cómo cada regla reparte la CPU. Puede equivocarse, leer una explicación y volver a intentarlo. El siguiente paso es integrar los módulos del Hito 4 y comprobar con estudiantes nuevos si la experiencia se entiende. Nuestro propósito es que puedan explicar lo que sucede dentro de la computadora con ejemplos visibles. Muchas gracias. Quedamos atentos a sus preguntas.

## Demostración de Maycol: recorrido exacto

Preparar el sistema antes de comenzar y mantener abierta la pestaña del navegador. Si el servidor de vista previa no está activo, consultar README.md del proyecto. También se puede abrir index.html directamente, con las limitaciones de guardado indicadas en esa guía.

1. En Mi ruta, abrir «Tu computadora, por dentro». Mostrar la explicación y pulsar Continuar para enseñar la actividad con componentes. No es necesario resolver toda la lección.
2. Abrir Explorar y seleccionar RAM. Explicar que su representación actual es conceptual.
3. Abrir Laboratorio, pulsar «Restaurar ejemplo inicial» y después «Guíame». Mostrar brevemente la ayuda y cerrarla.
4. Con Round Robin y quantum 2, pulsar «Un paso» dos veces. En t=2, P2 queda en CPU y la cola contiene P3 y P1. Explicar que las nuevas llegadas entran antes de reinsertar a P1.
5. En la pregunta de predicción para t=3, elegir P2 y leer la explicación.
6. Cambiar el ritmo a Rápido y reproducir hasta terminar en t=9. P1 finaliza en 8, P2 en 9 y P3 en 6.
7. Pulsar «Comparar los cuatro algoritmos». Con este ejemplo, la espera media es 2,67 para FCFS, 2,33 para SJF, 3,67 para Round Robin y 2,33 para Prioridad. No afirmar que un algoritmo siempre es mejor.
8. Volver a la diapositiva 14 para cerrar.

El ejemplo de la diapositiva 8 tiene DOS procesos y reproduce el informe del Hito 2. La demostración usa el ejemplo inicial de TRES procesos del sistema, por eso sus tiempos son diferentes.

## Respuestas breves para preguntas

- **¿Ya usa IA?** Aún no. Bit muestra explicaciones preparadas y datos del motor. El tutor OpenAI se planifica para el Hito 4.
- **¿Tiene base de datos?** Esta entrega guarda progreso en el navegador. Supabase se incorporará en el Hito 4 para cuentas y sincronización.
- **¿Controla los procesos reales del equipo?** Es una simulación educativa. Los datos y tiempos pertenecen al ejercicio.
- **¿Ya está implementada la memoria?** Hay contenido conceptual de RAM y almacenamiento. La asignación y liberación de bloques, la paginación y su integración pertenecen al Hito 4.
- **¿Está comprobado que mejora el aprendizaje?** La propuesta busca facilitarlo. La validación con estudiantes nuevos está prevista para la fase final.
- **¿Por qué dicen 50%?** Es la meta acordada de alcance del Hito 3. No representa una medición automática de avance ni un porcentaje de aprendizaje.

## Preparación

Ensayar los cambios de expositor, comprobar que el navegador y la presentación estén abiertos y usar las capturas de las diapositivas como apoyo si la demostración tiene algún inconveniente. Los guiones también aparecen en las notas de cada diapositiva.
