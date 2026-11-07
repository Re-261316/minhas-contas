function lanca(i){var e=ext[i];openS(null,{fv:e.v,fn:e.t.slice(0,40),fdt:toIso(e.d),pay:"Débito"})}
function dicas(){var v=vis().filter(function(o){return !o.x.q||o.x.q=="Eu"}),by={},t=0;v.forEach(function(o){by[o.x.cat]=(by[o.x.cat]||0)+o.x.v;if(o.x.cat!="Reserva")t+=o.x.v});
 var h='<div class="card"><b>Quanto você ganha por mês?</b><br><br><input type="number" placeholder="Renda" value="'+(S.renda||"")+'" onchange="S.renda=+this.value;save();draw()">';
 if(S.renda){var sob=S.renda-t,pc=t/S.renda*100;h+='<p>Você gasta <b class="'+(pc>80?"bad":pc>60?"warn":"ok")+'">'+pc.toFixed(0)+'%</b> da renda. Sobra '+R(sob)+'.</p><p class="mu">Regra fácil: 50% necessidades, 30% desejos, 20% guardar. Sua meta de guardar: <b>'+R(S.renda*0.2)+'</b>'+(sob<S.renda*0.2?" — tá abaixo, dá uma olhada nas categorias.":" — tá conseguindo! 🎉")+'</p>'}h+='</div>';
 h+='<h2>Gastos por categoria</h2><div class="card">'+Object.keys(CATS).filter(function(c){return by[c]}).map(function(c){var l=S.lim[c]||0,p=l?by[c]/l*100:t?by[c]/t*100:0;
 return'<div style="margin:10px 0"><div class="top"><span>'+CATS[c]+" "+c+' <b>'+R(by[c])+'</b></span><span class="mu">limite <input type="number" style="width:84px;padding:4px 6px" value="'+(l||"")+'" onchange="S.lim[\''+c+'\']=+this.value;save();draw()"></span></div><div class="bar"><i style="width:'+Math.min(p,100)+'%;background:'+(l&&by[c]>l?"var(--bad)":"var(--ac)")+'"></i></div>'+(l&&by[c]>l?'<span class="bad">⚠ passou '+R(by[c]-l)+' do limite</span>':"")+"</div>"}).join("")+'<p class="mu">Coloque um limite e eu aviso quando passar.</p></div>';
 var tips=[];if(by["Fast food"]&&t&&by["Fast food"]/t>0.05)tips.push("Fast food tá pesando. Que tal cozinhar mais em casa?");if(by["Roupas"]&&t&&by["Roupas"]/t>0.1)tips.push("Roupas passaram de 10% dos gastos.");
 var fim=vis().filter(function(o){return o.x.tot&&o.falta==0&&(!o.x.q||o.x.q=="Eu")});if(fim.length)tips.push("Acabou de pagar "+fim.map(function(o){return o.x.n}).join(", ")+"! Joga esse valor na poupança.");
 tips.push("Separe o dinheiro de guardar assim que receber.");tips.push("Reserva de emergência: de 3 a 6 meses de gastos.");
 return h+'<h2>💡 Dicas</h2><div class="card">'+tips.map(function(x){return"<p>• "+x+"</p>"}).join("")+"</div>"}
var pend=[];
function rid(){return Math.random().toString(36).slice(2)}
function mig(){S.cartoes=S.cartoes||{"Mercado Pago":{venc:7},"Play":{venc:23},"Nu":{venc:24}};S.notas=S.notas||{};S.pessoas=S.pessoas||["Eu"];S.entradas=S.entradas||[];S.imp=S.imp||[];S.banco=S.banco||0;S.carteira=S.carteira||0;
 S.items.forEach(function(x){if(x.q&&S.pessoas.indexOf(x.q)<0)S.pessoas.push(x.q);});if(S.v<3)S.v=3;migC()}
