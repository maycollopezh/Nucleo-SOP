const test = require('node:test');
const assert = require('node:assert/strict');
const {simulate} = require('../engine.js');
const p=(id,arrival,burst,priority=1)=>({id,arrival,burst,priority});
const order=r=>r.timeline.map(x=>x.id);
test('FCFS: llegada, espera y retorno con resultado calculado a mano',()=>{
 const r=simulate([p('P1',0,5),p('P2',1,1)],'fcfs',2);
 assert.deepEqual(order(r),['P1','P1','P1','P1','P1','P2']);
 assert.deepEqual(r.results.map(x=>[x.completion,x.turnaround,x.waiting]),[[5,5,0],[6,5,4]]);
});
test('Round Robin: caso de aceptación del informe Hito 2',()=>{
 const r=simulate([p('P1',0,4),p('P2',1,3)],'rr',2);
 assert.deepEqual(order(r),['P1','P1','P2','P2','P1','P1','P2']);
 assert.deepEqual(r.results.map(x=>x.completion),[6,7]);
});
test('RR: nuevas llegadas en el límite entran antes de reinsertar',()=>{
 const r=simulate([p('P1',0,4),p('P2',2,1)],'rr',2);
 assert.deepEqual(order(r),['P1','P1','P2','P1','P1']);
});
test('RR: finalizar antes del quantum libera la CPU sin esperar',()=>{
 assert.deepEqual(order(simulate([p('P1',0,1),p('P2',0,2)],'rr',3)),['P1','P2','P2']);
});
test('SJF: selecciona solo entre listos y no interrumpe al activo',()=>{
 const r=simulate([p('P1',0,4),p('P2',1,1),p('P3',0,6)],'sjf',2);
 assert.deepEqual(order(r),['P1','P1','P1','P1','P2',...Array(6).fill('P3')]);
});
test('SJF: empate por llegada y luego orden de registro',()=>{
 const r=simulate([p('P1',0,2),p('P2',0,2),p('P3',1,2)],'sjf',2);
 assert.deepEqual(order(r),['P1','P1','P2','P2','P3','P3']);
});
test('Prioridad: mayor número y sin interrupción',()=>{
 const r=simulate([p('P1',0,3,1),p('P2',1,1,9),p('P3',0,2,2)],'priority',2);
 assert.deepEqual(order(r),['P3','P3','P2','P1','P1','P1']);
});
test('CPU ociosa antes y entre llegadas',()=>{
 const r=simulate([p('P1',2,1),p('P2',5,1)],'fcfs',2);
 assert.deepEqual(order(r),[null,null,'P1',null,null,'P2']);
 assert.deepEqual(r.results.map(x=>x.waiting),[0,0]);
});
test('Datos inválidos no producen una simulación',()=>{
 for(const ps of [[],[p('X',0,0)],[p('X',-1,1)],[p('X',.5,1)],[p('X',0,1,0)],[p('X',0,1),p('x',0,1)],[p('<script>',0,1)]])assert.throws(()=>simulate(ps));
 assert.throws(()=>simulate([p('P',0,1)],'rr',0));
 assert.throws(()=>simulate([p('P',0,1)],'bad',2));
});
test('400 ejercicios: conservación de trabajo, estados, esperas y consistencia temporal',()=>{
 let seed=411;const rand=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};
 for(let i=0;i<100;i++){
  const ps=Array.from({length:1+rand(8)},(_,j)=>p('P'+j,rand(15),1+rand(12),1+rand(9)));
  for(const alg of ['fcfs','sjf','rr','priority']){
   const r=simulate(ps,alg,1+rand(6));assert.equal(r.snapshots.length,r.duration+1);
   for(const proc of ps){
    assert.equal(r.timeline.filter(x=>x.id===proc.id).length,proc.burst);
    const result=r.results.find(x=>x.id===proc.id);assert.ok(result.waiting>=0);
    assert.equal(result.completion,r.timeline.findLast(x=>x.id===proc.id).time+1);
    assert.equal(result.waiting,r.snapshots.slice(0,-1).filter(s=>s.queue.includes(proc.id)).length);
   }
   for(const s of r.snapshots){
    assert.equal(new Set(s.queue).size,s.queue.length);
    assert.ok(!s.queue.includes(s.current));
    assert.equal(s.processes.filter(p=>p.state==='En CPU').length,s.current?1:0);
    assert.ok(s.processes.every(p=>p.remaining>=0));
    if(!s.current)assert.equal(s.queue.length,0);
   }
  }
 }
});
