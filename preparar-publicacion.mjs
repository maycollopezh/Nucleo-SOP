import fs from 'node:fs/promises';
const files=['index.html','styles.css','engine.js','systems-engine.js','lessons.js','extended-lessons.js','app.js','modules.js','icon.svg','guia.html'];
await fs.mkdir('public',{recursive:true});for(const name of files)await fs.copyFile(name,'public/'+name);console.log('Carpeta public preparada sin archivos privados.');