function addP(){rd();var n=($("np").value||"").trim();if(n&&S.pessoas.indexOf(n)<0)S.pessoas.push(n);if(n)F.q=n;save();sheet()}
function addE(){var n=$("ed1").value.trim(),v=parseFloat($("ev1").value);if(isNaN(v))return;S.entradas.push({id:rid(),d:S.mes==tm()?iso():S.mes+"-01",n:n||"Entrada",v:v});S.banco=(+S.banco||0)+v;save();draw()}
function delE(id){var e=S.entradas.find(function(i){return i.id==id});if(e){S.banco=(+S.banco||0)-e.v;S.entradas=S.entradas.filter(function(i){return i.id!=id});save();draw()}}
function saldo(){var en=S.entradas.filter(function(e){return e.d.slice(0,7)==S.mes}),te=en.reduce(function(a,e){return a+e.v},0);
 return'<h2>💰 Meu saldo</h2><div class="card"><div class="mu">Disponível (banco + carteira)</div><div class="big">'+R((+S.banco||0)+(+S.carteira||0))+'</div>'+S.contas.map(function(c,i){return'<div class="grid2" style="margin-bottom:6px"><input value="'+c.n+'" onchange="S.contas['+i+'].n=this.value;save()"><div class="top"><input type="number" step="0.01" style="width:100%" value="'+(c.v||"")+'" onchange="S.contas['+i+'].v=+this.value;save();draw()"><button class="x" onclick="delC('+i+')">✕</button></div></div>'}).join("")+'<button class="chip" onclick="addC()">+ Adicionar banco</button><div class="grid2" style="margin-top:8px"><div><div class="lab">Carteira (dinheiro)</div><input type="number" step="0.01" value="'+(S.carteira||"")+'" onchange="S.carteira=+this.value;save();draw()"></div></div><p class="mu">Entradas em '+MN(S.mes)+': <b class="ok">+ '+R(te)+'</b></p>'+en.map(function(e){return'<div class="row"><div class="ic" style="background:var(--c1)">💰</div><div class="n"><b>'+e.n+'</b><small>'+e.d.slice(8)+"/"+e.d.slice(5,7)+'</small></div><span class="v ok">+ '+R(e.v)+'</span><button class="x" onclick="delE(\''+e.id+'\')">✕</button></div>'}).join("")+'<div class="grid2"><input id="ed1" placeholder="Ex: salário"><input id="ev1" type="number" step="0.01" placeholder="Valor"></div><br><button class="chip on" onclick="addE()">+ Entrada</button></div>'}
