import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {api} from './backend/api.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const staticFiles=new Set(['index.html','styles.css','app.js','engine.js','systems-engine.js','lessons.js','extended-lessons.js','modules.js','icon.svg','guia.html']);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
export const server=http.createServer(async(req,res)=>{
 try{
  const u=new URL(req.url,'http://'+req.headers.host);let response;
  if(u.pathname.startsWith('/api/')){
   const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>50000){res.writeHead(413);res.end('Solicitud demasiado grande');return;}chunks.push(chunk);}
   const body=Buffer.concat(chunks);response=await api(new Request(u,{method:req.method,headers:req.headers,...(body.length?{body}:{} )}));
  }else{
   const name=u.pathname==='/'?'index.html':u.pathname.slice(1);if(!staticFiles.has(name))response=new Response('No encontrado',{status:404});
   else response=new Response(await fs.readFile(path.join(root,name)),{headers:{'content-type':types[path.extname(name)]||'application/octet-stream','cache-control':'no-cache'}});
  }
  res.writeHead(response.status,{...Object.fromEntries(response.headers),'x-content-type-options':'nosniff','referrer-policy':'same-origin','x-frame-options':'SAMEORIGIN','content-security-policy':"default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"});res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('No fue posible atender la solicitud.');}
});
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(Number(process.env.PORT)||8080,'127.0.0.1',()=>console.log('Núcleo disponible en http://127.0.0.1:'+(process.env.PORT||8080)));
