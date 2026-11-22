const test=require('node:test'),assert=require('node:assert/strict');const {Memory,integrated,paging}=require('../systems-engine.js');
const P=(id,arrival,burst,memory,priority=1)=>({id,arrival,burst,memory,priority});
test('First, Best y Worst Fit seleccionan huecos por regla y liberan sin perder capacidad',()=>{
 for(const [fit,expected]of [['first',0],['best',600],['worst',0]]){const m=new Memory(1000);m.allocate('A',300);m.allocate('B',300);m.allocate('C',200);m.allocate('D',200);m.release('A');m.release('C');assert.equal(m.allocate('E',150,fit).start,expected);const r=m.snapshot();assert.equal(r.free+r.used,1000);for(const b of [...m.blocks])if(b.id)m.release(b.id);assert.deepEqual(m.blocks,[{start:0,size:1000,id:null}]);}
});
test('Integración separa espera por RAM de espera por CPU',()=>{const r=integrated([P('P1',0,4,300),P('P2',1,2,300)],{capacity:500,algorithm:'fcfs',fit:'first'});assert.equal(r.results[1].memoryWait,3);assert.equal(r.results[1].waiting,0);assert.equal(r.results[1].completion,6);assert.equal(r.snapshots.at(-1).memory.free,500);});
test('Proceso mayor que RAM se rechaza sin bloquear a los demás',()=>{const r=integrated([P('P1',0,3,800),P('P2',1,2,100)],{capacity:500});assert.equal(r.results[0].rejected,true);assert.equal(r.results[1].completion,3);});
test('FIFO y LRU reproducen caso de aceptación de cinco marcos',()=>{for(const a of ['fifo','lru']){const r=paging('7,0,1,2,0,3,0,4,2,3,0,3,2',5,a);assert.equal(r.faults,6);assert.equal(r.hits,7);}});
test('Un acierto cambia el uso reciente de LRU, no el ingreso FIFO',()=>{assert.equal(paging('1,2,1,3',2,'fifo').steps.at(-1).victim,1);assert.equal(paging('1,2,1,3',2,'lru').steps.at(-1).victim,2);});
test('Se rechazan referencias y tamaños inválidos',()=>{assert.throws(()=>paging('1,no,2',3));assert.throws(()=>paging('1',0));assert.throws(()=>integrated([P('P',0,1,0)],{}));});
test('Memoria e integración conservan direcciones, tiempos y trabajo en las cuatro políticas',()=>{
 const ps=[P('A',0,7,250,2),P('B',1,3,220,1),P('C',2,2,180,3),P('D',4,1,100,2)];
 for(const algorithm of ['fcfs','sjf','rr','priority'])for(const fit of ['first','best','worst']){
  const r=integrated(ps,{algorithm,fit,capacity:600,quantum:2});for(const p of ps){const x=r.results.find(x=>x.id===p.id);assert.equal(x.turnaround,p.burst+x.waiting+x.memoryWait);assert.equal(r.timeline.filter(x=>x.id===p.id).length,p.burst);}
  for(const s of r.snapshots){assert.equal(s.memory.free+s.memory.used,600);assert.equal(s.memory.blocks.reduce((n,b)=>n+b.size,0),600);let address=0;for(const b of s.memory.blocks){assert.equal(b.start,address);address+=b.size;}assert.ok(s.processes.filter(p=>p.state==='En CPU').every(p=>s.memory.blocks.some(b=>b.id===p.id)));}
 }
});
