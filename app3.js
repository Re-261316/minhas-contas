function eff(x,mo){var d=x.g=="Dia a dia"?x.dia:(S.cartoes[x.g]?S.cartoes[x.g].venc:x.dia);if(!d||x.g=="Dia a dia")return d||0;var a=mo.split("-"),w=new Date(a[0],a[1]-1,d).getDay();if(w==6)d+=2;else if(w==0)d+=1;return d}
function vs(g){var d=eff({g:g,dia:0},S.mes);return String(d).padStart(2,"0")+"/"+S.mes.slice(5)}
function agg(l){var m={};l.forEach(function(o){var k=S.cartoes[o.x.g]?"Fatura "+o.x.g:o.x.n;m[k]=(m[k]||0)+o.x.v});return Object.keys(m).map(function(k){return k+" "+R(m[k])}).join(" · ")}
function alerta(){if(S.mes!=tm())return"";var v=vis(tm()),h=new Date().getDate(),a=[],b=[],c=[];
 v.forEach(function(o){if(pg(o)||!o.dia||o.x.g=="Dia a dia"||(o.x.q&&o.x.q!="Eu"))return;if(o.dia<h)a.push(o);else if(o.dia==h)b.push(o);else if(o.dia==h+1)c.push(o)});
 if(!a.length&&!b.length&&!c.length)return"";
 try{if(!window.nf&&window.Notification&&Notification.permission=="granted"){window.nf=1;notify("Minhas Contas",{body:(b.length?"Vence hoje: "+agg(b):"")+(c.length?" Amanhã: "+agg(c):"")||"Tem conta atrasada"})}}catch(e){}
 return'<div class="card" style="background:var(--c3)">'+(a.length?'<div class="bad">⚠ Atrasadas: '+agg(a)+"</div>":"")+(b.length?'<div class="warn">📌 Vence hoje: '+agg(b)+"</div>":"")+(c.length?"<div>⏰ Amanhã: "+agg(c)+"</div>":"")+"</div>"}
function notif(){try{Notification.requestPermission().then(function(p){alert(p=="granted"?"Avisos ativados ✔ (funcionam quando o app está aberto)":"O navegador não permitiu os avisos.")})}catch(e){alert("Seu aparelho não deixa esta página mandar avisos.")}}
function iconBlk(){return'<div class="lab">Ícone</div><div class="chips" style="align-items:center"><span class="ic" style="background:var(--c4)">'+(F.img?'<img src="'+F.img+'" style="width:100%;height:100%;object-fit:cover;border-radius:11px">':(F.emo||CATS[F.cat]||"✨"))+'</span><label class="chip">🖼️ Galeria<input type="file" accept="image/*" style="display:none" onchange="pickImg(this)"></label><input style="width:84px;margin:0" maxlength="4" placeholder="Emoji" value="'+(F.emo||"")+'" oninput="F.emo=this.value"><button class="chip" onclick="rd();F.img=\'\';F.emo=\'\';sheet()">Remover</button></div><div class="lab">Imagem da internet: salve ela na galeria do celular e escolha aqui.</div>'}
function pickImg(inp){var f=inp.files[0];if(!f)return;rd();var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var c=document.createElement("canvas");c.width=c.height=96;var s=Math.min(im.width,im.height);c.getContext("2d").drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,96,96);F.img=c.toDataURL("image/jpeg",0.8);sheet()};im.src=r.result};r.readAsDataURL(f)}
function migC(){var b=+S.banco||0;if(!S.contas)S.contas=[{n:"Banco",v:b}];delete S.banco;Object.defineProperty(S,"banco",{configurable:true,enumerable:true,get:function(){return S.contas.reduce(function(a,c){return a+(+c.v||0)},0)},set:function(v){if(!S.contas.length)S.contas.push({n:"Banco",v:0});S.contas[0].v=(+S.contas[0].v||0)+(v-S.banco)}})}
function addC(){S.contas.push({n:"Novo banco",v:0});save();draw()}
function delC(i){if(confirm("Remover essa conta do saldo?")){S.contas.splice(i,1);save();draw()}}
function dump(){return JSON.stringify({app:"minhas-contas",versao:1,exportadoEm:new Date().toISOString(),dados:JSON.parse(JSON.stringify(S))},null,1)}
function nomeArq(){return"minhas-contas-"+iso()+".json"}
function marca(){S.ultBackup=iso();save()}
function baixar(){try{var b=new Blob([dump()],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=nomeArq();document.body.appendChild(a);a.click();a.remove();marca();draw()}catch(e){alert("Não consegui baixar aqui. Use 'Mostrar texto' e copie.")}}
function compartilhar(){try{var f=new File([dump()],nomeArq(),{type:"application/json"});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:nomeArq()}).then(function(){marca();draw()}).catch(function(){})}else alert("Este navegador não compartilha arquivo. Use Baixar.")}catch(e){alert("Compartilhar não funcionou. Use Baixar.")}}
function mostrar(){var t=$("bkt");t.style.display="block";t.value=dump();t.select();try{document.execCommand("copy")}catch(e){}}
function restaura(txt){try{var o=JSON.parse(txt),d=(o&&o.dados)||o;if(!d||!Array.isArray(d.items))throw 0;
 var dt=((o.exportadoEm||"").slice(0,10))||"data desconhecida";
 if(!confirm("Substituir TODOS os dados atuais ("+S.items.length+" contas) pelo backup de "+dt+" ("+d.items.length+" contas)?"))return;
 try{localStorage.setItem("mc1_antes",JSON.stringify(S))}catch(e){}
 S=d;S.mes=tm();S.tab="resumo";mig();save();draw();alert("Backup restaurado ✔")}catch(e){alert("Esse arquivo não parece um backup do Minhas Contas.")}}
