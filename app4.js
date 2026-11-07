/* app4: melhorias (sobrescreve funções anteriores) */
function patchFn(name,pairs){var s=window[name].toString();pairs.forEach(function(p){if(s.indexOf(p[0])<0){console.error("patch falhou em "+name+": "+p[0].slice(0,50));window.PATCHFAIL=(window.PATCHFAIL||[]).concat(name)}else s=s.replace(p[0],function(){return p[1]})});window[name]=(0,eval)("("+s+")")}
function rid(){return Math.random().toString(36).slice(2)}
/* ---- feriados e dias úteis ---- */
function pascoa(y){var a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da)}
function feriados(y){var p=pascoa(y),s={};function add(d){s[d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()]=1}
 [[0,1],[3,21],[4,1],[8,7],[9,12],[10,2],[10,15],[10,20],[11,25]].forEach(function(a){add(new Date(y,a[0],a[1]))});
 [-48,-47,-2,60].forEach(function(n){var d=new Date(p);d.setDate(d.getDate()+n);add(d)});return s}
var FER={};
function ehFer(dt){var y=dt.getFullYear();if(!FER[y])FER[y]=feriados(y);return !!FER[y][y+"-"+(dt.getMonth()+1)+"-"+dt.getDate()]}
function proxUtil(dt){while(dt.getDay()==0||dt.getDay()==6||ehFer(dt))dt.setDate(dt.getDate()+1);return dt}
function venc(x,mo){var base=(x.g=="Dia a dia")?x.dia:(S.cartoes[x.g]?S.cartoes[x.g].venc:x.dia);if(!base)return null;
 var a=mo.split("-"),y=+a[0],m=+a[1]-1,nd=new Date(y,m+1,0).getDate(),d0=Math.min(base,nd);
 if(x.g=="Dia a dia")return{d0:d0,d:d0,dt:new Date(y,m,d0)};
 var dt=proxUtil(new Date(y,m,d0)),d=dt.getMonth()==m?dt.getDate():nd;return{d0:d0,d:d,dt:dt}}
function eff(x,mo){var v=venc(x,mo);return v?v.d:0}
var DS=["dom","seg","ter","qua","qui","sex","sáb"];
function vtxt(x,mo){var v=venc(x,mo);if(!v)return"";return String(v.dt.getDate()).padStart(2,"0")+"/"+String(v.dt.getMonth()+1).padStart(2,"0")+" ("+DS[v.dt.getDay()]+")"+(v.d0!=v.dt.getDate()?" · ajustado do dia "+v.d0:"")}
function vs(g){return vtxt({g:g,dia:0},S.mes).split(" ·")[0]}
/* ---- contas, faturas, resumo ---- */
function orig(x){var g=x.g=="Fixas"?"conta fixa":x.g=="Outro"?"outro cartão":x.g=="Dia a dia"?"dia a dia":"cartão "+x.g;return g+(x.q&&x.q!="Eu"?" · de "+x.q:"")}
function minha(o){return !(o.x.q&&o.x.q!="Eu")}
function fatRows(v){return["Mercado Pago","Play","Nu"].map(function(k){var l=v.filter(function(o){return o.x.g==k});if(!l.length)return"";var t=l.reduce(function(a,o){return a+o.x.v},0),mine=l.filter(minha),pd=mine.length&&mine.every(pg);
 return'<div class="row '+(pd?"done":"")+'"><div class="ic" style="background:var('+GC[k]+')">💳</div><div class="n"><b>Fatura '+k+'</b><small>vence '+vtxt({g:k,dia:0},S.mes)+' · '+l.length+' lançamentos</small></div><span class="v">'+R(t)+'</span><input type="checkbox" '+(pd?"checked":"")+' onchange="pagaFat(\''+k+'\')"></div>'}).join("")}
