/* Modelos educativos deterministas. Una CPU, memoria contigua y reemplazo de páginas. */
(function(root){
'use strict';
const cpu=typeof module!=='undefined'&&module.exports?require('./engine.js'):root.CPUEngine;
function integer(v,min,max,label){if(!Number.isInteger(v)||v<min||v>max)throw new Error(`${label}: usa un entero entre ${min} y ${max}.`);}
class Memory {
 constructor(capacity){integer(capacity,1,100000,'Capacidad');this.capacity=capacity;this.blocks=[{start:0,size:capacity,id:null}];}
 allocate(id,size,fit='first'){
  integer(size,1,100000,'Memoria');if(!['first','best','worst'].includes(fit))throw new Error('Asignación desconocida.');
  if(this.blocks.some(b=>b.id===id))throw new Error('El proceso ya tiene memoria.');
  let holes=this.blocks.filter(b=>b.id===null&&b.size>=size);
  if(fit==='best')holes.sort((a,b)=>a.size-b.size||a.start-b.start);
  if(fit==='worst')holes.sort((a,b)=>b.size-a.size||a.start-b.start);
  const hole=holes[0];if(!hole)return null;
  const index=this.blocks.indexOf(hole), allocated={start:hole.start,size,id};
  this.blocks.splice(index,1,allocated,...(hole.size>size?[{start:hole.start+size,size:hole.size-size,id:null}]:[]));return {...allocated};
 }
 release(id){let changed=false;this.blocks.forEach(b=>{if(b.id===id){b.id=null;changed=true;}});for(let i=0;i<this.blocks.length-1;){const a=this.blocks[i],b=this.blocks[i+1];if(a.id===null&&b.id===null&&a.start+a.size===b.start){a.size+=b.size;this.blocks.splice(i+1,1);}else i++;}return changed;}
 snapshot(){const holes=this.blocks.filter(b=>b.id===null),free=holes.reduce((s,b)=>s+b.size,0);return {capacity:this.capacity,blocks:this.blocks.map(b=>({...b})),free,used:this.capacity-free,largest:Math.max(0,...holes.map(b=>b.size)),external:free-Math.max(0,...holes.map(b=>b.size))};}
}
function integrated(processes,{algorithm='rr',quantum=2,capacity=1000,fit='first'}={}){
 cpu.validate(processes,algorithm,quantum);integer(capacity,1,100000,'Capacidad');
 if(!['first','best','worst'].includes(fit))throw new Error('Selecciona First Fit, Best Fit o Worst Fit.');
 const ps=processes.map((p,order)=>{integer(p.memory,1,100000,'Memoria del proceso');return {...p,order,remaining:p.burst,completion:null,admitted:null,cpuWait:0,memoryWait:0,rejected:p.memory>capacity};});
 const mem=new Memory(capacity),snapshots=[],timeline=[];let t=0,current=null,slice=0,queue=[],done=0;
 const tie=(a,b)=>a.arrival-b.arrival||a.order-b.order;
 function boundary(expired,events){
  for(const p of ps.filter(p=>p.arrival===t).sort(tie)){
   if(p.rejected){events.push(`${p.id} no es admisible: pide ${p.memory} KB y la capacidad es ${capacity} KB.`);done++;}
   else events.push(`${p.id} llega y solicita ${p.memory} KB.`);
  }
  for(const p of ps.filter(p=>!p.rejected&&p.arrival<=t&&p.admitted===null).sort(tie)){
   const b=mem.allocate(p.id,p.memory,fit);
   if(b){p.admitted=t;queue.push(p);events.push(`${p.id} obtiene ${p.memory} KB desde la dirección ${b.start} y pasa a listos.`);}
  }
  if(expired){queue.push(expired);events.push(`${expired.id} agota el quantum y regresa al final de listos.`);}
  if(algorithm==='sjf')queue.sort((a,b)=>a.burst-b.burst||tie(a,b));
  if(algorithm==='priority')queue.sort((a,b)=>b.priority-a.priority||tie(a,b));
  if(!current&&queue.length){current=queue.shift();slice=0;events.push(`${current.id} recibe CPU.`);}
  if(!events.length)events.push(current?`${current.id} continúa ejecutando. Le quedan ${current.remaining} unidades.`:'La CPU está ociosa mientras espera nuevas llegadas.');
 }
 function capture(events){snapshots.push({time:t,current:current?.id||null,queue:queue.map(p=>p.id),events,memory:mem.snapshot(),processes:ps.map(p=>({...p,state:p.arrival>t?'Por llegar':p.rejected?'No admisible':p.completion!==null?'Terminado':p.admitted===null?'Espera RAM':current===p?'En CPU':'Listo'}))});}
 let events=[];boundary(null,events);capture(events);
 while(done<ps.length){
  if(t>10000)throw new Error('El ejercicio superó el límite de tiempo simulado.');
  timeline.push({time:t,id:current?.id||null});
  for(const p of ps){if(p.arrival<=t&&!p.rejected&&p.completion===null){if(p.admitted===null)p.memoryWait++;else if(p!==current)p.cpuWait++;}}
  if(current){current.remaining--;slice++;}t++;events=[];let expired=null;
  if(current&&current.remaining===0){current.completion=t;done++;mem.release(current.id);events.push(`${current.id} termina en t=${t} y libera ${current.memory} KB.`);current=null;}
  else if(current&&algorithm==='rr'&&slice===quantum){expired=current;current=null;}
  boundary(expired,events);if(done===ps.length)events.push('Ejercicio completo. La memoria de los procesos terminados quedó libre.');capture(events);
 }
 const results=ps.map(p=>({id:p.id,rejected:p.rejected,completion:p.completion,turnaround:p.completion===null?null:p.completion-p.arrival,waiting:p.cpuWait,memoryWait:p.memoryWait}));
 return {snapshots,timeline,results,duration:t};
}
function paging(references,frames=3,algorithm='fifo'){
 integer(frames,1,10,'Marcos');if(!['fifo','lru'].includes(algorithm))throw new Error('Selecciona FIFO o LRU.');
 const refs=typeof references==='string'?references.trim().split(/[\s,;]+/).filter(Boolean).map(v=>/^\d+$/.test(v)?Number(v):NaN):references;
 if(!Array.isArray(refs)||refs.length<1||refs.length>150||refs.some(v=>!Number.isInteger(v)||v<0||v>999))throw new Error('Ingresa entre 1 y 150 referencias enteras de 0 a 999.');
 const slots=Array(frames).fill(null),age=new Map();let clock=0,faults=0,hits=0;const steps=[];
 for(const ref of refs){clock++;let index=slots.indexOf(ref),victim=null,hit=index>=0;
  if(hit){hits++;if(algorithm==='lru')age.set(ref,clock);}
  else{faults++;index=slots.indexOf(null);if(index<0){victim=[...age.entries()].sort((a,b)=>a[1]-b[1])[0][0];index=slots.indexOf(victim);age.delete(victim);}slots[index]=ref;age.set(ref,clock);}
  steps.push({reference:ref,frames:[...slots],hit,victim,index,faults,hits,explanation:hit?`La página ${ref} ya estaba en el marco ${index+1}: acierto.`:victim===null?`La página ${ref} ocupa un marco libre: fallo de página.`:`Sale la página ${victim}, ${algorithm==='fifo'?'la que ingresó primero':'la que lleva más tiempo sin usarse'}. Entra ${ref}: fallo de página.`});
 }
 return {steps,faults,hits,rate:faults/refs.length};
}
const api={Memory,integrated,paging};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SystemsEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