function lerBk(f){if(!f)return;var r=new FileReader();r.onload=function(){restaura(String(r.result))};r.readAsText(f)}
function colaBk(){var t=$("bki").value.trim();if(t)restaura(t)}
function bkCard(){return'<h2>💾 Backup dos dados</h2><div class="card"><p class="mu">Último backup: <b>'+(S.ultBackup||"nunca")+'</b>. O arquivo sai com a data no nome e guarda todos os meses.</p><div class="chips"><button class="chip on" onclick="baixar()">⬇️ Baixar</button><button class="chip" onclick="compartilhar()">📤 Enviar pro Drive</button><button class="chip" onclick="mostrar()">📋 Mostrar texto</button></div><textarea id="bkt" rows="4" readonly style="display:none;width:100%;font:inherit"></textarea><div class="lab">Restaurar de um arquivo de backup</div><input type="file" accept=".json,application/json" onchange="lerBk(this.files[0])"><div class="lab">Ou cole o texto do backup</div><textarea id="bki" rows="3" style="width:100%;font:inherit;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);padding:8px"></textarea><br><button class="chip" onclick="colaBk()">Restaurar</button></div>'}
function bkBanner(){if(!S.items.length)return'<div class="card" style="background:var(--c2)">👋 App vazio. Restaure seu backup (aba Contas, no fim) ou toque no + pra lançar.</div>';if(S.ultBackup==iso())return"";return'<div class="card" style="background:var(--c2)">💾 O backup de hoje ainda não foi feito. <button class="chip on" onclick="S.tab=\'contas\';save();draw();window.scrollTo(0,document.body.scrollHeight)">Fazer agora</button></div>'}
var calSel="";
function agenda(){var a=S.mes.split("-"),y=+a[0],m=+a[1]-1,fd=new Date(y,m,1).getDay(),nd=new Date(y,m+1,0).getDate(),v=vis(),ch=mi(S.mes)==mi(tm()),hd=ch?new Date().getDate():(mi(S.mes)<mi(tm())?99:0);
 if(!calSel||calSel.slice(0,7)!=S.mes)calSel=S.mes+"-"+String(ch?new Date().getDate():1).padStart(2,"0");
 var by={},en={},pa=0,at=0,av=0;
 v.forEach(function(o){if(o.dia)(by[o.dia]=by[o.dia]||[]).push(o);if(o.x.g=="Dia a dia"||(o.x.q&&o.x.q!="Eu"))return;if(pg(o))pa+=o.x.v;else if(o.dia&&o.dia<hd)at+=o.x.v;else av+=o.x.v});
 S.entradas.forEach(function(e){if(e.d.slice(0,7)==S.mes){var d=+e.d.slice(8);(en[d]=en[d]||[]).push(e)}});
 var h='<div class="g3"><div style="background:var(--c1)"><span class="mu">Já pago</span><b>'+R(pa)+'</b></div><div style="background:var(--c5)"><span class="mu">Atrasado</span><b>'+R(at)+'</b></div><div style="background:var(--c3)"><span class="mu">Vai vencer</span><b>'+R(av)+'</b></div></div>';
 h+='<div class="card"><div class="cal">'+["D","S","T","Q","Q","S","S"].map(function(x){return'<div class="mu" style="text-align:center">'+x+"</div>"}).join("");
 for(var i=0;i<fd;i++)h+="<div></div>";
 for(var d=1;d<=nd;d++){var iso=S.mes+"-"+String(d).padStart(2,"0"),dots="",dd=d;
  (by[d]||[]).slice(0,4).forEach(function(o){dots+='<i class="dt '+(o.x.g=="Dia a dia"?"dp":pg(o)?"dk":dd<hd?"db":"dw")+'"></i>'});
  if(en[d])dots+='<i class="dt de"></i>';
  h+='<button class="cd'+(iso==calSel?" sel":"")+(ch&&d==hd?" td":"")+'" onclick="calSel=\''+iso+'\';draw()"><b>'+d+'</b><div class="dots">'+dots+'</div>'+(S.notas[iso]?"<small>✏️</small>":"")+"</button>"}
 h+='</div><p class="mu">🟠 vai vencer · 🔴 atrasada · 🟢 paga · 🟣 compra · 🔵 entrada · ✏️ anotação</p><button class="chip" onclick="notif()">🔔 Ativar avisos</button></div>';
 var sd=+calSel.slice(8),l=by[sd]||[],es=en[sd]||[];
 h+='<h2>'+sd+"/"+a[1]+'</h2><div class="card">'+(l.length||es.length?l.map(row).join("")+es.map(function(e){return'<div class="row"><div class="ic" style="background:var(--c1)">💰</div><div class="n"><b>'+e.n+'</b><small>entrada</small></div><span class="v ok">+ '+R(e.v)+"</span></div>"}).join(""):'<span class="mu">Nada nesse dia.</span>')+'<div class="lab">Anotação do dia</div><textarea rows="3" style="width:100%;font:inherit;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);padding:8px" onchange="S.notas[calSel]=this.value;save();draw()">'+(S.notas[calSel]||"")+"</textarea></div>";
 var sem=v.filter(function(o){return !o.dia&&!pg(o)&&o.x.g!="Dia a dia"});
 if(sem.length)h+='<h2>Sem data de vencimento</h2><div class="card">'+sem.map(row).join("")+"</div>";
 return h}
function tabs(){var t=[["resumo","Resumo"],["contas","Contas"],["agenda","Agenda"],["extrato","Extrato"],["dicas","Dicas"]];
 $("tabs").innerHTML=t.map(function(a){return'<button class="'+(S.tab==a[0]?"on":"")+'" onclick="S.tab=\''+a[0]+'\';save();draw()">'+a[1]+"</button>"}).join("")}
function draw(){$("mes").textContent=MN(S.mes);tabs();$("app").innerHTML=bkBanner()+alerta()+({resumo:resumo,contas:contas,agenda:agenda,extrato:extrato,dicas:dicas})[S.tab]()}
function notify(t,o){try{navigator.serviceWorker.ready.then(function(r){r.showNotification(t,o)})}catch(e){try{new Notification(t,o)}catch(e2){}}}
try{var s=localStorage.getItem("mc1");if(s){S=JSON.parse(s);S.mes=tm();if(!S.v){S.v=2;S.mes=tm()}}}catch(e){}
mig();
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
try{if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js")}catch(e){}
draw();