function fatTotal(v){return v.filter(function(o){return CARDS.indexOf(o.x.g)>-1&&o.x.g!="Outro"}).reduce(function(a,o){return a+o.x.v},0)}
function pagaFat(k){var l=vis().filter(function(o){return o.x.g==k&&minha(o)}),pd=l.length&&l.every(pg);l.forEach(function(o){o.x.pago[S.mes]=!pd});save();draw()}
function vencBlk(v){var cs=["Mercado Pago","Play","Nu"].map(function(k){return'<div style="background:var('+GC[k]+');border-radius:14px;padding:10px"><div class="lab" style="margin:0">'+k+'</div><div class="top"><span>dia</span><input type="number" min="1" max="28" style="width:62px;padding:5px 6px" value="'+S.cartoes[k].venc+'" onchange="S.cartoes[\''+k+'\'].venc=+this.value;save();draw()"></div><small class="mu">vence '+vtxt({g:k,dia:0},S.mes)+'</small></div>'}).join("");
 var fx=v.filter(function(o){return o.x.g=="Fixas"&&o.dia}).sort(function(a,b){return a.dia-b.dia}).map(function(o){return'<div class="row" onclick="openS(\''+o.x.id+'\')"><div class="ic" style="background:var(--c1)">'+(o.x.emo||CATS[o.x.cat]||"✨")+'</div><div class="n"><b>'+o.x.n+'</b><small>vence '+vtxt(o.x,S.mes)+'</small></div><span class="v">'+R(o.x.v)+'</span></div>'}).join("");
 return'<h2>📅 Vencimentos</h2><div class="card"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">'+cs+'</div><div style="margin-top:10px">'+(fx||'<span class="mu">Toque numa conta fixa e preencha “Dia do vencimento”: ela aparece aqui.</span>')+'</div><p class="mu">Se cair em fim de semana ou feriado nacional, passa pro próximo dia útil.</p></div>'}
function contas(){var v=vis(),h="";GR.forEach(function(g){var l=v.filter(function(o){return o.x.g==g}),ex=g=="Fixas"?fatRows(v):"";if(!l.length&&!ex)return;
 var t=l.reduce(function(a,o){return a+o.x.v},0)+(g=="Fixas"?fatTotal(v):0);h+='<h2>'+g+' · '+R(t)+(g=="Fixas"?" (com faturas)":"")+'</h2><div class="card">'+l.map(row).join("")+ex+"</div>"});
 return h+vencBlk(v)+'<p class="mu" style="text-align:center">Toque numa conta pra editar · marque ✔ quando pagar</p>'}
function metodos(v){var s={"Débito":0,"Pix":0,"Dinheiro":0},cl={"Débito":"--c5","Pix":"--c1","Dinheiro":"--c3"};v.forEach(function(o){if(o.x.g=="Dia a dia"&&minha(o)&&s[o.x.pay]!==undefined)s[o.x.pay]+=o.x.v});
 return'<div class="g3" style="margin-top:8px">'+Object.keys(s).map(function(k){return'<div style="background:var('+cl[k]+')"><span class="mu">'+k+'</span><b>'+R(s[k])+'</b><span class="mu">já no total</span></div>'}).join("")+"</div>"}
patchFn("row",[['(rc?" · 💸 "+x.q+" te deve":"")','(rc?(pg(o)?" · ✔ quitada por "+x.q:" · 💸 "+x.q+" te deve"):"")']]);
patchFn("resumo",[
 ['gk=v.filter(function(o){return o.x.g==k})','gk=v.filter(function(o){return o.x.g==k&&minha(o)})'],
 ['.join("")+"</div>";\n var dev={}','.join("")+"</div>"+metodos(v);\n var dev={}'],
 ["falta receber '+R(dev[k][1])+'</small>","'+(dev[k][1]>0.004?\"falta receber \"+R(dev[k][1]):\"✔ quitado\")+'</small>"],
 ['"última parcela!")+\'</small></div><span class="v">\'+R(o.x.v)','"última parcela!")+\' · \'+orig(o.x)+\'</small></div><span class="v">\'+R(o.x.v)']]);
/* ---- pessoas: segurar para remover ---- */
var LPt=null,LPf=0;
function lp(n){LPf=0;LPt=setTimeout(function(){LPf=1;if(n=="Eu"){alert("O “Eu” não pode ser removido.");return}var u=S.items.filter(function(x){return x.q==n}).length;
 if(confirm("Remover "+n+" da lista de pessoas?"+(u?"\n"+u+" conta(s) ainda usam esse nome e continuam como estão.":""))){S.pessoas=S.pessoas.filter(function(p){return p!=n});if(F.q==n)F.q="Eu";save();sheet()}},650)}
