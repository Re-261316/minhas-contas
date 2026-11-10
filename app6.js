/* app6: atualizações (fatura, carteira) */
function fatPaga(k,v){var l=v.filter(function(o){return o.x.g==k});if(!l.length)return false;if((S.fp||{})[S.mes+"|"+k])return true;var m=l.filter(minha);return m.length>0&&m.every(pg)}
function fatRows(v){return["Mercado Pago","Play","Nu"].map(function(k){var l=v.filter(function(o){return o.x.g==k});if(!l.length)return"";var t=l.reduce(function(a,o){return a+o.x.v},0),pd=fatPaga(k,v);
 return'<div class="row '+(pd?"done":"")+'"><div class="ic" style="background:var('+GC[k]+')">💳</div><div class="n"><b>Fatura '+k+'</b><small>'+(pd?"✔ paga · ":"")+'vence '+vtxt({g:k,dia:0},S.mes)+' · '+l.length+' lançamentos</small></div><span class="v">'+R(t)+'</span><input type="checkbox" '+(pd?"checked":"")+' onchange="pagaFat(\''+k+'\')"></div>'}).join("")}
patchFn("resumo",[["gk=v.filter(function(o){return o.x.g==k&&minha(o)}),pd=gk.length&&gk.every(pg)","gk=0,pd=fatPaga(k,v)"]]);
patchFn("importar",[["if(p.m){var x=S.items.find(function(i){return i.id==p.m});x.pago[p.mes]=true}","if(p.m){var x=S.items.find(function(i){return i.id==p.m}),rcx=x.q&&x.q!=\"Eu\";if(!rcx)x.pago[p.mes]=true;else if(CARDS.indexOf(x.g)<0||x.g==\"Outro\"){x.pg2=x.pg2||{};x.pg2[p.mes]=true}if(CARDS.indexOf(x.g)>-1&&x.g!=\"Outro\"&&/fatura/.test(norm(p.t))){S.fp=S.fp||{};S.fp[p.mes+\"|\"+x.g]=true}}"],["else if(p.g){","else if(p.g){S.fp=S.fp||{};S.fp[p.mes+\"|\"+p.g]=true;"],["if(o.x.g==p.g)o.x.pago[p.mes]=true","if(o.x.g==p.g&&minha(o))o.x.pago[p.mes]=true"],["else{S.banco=(+S.banco||0)-p.v;","else{if(!(p.m&&S.mov&&S.mov[p.mes+\"|\"+p.m])&&!(p.g&&S.mov&&S.mov[p.mes+\"|fat|\"+p.g]))S.banco=(+S.banco||0)-p.v;"],["v:p.v});S.banco=(+S.banco||0)+p.v}","v:p.v});if(!(p.rc&&S.mov&&S.mov[p.mes+\"|\"+p.rc]))S.banco=(+S.banco||0)+p.v}"]]);
patchFn("row",[['" · 💸 "+x.q+" te deve"):"")','" · 💸 "+x.q+" te deve"):"")+(rc&&CARDS.indexOf(x.g)>-1&&x.g!="Outro"&&fatPaga(x.g,vis())?" · 💳 cartão pago":"")+(rc&&x.pg2&&x.pg2[S.mes]?" · ✔ parcela paga":"")']]);
patchFn("add",[["S.items.push(o);","S.items.push(o);if(o.pay==\"Dinheiro\"&&!o.q)S.carteira=(+S.carteira||0)-o.v;"]]);
function carteiraBlk(){return'<div style="background:var(--c4);border-radius:14px;padding:10px;margin:8px 0"><b>👛 Gastei em dinheiro</b><div class="grid2" style="margin:6px 0"><input id="cd1" placeholder="O que foi?"><input id="cv1" type="number" step="0.01" placeholder="Valor"></div><button class="chip on" onclick="baixaCart()">Dar baixa na carteira</button></div>'}
patchFn("saldo",[["<p class=\"mu\">Entradas em '","'+carteiraBlk()+'<p class=\"mu\">Entradas em '"]]);
function baixaCart(){var v=parseFloat($("cv1").value),n=($("cd1").value||"").trim()||"Gasto em dinheiro";if(isNaN(v)||v<=0){alert("Coloque o valor gasto.");return}
 if(v>(+S.carteira||0)&&!confirm("Você tem só "+R(+S.carteira||0)+" na carteira. Dar baixa mesmo assim?"))return;
 var mes=tm(),pk={};pk[mes]=true;S.items.push({id:rid(),n:n,v:v,g:"Dia a dia",cur:0,tot:0,dia:new Date().getDate(),q:"",cat:guess(n),mes:mes,rec:false,pago:pk,pay:"Dinheiro"});
 S.carteira=(+S.carteira||0)-v;S.mes=mes;save();draw()}
