/* O Brasão do Balancete (logo): uma moeda de ouro em faixas, com a balança em relevo no miolo.
   Fonte única do desenho: daqui saem o ícone (app/icon.svg e PNGs) e o desenho usado dentro do app
   (abertura e cabeçalho). Aprovado pelo dono em 7 nov 2026 (decisão D54).
   brasao({p, vivo, fundo}) devolve o SVG em texto.
   - p: prefixo dos ids (gradientes), para não repetir quando há mais de um na página
   - vivo: true acrescenta os olhos no pino central (só na abertura do app)
   - fundo: "quadrado" (ícone com fundo preto) ou "nenhum" */
"use strict";
function defs(p){
  return '<defs>'+
   '<linearGradient id="'+p+'oV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBEAA6"/><stop offset=".38" stop-color="#E2BC4A"/><stop offset=".7" stop-color="#B98E1F"/><stop offset="1" stop-color="#7C5E0F"/></linearGradient>'+
   '<linearGradient id="'+p+'oH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7C5E0F"/><stop offset=".3" stop-color="#F3DC8C"/><stop offset=".55" stop-color="#D2AC37"/><stop offset="1" stop-color="#7C5E0F"/></linearGradient>'+
   '<radialGradient id="'+p+'oR" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF1BC"/><stop offset=".45" stop-color="#DDB547"/><stop offset="1" stop-color="#8A6A12"/></radialGradient>'+
   '<radialGradient id="'+p+'esm" cx=".4" cy=".32" r=".75"><stop offset="0" stop-color="#2E2E2E"/><stop offset=".55" stop-color="#121212"/><stop offset="1" stop-color="#030303"/></radialGradient>'+
   '<linearGradient id="'+p+'prato" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DE8E"/><stop offset=".5" stop-color="#C79E2C"/><stop offset="1" stop-color="#6E520C"/></linearGradient>'+
  '</defs>';
}
function prato(p,h,w){
  return '<g>'+
   '<circle r="3.2" fill="url(#'+p+'oR)" stroke="#6E520C" stroke-width=".8"/>'+
   '<line x1="0" y1="2" x2="'+(-w+3)+'" y2="'+h+'" stroke="#9C7A16" stroke-width="2.4" stroke-dasharray="2.6 1.8" stroke-linecap="round"/>'+
   '<line x1="0" y1="2" x2="'+(w-3)+'" y2="'+h+'" stroke="#9C7A16" stroke-width="2.4" stroke-dasharray="2.6 1.8" stroke-linecap="round"/>'+
   '<path d="M'+(-w)+' '+h+' C'+(-w*.8)+' '+(h+w*.95)+' '+(w*.8)+' '+(h+w*.95)+' '+w+' '+h+' Z" fill="url(#'+p+'prato)" stroke="#6E520C" stroke-width="1.2"/>'+
   '<ellipse cx="0" cy="'+h+'" rx="'+w+'" ry="'+(w*.2)+'" fill="#F7E3A0" stroke="#8A6A12" stroke-width="1.2"/>'+
   '<ellipse cx="0" cy="'+(h+.6)+'" rx="'+(w*.82)+'" ry="'+(w*.13)+'" fill="#A9831B" opacity=".55"/></g>';
}
function travessao(p,cx,cy,L){
  var x1=cx-L, x2=cx+L;
  return '<path d="M'+x1+' '+(cy-2.6)+' Q'+cx+' '+(cy-9)+' '+x2+' '+(cy-2.6)+' L'+x2+' '+(cy+2.6)+' Q'+cx+' '+(cy+9)+' '+x1+' '+(cy+2.6)+' Z" fill="url(#'+p+'oV)" stroke="#6E520C" stroke-width="1.2"/>'+
   '<path d="M'+(x1+6)+' '+(cy-2.2)+' Q'+cx+' '+(cy-7)+' '+(x2-6)+' '+(cy-2.2)+'" stroke="#FFF3C4" stroke-width="1.6" fill="none" opacity=".7"/>'+
   '<circle cx="'+x1+'" cy="'+cy+'" r="7" fill="url(#'+p+'oR)" stroke="#6E520C" stroke-width="1.2"/><circle cx="'+x2+'" cy="'+cy+'" r="7" fill="url(#'+p+'oR)" stroke="#6E520C" stroke-width="1.2"/>';
}
function olhos(){
  var s='';
  [-1,1].forEach(function(k){
    s+='<g transform="translate('+(k*3.4)+' -.5)"><path d="M-2.6 0 Q0 -2.3 2.6 0 Q0 2.3 -2.6 0 Z" fill="#F5EBCB"/><circle r="1.15" fill="#0A0A0A"/></g>';
    s+='<path transform="translate('+(k*3.4)+' -3.3)" d="M-2.4 0 Q0 -1 2.4 0" fill="none" stroke="#EAD27A" stroke-width=".9" stroke-linecap="round"/>';
  });
  return s+'<path transform="translate(0 3.4)" d="M-2.6 -.3 Q0 1.9 2.6 -.3" fill="none" stroke="#EAD27A" stroke-width=".9" stroke-linecap="round"/>';
}
function brasao(o){
  o=o||{}; var p=o.p||"br", ct=p+"t", cb=p+"b";
  var fundo=o.fundo==="quadrado", m=o.margem==null?24:o.margem, vb=fundo?(-m)+" "+(-m)+" "+(240+2*m)+" "+(240+2*m):"0 0 240 240";
  var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vb+'"'+(o.attrs?" "+o.attrs:"")+'>'+defs(p);
  if(fundo)s+='<rect x="'+(-m)+'" y="'+(-m)+'" width="'+(240+2*m)+'" height="'+(240+2*m)+'" fill="#0A0A0A"/><circle cx="120" cy="120" r="140" fill="#1C160A" opacity=".55"/>';
  s+='<g class="br-moeda">';
  if(!fundo)s+='<circle cx="120" cy="124" r="114" fill="#000" opacity=".35"/>';
  s+='<circle cx="120" cy="120" r="114" fill="url(#'+p+'oV)"/>';
  s+='<circle cx="120" cy="120" r="111" fill="none" stroke="#7C5E0F" stroke-width="6" stroke-dasharray="1.4 2.1"/>';
  s+='<circle cx="120" cy="120" r="104" fill="url(#'+p+'oR)" stroke="#6E520C" stroke-width="1.2"/>';
  s+='<circle cx="120" cy="120" r="101" fill="none" stroke="#FFF3C4" stroke-width="1.2" opacity=".6"/>';
  s+='<circle cx="120" cy="120" r="93" fill="#6E520C"/>';
  s+='<circle cx="120" cy="120" r="91.5" fill="url(#'+p+'esm)"/>';
  s+='<circle cx="120" cy="120" r="88" fill="none" stroke="#C9A227" stroke-width="1" opacity=".75"/>';
  s+='<circle cx="120" cy="120" r="68" fill="none" stroke="#C9A227" stroke-width="1.2" opacity=".85"/>';
  s+='<circle cx="120" cy="120" r="64" fill="none" stroke="#C9A227" stroke-width="1" stroke-dasharray=".1 3.6" stroke-linecap="round" opacity=".7"/>';
  s+='<path id="'+ct+'" d="M46 120 A74 74 0 0 1 194 120" fill="none"/>';
  s+='<text font-family="\'Times New Roman\',Times,\'Noto Serif\',serif" font-size="16" font-weight="700" letter-spacing="5" fill="url(#'+p+'oV)"><textPath href="#'+ct+'" startOffset="50%" text-anchor="middle">BALANCETE</textPath></text>';
  s+='<path id="'+cb+'" d="M36 120 A84 84 0 0 0 204 120" fill="none"/>';
  s+='<text font-family="\'Times New Roman\',Times,\'Noto Serif\',serif" font-size="8.6" letter-spacing="2.4" fill="#D9B23A"><textPath href="#'+cb+'" startOffset="50%" text-anchor="middle">SUAS CONTAS EM ORDEM</textPath></text>';
  s+='<path d="M42 120 l4 -4 4 4 -4 4z M190 120 l4 -4 4 4 -4 4z" fill="url(#'+p+'oR)"/>';
  s+='<path d="M98 158 L142 158 L146 166 L94 166 Z" fill="url(#'+p+'oV)" stroke="#6E520C" stroke-width="1"/>';
  s+='<path d="M106 150 L134 150 L138 158 L102 158 Z" fill="url(#'+p+'oV)" stroke="#6E520C" stroke-width="1"/>';
  s+='<path d="M116 150 L118 100 L122 100 L124 150 Z" fill="url(#'+p+'oH)" stroke="#6E520C" stroke-width="1"/>';
  s+='<g class="br-trav">'+travessao(p,120,92,46)+
     '<g transform="translate(74 96)">'+prato(p,28,17)+'</g>'+
     '<g transform="translate(166 96)">'+prato(p,28,17)+'</g></g>';
  s+='<g transform="translate(120 92)"><g class="br-pino">'+
     '<circle r="10.5" fill="url(#'+p+'oR)" stroke="#6E520C" stroke-width="1"/><circle r="8" fill="url(#'+p+'esm)"/>'+
     (o.vivo?'<g class="br-olhos">'+olhos()+'</g>':'')+'</g></g>';
  if(o.vivo)s+='<clipPath id="'+p+'clip"><circle cx="120" cy="120" r="113"/></clipPath><g clip-path="url(#'+p+'clip)"><g transform="translate(120 120) rotate(25)"><rect class="br-reflexo" x="-250" y="-140" width="34" height="280" fill="#fff" opacity=".15"/></g></g>';
  return s+'</g></svg>';
}
module.exports={brasao:brasao,defs:defs};