function lpc(){clearTimeout(LPt)}
function sf(k,val){if(LPf){LPf=0;return}rd();F[k]=val;sheet()}
function chips(k,opts,sel){return'<div class="chips">'+opts.map(function(o){return'<button class="chip '+(sel==o?"on":"")+'" onclick="sf(\''+k+'\',\''+o+'\')"'+(k=="q"?' onpointerdown="lp(\''+o+'\')" onpointerup="lpc()" onpointerleave="lpc()" onpointercancel="lpc()" oncontextmenu="return false"':"")+'>'+(CATS[o]?CATS[o]+" ":"")+o+"</button>"}).join("")+"</div>"+(k=="q"?'<div class="lab" style="margin-top:-6px">Segure o dedo num nome para remover.</div>':"")}
/* ---- tema ---- */
var TEMAS={"Lilás":262,"Menta":160,"Pêssego":18,"Céu":205,"Rosa":335,"Oliva":95};
function hsl(h,s,l){return"hsl("+(((h%360)+360)%360)+","+s+"%,"+l+"%)"}
function aplicaTema(){var H=TEMAS[S.tema]!==undefined?TEMAS[S.tema]:262,mo=S.modo||"auto",dk=mo=="escuro"||(mo=="auto"&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches),r=document.documentElement.style,off=[150,210,25,0,330,0],v={};
 if(dk){v["--bg"]=hsl(H,22,12);v["--card"]=hsl(H,20,17);v["--tx"]=hsl(H,30,92);v["--mu"]=hsl(H,12,66);v["--bd"]=hsl(H,18,26);v["--ac"]=hsl(H,55,62)}
 else{v["--bg"]=hsl(H,45,97);v["--card"]="#fff";v["--tx"]=hsl(H,25,25);v["--mu"]=hsl(H,10,55);v["--bd"]=hsl(H,35,93);v["--ac"]=hsl(H,42,58)}
 for(var i=0;i<6;i++)v["--c"+(i+1)]=dk?hsl(H+off[i],i==5?8:30,i==5?20:22):hsl(H+off[i],i==5?15:75,i==5?93:91);
 for(var k in v)r.setProperty(k,v[k]);var m=document.querySelector("meta[name=theme-color]");if(m)m.content=v["--ac"]}
function setTema(n){S.tema=n;save();aplicaTema();ajustes()}
function setModo(m){S.modo=m;save();aplicaTema();ajustes()}
/* ---- PIN e digital ---- */
async function sha(s){var b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,"0")}).join("")}
function pinCfg(){try{return JSON.parse(localStorage.getItem("mc_pin")||"null")}catch(e){return null}}
async function defPin(){var a=$("pn1").value,b=$("pn2").value;if(!/^\d{4,6}$/.test(a)){alert("O PIN precisa ter de 4 a 6 números.");return}if(a!=b){alert("Os dois PINs são diferentes.");return}var s=rid(),h=await sha(s+a);localStorage.setItem("mc_pin",JSON.stringify({s:s,h:h,n:a.length}));alert("PIN ativado ✔");ajustes()}
function tiraPin(){if(confirm("Remover o PIN e a digital?")){localStorage.removeItem("mc_pin");localStorage.removeItem("mc_cred");ajustes()}}
function b64(buf){return btoa(String.fromCharCode.apply(null,new Uint8Array(buf)))}
function ub64(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0)})}
async function bioReg(){try{var c=await navigator.credentials.create({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:"Minhas Contas"},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"usuario",displayName:"Usuário"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required"},timeout:60000}});localStorage.setItem("mc_cred",b64(c.rawId));alert("Digital/rosto ativado ✔");ajustes()}catch(e){alert("Não consegui ativar a digital: "+(e&&e.message||e))}}
async function bioAuth(){await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),allowCredentials:[{type:"public-key",id:ub64(localStorage.getItem("mc_cred"))}],userVerification:"required",timeout:60000}})}
function tiraBio(){localStorage.removeItem("mc_cred");ajustes()}
var LK={buf:"",fails:0,until:0,h:0};
function travar(){var c=pinCfg();if(!c)return;var el=$("lk");if(!el){el=document.createElement("div");el.id="lk";document.body.appendChild(el)}el.style.cssText="display:flex;position:fixed;inset:0;z-index:99";LK.buf="";lkDraw();if(localStorage.getItem("mc_cred"))setTimeout(bioUI,300)}
function lkDraw(){var c=pinCfg(),el=$("lk"),d="",bio=!!localStorage.getItem("mc_cred");for(var i=0;i<c.n;i++)d+='<i class="pd'+(i<LK.buf.length?" on":"")+'"></i>';
 var ks=[1,2,3,4,5,6,7,8,9,"bio",0,"del"].map(function(k){return k=="bio"?(bio?'<button class="pk" onclick="bioUI()">👆</button>':"<span></span>"):'<button class="pk" onclick="lkKey(\''+k+'\')">'+(k=="del"?"⌫":k)+"</button>"}).join("");
 el.innerHTML='<div class="lkb"><div style="font-size:44px">💰</div><h1>Minhas Contas</h1><p class="mu" id="lkm">Digite seu PIN</p><div class="pds">'+d+'</div><div class="pkp">'+ks+"</div></div>"}
