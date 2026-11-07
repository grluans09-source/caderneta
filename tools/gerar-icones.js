// gera PNGs do ícone sem dependências (zlib + CRC)
const zlib=require("zlib"),fs=require("fs"),path=require("path");
const out=process.argv[2];
function crc(buf){let c,t=[];for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}
  let r=0xffffffff;for(const b of buf)r=t[(r^b)&255]^(r>>>8);return(r^0xffffffff)>>>0}
function chunk(t,d){const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c])}
function png(w,px){const raw=Buffer.alloc((w*4+1)*w);for(let y=0;y<w;y++){raw[y*(w*4+1)]=0;px.copy(raw,y*(w*4+1)+1,y*w*4,(y+1)*w*4)}
  const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(w,4);ih[8]=8;ih[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ih),chunk("IDAT",zlib.deflateSync(raw)),chunk("IEND",Buffer.alloc(0))])}
function hex(h){return[1,3,5].map(i=>parseInt(h.slice(i,i+2),16))}
// desenha em coordenadas 0..512 com 3x3 supersampling
function render(w,maskable){
  const px=Buffer.alloc(w*w*4);
  const INK=hex("#0A0A0A"),PAP=hex("#FFFFFF"),OURO=hex("#C9A227"),VERDE=hex("#C9A227"),BR=hex("#0A0A0A");
  const s=maskable?0.78:1, off=(512-512*s)/2;
  function rr(x,y,x0,y0,x1,y1,r){if(x<x0||x>x1||y<y0||y>y1)return false;const cx=Math.min(Math.max(x,x0+r),x1-r),cy=Math.min(Math.max(y,y0+r),y1-r);return(x-cx)**2+(y-cy)**2<=r*r}
  function amostra(X,Y){ // retorna [r,g,b,a]
    let x=(X-off)/s,y=(Y-off)/s;
    let base=null;
    if(maskable)base=INK; else if(rr(X,Y,0,0,512,512,112))base=INK; else return[0,0,0,0];
    if(x<0||y<0||x>512||y>512)return[...base,255];
    let c=base;
    if(rr(x,y,120,96,392,416,28)){c=PAP;if(y<160)c=OURO}
    if(rr(x,y,164,204,348,222,9))c=INK;
    if(rr(x,y,164,254,348,272,9))c=mix(INK,PAP,.6);
    if(rr(x,y,164,304,284,322,9))c=mix(INK,PAP,.35);
    if((x-330)**2+(y-352)**2<=34*34){c=VERDE;
      // check
      const seg=(ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-(ax+t*dx),y-(ay+t*dy))<=5};
      if(seg(314,352,326,364)||seg(326,364,348,338))c=BR}
    return[...c,255];
  }
  function mix(a,b,t){return a.map((v,i)=>Math.round(v*t+b[i]*(1-t)))}
  for(let py=0;py<w;py++)for(let pxl=0;pxl<w;pxl++){
    let r=0,g=0,b=0,a=0;
    for(let i=0;i<3;i++)for(let j=0;j<3;j++){const q=amostra((pxl+(j+.5)/3)*512/w,(py+(i+.5)/3)*512/w);r+=q[0]*q[3];g+=q[1]*q[3];b+=q[2]*q[3];a+=q[3]}
    const o=(py*w+pxl)*4;
    if(a>0){px[o]=r/a;px[o+1]=g/a;px[o+2]=b/a}px[o+3]=a/9;
  }
  return png(w,px);
}
fs.writeFileSync(path.join(out,"icon-180.png"),render(180,false));
fs.writeFileSync(path.join(out,"icon-192.png"),render(192,false));
fs.writeFileSync(path.join(out,"icon-512.png"),render(512,false));
fs.writeFileSync(path.join(out,"icon-maskable-512.png"),render(512,true));
console.log("ok");
