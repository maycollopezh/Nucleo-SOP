/* Motor discreto de una CPU: independiente de la interfaz y de la velocidad visual. */
(function (root) {
  'use strict';
  const RULES = {
    fcfs: 'FCFS atiende por llegada. Un proceso conserva la CPU hasta terminar.',
    sjf: 'SJF elige la duración más corta entre los procesos listos. No interrumpe al activo.',
    rr: 'Round Robin reparte turnos. Las nuevas llegadas entran antes de reinsertar al proceso que agotó su quantum.',
    priority: 'Prioridad elige el mayor número entre los procesos listos. No interrumpe al activo.'
  };
  function validate(processes, algorithm, quantum) {
    if (!Object.hasOwn(RULES, algorithm)) throw new Error('Selecciona un algoritmo disponible.');
    if (!Array.isArray(processes) || processes.length < 1 || processes.length > 8) throw new Error('Usa entre 1 y 8 procesos.');
    if (!Number.isInteger(quantum) || quantum < 1 || quantum > 20) throw new Error('El quantum debe ser un entero entre 1 y 20.');
    const ids = new Set();
    for (const p of processes) {
      if (typeof p.id !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]{0,7}$/.test(p.id)) throw new Error('El ID debe comenzar con una letra y tener hasta 8 letras, números, guiones o guiones bajos.');
      if (ids.has(p.id.toLowerCase())) throw new Error('Cada proceso necesita un ID diferente.');
      ids.add(p.id.toLowerCase());
      if (!Number.isInteger(p.arrival) || p.arrival < 0 || p.arrival > 100) throw new Error('La llegada debe ser un entero entre 0 y 100.');
      if (!Number.isInteger(p.burst) || p.burst < 1 || p.burst > 50) throw new Error('La duración debe ser un entero entre 1 y 50.');
      if (!Number.isInteger(p.priority) || p.priority < 1 || p.priority > 9) throw new Error('La prioridad debe ser un entero entre 1 y 9.');
    }
  }
  function simulate(processes, algorithm = 'rr', quantum = 2) {
    validate(processes, algorithm, quantum);
    const ps = processes.map((p, order) => ({ ...p, order, remaining: p.burst, completion: null, firstRun: null }));
    let time = 0, current = null, slice = 0, ready = [], timeline = [], snapshots = [], finished = 0;
    const sorted = [...ps].sort((a,b) => a.arrival-b.arrival || a.order-b.order);
    const tie = (a,b) => a.arrival-b.arrival || a.order-b.order;
    function boundary(expired, events) {
      for (const p of sorted.filter(p => p.arrival === time)) { ready.push(p); events.push(`${p.id} llega y entra en la cola de listos.`); }
      if (expired) { ready.push(expired); events.push(`${expired.id} agotó su turno de ${quantum} unidades y vuelve a la cola.`); }
      if (algorithm === 'sjf') ready.sort((a,b) => a.burst-b.burst || tie(a,b));
        if (algorithm === 'priority') ready.sort((a,b) => b.priority-a.priority || tie(a,b));
      if (!current && ready.length) {
        current = ready.shift(); slice = 0;
        if (current.firstRun === null) current.firstRun = time;
        events.push(`${current.id} recibe la CPU${algorithm === 'sjf' ? ': tiene la menor duración entre los listos' : algorithm === 'priority' ? ': tiene la mayor prioridad disponible' : ''}.`);
      }
      if (!current && finished < ps.length) events.push('La CPU está libre: todavía no hay procesos listos.');
    }
    function capture(events) {
      snapshots.push({ time, current: current?.id || null, queue: ready.map(p=>p.id), events, finished,
        processes: ps.map(p=>({...p, state: p.completion !== null ? 'Terminado' : current === p ? 'En CPU' : p.arrival > time ? 'Por llegar' : 'Listo'})) });
    }
    let events = []; boundary(null, events); capture(events);
    while (finished < ps.length) {
      const ran = current;
      timeline.push({time, id: ran?.id || null});
      if (ran) { ran.remaining--; slice++; }
      time++; events = []; let expired = null;
      if (ran && ran.remaining === 0) {
        ran.completion = time; finished++; events.push(`${ran.id} termina en t=${time}. Ejecutó sus ${ran.burst} unidades.`); current = null;
      } else if (ran && algorithm === 'rr' && slice === quantum) { expired = ran; current = null; }
      boundary(expired, events);
      if (!events.length && current) events.push(`${current.id} continúa en la CPU. Le quedan ${current.remaining} unidades.`);
      if (finished === ps.length) events.push('¡Todos los procesos terminaron! Ya puedes comparar sus tiempos.');
      capture(events);
    }
    const results = ps.map(p=>({id:p.id, completion:p.completion, turnaround:p.completion-p.arrival, waiting:p.completion-p.arrival-p.burst, response:p.firstRun-p.arrival}));
    return {snapshots,timeline,results,duration:time, averageWaiting:results.reduce((s,p)=>s+p.waiting,0)/ps.length, averageTurnaround:results.reduce((s,p)=>s+p.turnaround,0)/ps.length};
  }
  const api = {simulate,validate,RULES};
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
  else root.CPUEngine=api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