function lerCsv(f){var r=new FileReader();r.onload=function(){var out=[];
 String(r.result).split(/\r?\n/).forEach(function(l){var p=l.split(/;|\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(function(z){return z.replace(/"/g,"").trim()});
 var d=p.find(function(z){return /^\d{2}\/\d{2}(\/\d{2,4})?$|^\d{4}-\d{2}-\d{2}$/.test(z)});if(!d)return;
 var vs=p.filter(function(z){return z!==d&&/^-?\s*(R\$)?\s*-?[\d.]+[,.]\d{2}$/.test(z)});if(!vs.length)return;
 var val=num(vs[0]);if(isNaN(val))return;out.push({d:toIso(d),t:p.filter(function(z){return z!==d&&vs.indexOf(z)<0}).join(" "),v:val})});
 var neg=out.some(function(o){return o.v<0}),used={};
 pend=out.map(function(o){var ent=neg?o.v>0:/dep[óo]sito|cr[ée]dito|recebid|sal[áa]rio|estorno/i.test(o.t),v=Math.abs(o.v),k=o.d+"|"+o.t+"|"+v.toFixed(2),mes=o.d.slice(0,7),p={d:o.d,t:o.t,v:v,ent:ent,key:k,mes:mes,dup:S.imp.indexOf(k)>-1};
  if(!ent&&!p.dup){var vv=vis(mes).filter(function(z){return !z.x.pago[mes]&&!used[z.x.id]}),m=vv.find(function(z){return Math.abs(z.x.v-v)<0.01});
   if(m){p.m=m.x.id;used[m.x.id]=1}else{var g=["Mercado Pago","Play","Nu"].find(function(c){var s=vv.filter(function(z){return z.x.g==c}).reduce(function(a,z){return a+z.x.v},0);return s>0&&Math.abs(s-v)<0.01});if(g)p.g=g}}
  return p});draw()};r.readAsText(f)}
function norm(s){return(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function ehMeu(t){var n=norm(S.meuNome).trim();if(!n)return false;var w=n.split(/\s+/),x=norm(t);return w.length>1?(x.indexOf(w[0])>-1&&x.indexOf(w[w.length-1])>-1):x.indexOf(n)>-1}
var KW=/transferencia (entre|propria)|mesma titularidade|transf\.? propria|aplicacao|resgate|\brdb\b|\bcdb\b|investimento/,KF=/pag(amento|to)? de fatura|pgto fatura|pagto fatura|fatura (do )?cart/;
function parseTxt(txt,src){var out=[];
 if(/<STMTTRN>/i.test(txt)){(txt.match(/<STMTTRN>[\s\S]*?(?=<\/STMTTRN>|<STMTTRN>|<\/BANKTRANLIST>|$)/gi)||[]).forEach(function(b){var g=function(k){var m=b.match(new RegExp("<"+k+">([^<\\r\\n]*)","i"));return m?m[1].trim():""};
  var d=g("DTPOSTED").slice(0,8),a=parseFloat(g("TRNAMT").replace(",","."));if(d.length<8||isNaN(a))return;out.push({d:d.slice(0,4)+"-"+d.slice(4,6)+"-"+d.slice(6,8),t:g("MEMO")||g("NAME"),v:a,src:src})})}
 else txt.split(/\r?\n/).forEach(function(l){var p=l.split(/;|\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(function(z){return z.replace(/"/g,"").trim()});
  var d=p.find(function(z){return /^\d{2}\/\d{2}(\/\d{2,4})?$|^\d{4}-\d{2}-\d{2}$/.test(z)});if(!d)return;
  var vs=p.filter(function(z){return z!==d&&/^-?\s*(R\$)?\s*-?[\d.]+[,.]\d{2}$/.test(z)});if(!vs.length)return;
  var val=num(vs[0]);if(isNaN(val))return;out.push({d:toIso(d),t:p.filter(function(z){return z!==d&&vs.indexOf(z)<0}).join(" "),v:val,src:src})});
 var neg=out.some(function(o){return o.v<0});out.forEach(function(o){o.ent=neg?o.v>0:/dep[oó]sito|cr[eé]dito|recebid|sal[aá]rio|estorno/i.test(o.t)});return out}
function analisa(rows){if(!rows.length){alert("Não consegui ler lançamentos. Se for PDF, manda aqui no chat que eu converto pra você 😊");return}
 var U={},R2={},used={};rows.forEach(function(o){o.v2=Math.abs(o.v)});
 rows.forEach(function(e){if(!e.ent||e.tr)return;var s=rows.find(function(z){return !z.ent&&!z.tr&&z.src!=e.src&&Math.abs(z.v2-e.v2)<0.01&&Math.abs(Date.parse(z.d)-Date.parse(e.d))<=3*864e5});if(s){e.tr=s.tr=1}});
 pend=rows.map(function(o){var v=o.v2,mes=o.d.slice(0,7),k0=(used=U[mes]=U[mes]||{}),k=o.d+"|"+o.t+"|"+v.toFixed(2),p={d:o.d,t:o.t,v:v,ent:o.ent,key:k,mes:mes,src:o.src,tr:o.tr,dup:S.imp.indexOf(k)>-1},x=norm(o.t);
  if(p.dup)return p;
  if(p.ent){if(!p.tr&&(ehMeu(o.t)||KW.test(x)))p.tr=1;if(!p.tr){var rc=vis(mes).find(function(z){return z.x.q&&z.x.q!="Eu"&&!z.x.pago[mes]&&!R2[z.x.id+mes]&&Math.abs(z.x.v-v)<0.01&&x.indexOf(norm(z.x.q))>-1});if(rc){p.rc=rc.x.id;R2[rc.x.id+mes]=1}}return p}
  if(!p.tr&&(ehMeu(o.t)||KW.test(x)))p.tr=1;if(!p.tr){var vv=vis(mes).filter(function(z){return !z.x.pago[mes]&&!used[z.x.id]}),m=vv.find(function(z){return Math.abs(z.x.v-v)<0.01});
   if(m){p.m=m.x.id;used[m.x.id]=1}else{var g=["Mercado Pago","Play","Nu"].find(function(c){var s=vv.filter(function(z){return z.x.g==c}).reduce(function(a,z){return a+z.x.v},0);return s>0&&Math.abs(s-v)<0.01});if(g)p.g=g;else if(ehMeu(o.t)||KW.test(x)||KF.test(x))p.tr=1}}
  return p});draw()}
function lerArq(fl){var arr=Array.prototype.slice.call(fl),rows=[],n=0;if(!arr.length)return;arr.forEach(function(f){var r=new FileReader();r.onload=function(){rows=rows.concat(parseTxt(String(r.result),f.name));if(++n==arr.length)analisa(rows)};r.readAsText(f)})}
function colar(){var t=$("cola").value;if(t.trim())analisa(parseTxt(t,"colado"))}
function importar(){var n=0,t=0;pend.forEach(function(p){if(p.dup)return;S.imp.push(p.key);if(p.tr){t++;return}n++;
 if(p.ent){if(p.rc){var rx=S.items.find(function(i){return i.id==p.rc});if(rx)rx.pago[p.mes]=true}S.entradas.push({id:rid(),d:p.d,n:p.t||"Depósito",v:p.v});S.banco=(+S.banco||0)+p.v}
 else{S.banco=(+S.banco||0)-p.v;
  if(p.m){var x=S.items.find(function(i){return i.id==p.m});x.pago[p.mes]=true}
  else if(p.g){vis(p.mes).forEach(function(o){if(o.x.g==p.g)o.x.pago[p.mes]=true})}
  else{var pk={};pk[p.mes]=true;S.items.push({id:rid(),n:(p.t||"Compra").slice(0,40),v:p.v,g:"Dia a dia",cur:0,tot:0,dia:+p.d.slice(8)||0,q:"",cat:guess(p.t||""),mes:p.mes,rec:false,pago:pk,pay:"Débito"})}}});
 pend=[];save();draw();alert(n+" lançamentos importados ✔"+(t?" · "+t+" transferências entre suas contas ignoradas":""))}
function extrato(){var h='<div class="card"><b>📎 Anexar extratos</b><p class="mu">Pode escolher vários arquivos de uma vez (CSV, OFX ou TXT), de contas diferentes. Pra eu reconhecer o que é transferência entre as suas contas, coloque seu nome:</p><input id="mn" placeholder="Seu nome completo" value="'+(S.meuNome||"")+'" onchange="S.meuNome=this.value;save()"><br><br><input type="file" multiple onchange="lerArq(this.files)"></div>';
 h+='<div class="card"><b>📋 Ou cole o texto do extrato</b><br><br><textarea id="cola" rows="4" style="width:100%;font:inherit;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);padding:8px" placeholder="Data;Descrição;Valor"></textarea><br><button class="chip on" onclick="colar()">Ler texto</button></div>';
 if(!pend.length)return h;var ok=pend.filter(function(p){return !p.dup}),nt=ok.filter(function(p){return p.tr}).length;
 h+='<div class="card wrap"><table><tr><th>Dia</th><th>Descrição</th><th>Valor</th><th></th></tr>'+pend.map(function(p){return"<tr><td>"+p.d.slice(8)+"/"+p.d.slice(5,7)+"</td><td>"+p.t+"</td><td>"+(p.ent?'<span class="ok">+ '+R(p.v)+"</span>":"- "+R(p.v))+"</td><td>"+(p.dup?'<span class="mu">já importado</span>':p.tr?'<span class="mu">↔ entre minhas contas</span>':p.rc?"💸 recebido":p.ent?"💰 entrada":p.m?"✔ baixa":p.g?"✔ fatura "+p.g:"🆕 lançar")+"</td></tr>"}).join("")+"</table></div>";
 return h+'<button class="btn" onclick="importar()">Importar '+(ok.length-nt)+' lançamentos</button><p class="mu">✔ dá baixa · 🆕 vira compra · 💰 soma no saldo · ↔ transferência sua, não conta como entrada nem como gasto ('+nt+').</p>'}
