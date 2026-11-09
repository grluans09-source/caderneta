/* Gera os arquivos de referência do redesign (Fase A), a partir da versão de antes do redesign.
   Uso (só uma vez, na 1.24.1): node tests/golden/gerar.js
   - golden-1.24.1.json: todos os valores calculados com a massa de teste
   - copia-1.24.1.json: uma cópia de segurança no formato do app, para testar que ela continua sendo restaurada */
const fs=require("fs"),path=require("path");
const {preparar}=require("../preparar");
const {abrirFixture}=require("./fixture");
const {capturar}=require("./capturar");
const html=fs.readFileSync(preparar(),"utf8"), erros=[];
const w=abrirFixture(html,erros), T=w.__T;
const g=capturar(T);
if(erros.length)throw new Error("erros de script: "+erros.join(" | "));
fs.writeFileSync(path.join(__dirname,"golden-1.24.1.json"),JSON.stringify(g,null,1));
const S=T.S();
fs.writeFileSync(path.join(__dirname,"copia-1.24.1.json"),JSON.stringify({app:"caderneta",versao:2,appVersao:"1.24.1-beta.1",dados:S},null,1));
console.log("golden gravado:",Object.keys(g).length,"grupos;",Object.keys(g.perguntas).length,"respostas;",g.indicadores.length,"indicadores");