patchFn("analisa",[["vis(mes).filter(function(z){return !z.x.pago[mes]&&!used[z.x.id]})","vis(mes).filter(function(z){return (!z.x.pago[mes]||(S.mov&&(S.mov[mes+\"|\"+z.x.id]||(CARDS.indexOf(z.x.g)>-1&&S.mov[mes+\"|fat|\"+z.x.g]))))&&!used[z.x.id]})"]]);
var FN=null,PQf=null;
function aplicaMov(s,d){var i=(s&&s!="cart"&&s[0]=="c")?+s.slice(1):-1;if(s=="cart")S.carteira=Math.round(((+S.carteira||0)+d)*100)/100;else if(i>=0&&S.contas[i])S.contas[i].v=Math.round(((+S.contas[i].v||0)+d)*100)/100}
function movSet(k,s,d){S.mov=S.mov||{};if(s!="none")S.mov[k]={s:s,d:d}}
function movUndo(k){var r=S.mov&&S.mov[k];if(r){aplicaMov(r.s,-r.d);delete S.mov[k]}}
function fonte(tit,v,sinal,cb){FN={cb:cb,v:v,sinal:sinal};var o=S.contas.map(function(c,i){return'<button class="btn2 btn" onclick="fonteOk(\'c'+i+'\')">🏦 '+c.n+' · '+R(c.v)+'</button>'}).join("");
 $("sh").innerHTML='<div class="top"><h1>'+tit+'</h1><button onclick="closeS();draw()">✕</button></div><p><b>'+(sinal<0?"Sai ":"Entra ")+R(v)+'</b>. '+(sinal<0?"De onde saiu o dinheiro?":"Onde o dinheiro entrou?")+'</p>'+o+'<button class="btn2 btn" onclick="fonteOk(\'cart\')">👛 Carteira (dinheiro) · '+R(S.carteira)+'</button><button class="btn2 btn" style="opacity:.75" onclick="fonteOk(\'none\')">Não mexer no saldo</button>';$("ov").style.display="flex"}
function fonteOk(s){var f=FN;FN=null;$("ov").style.display="none";if(s!="none")aplicaMov(s,f.sinal*f.v);f.cb(s)}
function totFat(k){return vis().filter(function(o){return o.x.g==k}).reduce(function(a,o){return a+o.x.v},0)}
function pagarFat(k,s,pre){var m=S.mes,tot=totFat(k);S.fp=S.fp||{};S.fp[m+"|"+k]=true;if(s!="none"){if(!pre)aplicaMov(s,-tot);movSet(m+"|fat|"+k,s,-tot)}vis().filter(function(o){return o.x.g==k&&minha(o)}).forEach(function(o){o.x.pago[m]=true});save();draw()}
function pagaFat(k){var m=S.mes,v=vis(),on=fatPaga(k,v);S.fp=S.fp||{};
 if(on){movUndo(m+"|fat|"+k);S.fp[m+"|"+k]=false;v.filter(function(o){return o.x.g==k&&minha(o)}).forEach(function(o){o.x.pago[m]=false});save();draw();return}
 fonte("Pagar fatura "+k,totFat(k),-1,function(s){pagarFat(k,s,true)})}
function PQ(){var f=PQf;PQf=null;$("ov").style.display="none";if(f)f()}
function perguntaPaguei(t,sim,fn){PQf=fn;$("sh").innerHTML='<h1>'+t+'</h1><button class="btn" onclick="PQ()">'+sim+'</button><button class="btn2 btn" onclick="PQf=null;$(\'ov\').style.display=\'none\';save();draw()">Ainda não</button>';$("ov").style.display="flex"}
function tog(id){var x=S.items.find(function(i){return i.id==id}),m=S.mes,k=m+"|"+id,rc=x.q&&x.q!="Eu";
 if(x.pago[m]){movUndo(k);movUndo(k+"|p");if(x.pg2)x.pg2[m]=false;x.pago[m]=false;save();draw();return}
 if(x.g=="Dia a dia"||(CARDS.indexOf(x.g)>-1&&x.g!="Outro"&&!rc)){x.pago[m]=true;save();draw();return}
 if(rc){fonte("💸 "+x.q+" te pagou",x.v,1,function(s){x.pago[m]=true;movSet(k,s,x.v);
  if(CARDS.indexOf(x.g)>-1&&x.g!="Outro"){if(fatPaga(x.g,vis())){save();draw()}else perguntaPaguei("Você já pagou a fatura do "+x.g+" com esse dinheiro?","Sim, paguei a fatura ("+R(totFat(x.g))+")",function(){pagarFat(x.g,s)})}
  else perguntaPaguei("Você já pagou essa parcela ("+R(x.v)+")?","Sim, já paguei",function(){x.pg2=x.pg2||{};x.pg2[m]=true;if(s!="none"){aplicaMov(s,-x.v);movSet(k+"|p",s,-x.v)}save();draw()})});return}
 fonte("Pagar "+x.n,x.v,-1,function(s){x.pago[m]=true;movSet(k,s,-x.v);save();draw()})}
function bkBanner(){if(!S.items.length)return'<div class="card" style="background:var(--c2)">👋 App vazio. Toque no ⚙️ (no alto) pra restaurar um backup, ou no + pra lançar.</div>';if(S.ultBackup==iso())return"";return'<div class="card" style="background:var(--c2)">💾 O backup de hoje ainda não foi feito. <button class="chip on" onclick="ajustes()">Fazer agora</button></div>'}
function bkDia(){if(!S.items.length||S.ultBackup==iso()||S.lembrou==iso())return;var el=$("lk");if(el&&el.style.display!="none"&&pinCfg())return;S.lembrou=iso();save();
 $("sh").innerHTML='<h1>💾 Backup de hoje</h1><p class="mu">Seus dados ficam só neste aparelho. Que tal guardar uma cópia agora?</p><button class="btn" onclick="compartilhar();closeS()">📤 Compartilhar (Drive, WhatsApp…)</button><button class="btn2 btn" onclick="baixar();closeS()">⬇️ Baixar arquivo</button><button class="btn2 btn" onclick="closeS()">Agora não</button>';$("ov").style.display="flex"}
patchFn("destrava",[['if(el)el.style.display="none"','if(el)el.style.display="none";setTimeout(bkDia,300)']]);
setTimeout(bkDia,900);
(function(){var h=document.querySelector(".top h1");if(h)h.textContent="💰 Minhas Contas"})();
draw();