async function lkKey(k){var c=pinCfg();if(Date.now()<LK.until){$("lkm").textContent="Aguarde alguns segundos…";return}
 if(k=="del"){LK.buf=LK.buf.slice(0,-1);lkDraw();return}if(LK.buf.length>=c.n)return;LK.buf+=k;lkDraw();
 if(LK.buf.length==c.n){var h=await sha(c.s+LK.buf);if(h==c.h)destrava();else{LK.fails++;LK.buf="";if(LK.fails>=5){LK.until=Date.now()+30000;LK.fails=0}lkDraw();$("lkm").textContent="PIN errado"+(LK.until>Date.now()?". Espere 30 segundos.":"")}}}
async function bioUI(){try{await bioAuth();destrava()}catch(e){}}
function destrava(){LK.buf="";LK.fails=0;var el=$("lk");if(el)el.style.display="none"}
/* ---- ajustes e backup ---- */
function bkCard(){return'<h2>💾 Backup dos dados</h2><div class="card"><p class="mu">Último backup: <b>'+(S.ultBackup||"nunca")+'</b>. O arquivo leva a data no nome e guarda todos os meses.</p><div class="chips"><button class="chip on" onclick="baixar()">⬇️ Baixar</button><button class="chip" onclick="compartilhar()">📤 Compartilhar</button><button class="chip" onclick="mostrar()">📋 Mostrar texto</button></div><textarea id="bkt" rows="4" readonly style="display:none;width:100%;font:inherit"></textarea><div class="lab">Restaurar de um arquivo de backup</div><input type="file" onchange="lerBk(this.files[0])"><div class="lab">Ou cole o texto do backup</div><textarea id="bki" rows="3" style="width:100%;font:inherit;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);padding:8px"></textarea><br><button class="chip" onclick="colaBk()">Restaurar</button></div>'}
function compartilhar(){var nome="minhas-contas-"+iso()+".txt",f;try{f=new File([dump()],nome,{type:"text/plain"})}catch(e){alert("Seu aparelho não deixa criar o arquivo. Use Baixar.");return}
 if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:nome}).then(function(){marca();draw()}).catch(function(e){if(e&&e.name!="AbortError")alert("Não consegui abrir o compartilhamento: "+e.message)})}else alert("Este navegador não deixa compartilhar arquivo. Use Baixar ou Mostrar texto.")}
patchFn("restaura",[['save();draw();alert("Backup restaurado ✔")','save();closeS();aplicaTema();draw();alert("Backup restaurado ✔")']]);
function ajustes(){var p=pinCfg(),bio=!!localStorage.getItem("mc_cred");
 var sec=p?'<p>PIN ativo ✔ ('+p.n+' números)</p><div class="chips">'+(bio?'<button class="chip" onclick="tiraBio()">Desativar digital</button>':'<button class="chip on" onclick="bioReg()">👆 Ativar digital/rosto</button>')+'<button class="chip" onclick="tiraPin()">Remover PIN</button></div>':'<div class="lab">Crie um PIN de 4 a 6 números</div><input id="pn1" type="password" inputmode="numeric" maxlength="6" placeholder="PIN"><input id="pn2" type="password" inputmode="numeric" maxlength="6" placeholder="Repita o PIN"><button class="chip on" onclick="defPin()">Ativar PIN</button>';
 $("sh").innerHTML='<div class="top"><h1>⚙️ Ajustes</h1><button onclick="closeS()">✕</button></div><h2>🎨 Tema</h2><div class="card"><div class="chips">'+Object.keys(TEMAS).map(function(n){return'<button class="chip '+((S.tema||"Lilás")==n?"on":"")+'" onclick="setTema(\''+n+'\')">'+n+"</button>"}).join("")+'</div><div class="chips">'+[["auto","Automático"],["claro","Claro"],["escuro","Escuro"]].map(function(a){return'<button class="chip '+((S.modo||"auto")==a[0]?"on":"")+'" onclick="setModo(\''+a[0]+'\')">'+a[1]+"</button>"}).join("")+'</div></div><h2>🔒 Segurança</h2><div class="card">'+sec+'<p class="mu">O PIN tranca a tela do app. Ele não criptografa os dados guardados no aparelho.</p></div>'+bkCard();$("ov").style.display="flex"}
function bkBanner(){if(!S.items.length)return'<div class="card" style="background:var(--c2)">👋 App vazio. Toque no ⚙️ (no alto) pra restaurar um backup, ou no + pra lançar.</div>';var u=S.ultBackup;var dias=u?Math.round((Date.now()-Date.parse(u))/864e5):99;if(dias<=7)return"";return'<div class="card" style="background:var(--c2)">💾 Faz '+(u?dias+" dias":"tempo")+' que você não faz backup. <button class="chip on" onclick="ajustes()">Fazer agora</button></div>'}
