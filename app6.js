/* app6: atualizações (fatura, carteira) */
function fatPaga(k,v){var l=v.filter(function(o){return o.x.g==k});if(!l.length)return false;if((S.fp||{})[S.mes+"|"+k])return true;var m=l.filter(minha);return m.length>0&&m.every(pg)}
function pagaFat(k){var v=vis(),on=fatPaga(k,v);S.fp=S.fp||{};S.fp[S.mes+"|"+k]=!on;v.filter(function(o){return o.x.g==k&&minha(o)}).forEach(function(o){o.x.pago[S.mes]=!on});save();draw()}
function fatRows(v){return["Mercado Pago","Play","Nu"].map(function(k){var l=v.filter(function(o){return o.x.g==k});if(!l.length)return"";var t=l.reduce(function(a,o){return a+o.x.v},0),pd=fatPaga(k,v);
 return'<div class="row '+(pd?"done":"")+'"><div class="ic" style="background:var('+GC[k]+')">💳</div><div class="n"><b>Fatura '+k+'</b><small>'+(pd?"✔ paga · ":"")+'vence '+vtxt({g:k,dia:0},S.mes)+' · '+l.length+' lançamentos</small></div><span class="v">'+R(t)+'</span><input type="checkbox" '+(pd?"checked":"")+' onchange="pagaFat(\''+k+'\')"></div>'}).join("")}
patchFn("resumo",[["gk=v.filter(function(o){return o.x.g==k&&minha(o)}),pd=gk.length&&gk.every(pg)","gk=0,pd=fatPaga(k,v)"]]);
patchFn("importar",[["if(p.m){var x=S.items.find(function(i){return i.id==p.m});x.pago[p.mes]=true}","if(p.m){var x=S.items.find(function(i){return i.id==p.m});x.pago[p.mes]=true;if(CARDS.indexOf(x.g)>-1&&/fatura/.test(norm(p.t))){S.fp=S.fp||{};S.fp[p.mes+\"|\"+x.g]=true}}"],["else if(p.g){","else if(p.g){S.fp=S.fp||{};S.fp[p.mes+\"|\"+p.g]=true;"]]);
patchFn("add",[["S.items.push(o);","S.items.push(o);if(o.pay==\"Dinheiro\"&&!o.q)S.carteira=(+S.carteira||0)-o.v;"]]);
function carteiraBlk(){return'<div style="background:var(--c4);border-radius:14px;padding:10px;margin:8px 0"><b>👛 Gastei em dinheiro</b><div class="grid2" style="margin:6px 0"><input id="cd1" placeholder="O que foi?"><input id="cv1" type="number" step="0.01" placeholder="Valor"></div><button class="chip on" onclick="baixaCart()">Dar baixa na carteira</button></div>'}
patchFn("saldo",[["<p class=\"mu\">Entradas em '","'+carteiraBlk()+'<p class=\"mu\">Entradas em '"]]);
function baixaCart(){var v=parseFloat($("cv1").value),n=($("cd1").value||"").trim()||"Gasto em dinheiro";if(isNaN(v)||v<=0){alert("Coloque o valor gasto.");return}
 if(v>(+S.carteira||0)&&!confirm("Você tem só "+R(+S.carteira||0)+" na carteira. Dar baixa mesmo assim?"))return;
 var mes=tm(),pk={};pk[mes]=true;S.items.push({id:rid(),n:n,v:v,g:"Dia a dia",cur:0,tot:0,dia:new Date().getDate(),q:"",cat:guess(n),mes:mes,rec:false,pago:pk,pay:"Dinheiro"});
 S.carteira=(+S.carteira||0)-v;S.mes=mes;save();draw()}
function bkBanner(){if(!S.items.length)return'<div class="card" style="background:var(--c2)">👋 App vazio. Toque no ⚙️ (no alto) pra restaurar um backup, ou no + pra lançar.</div>';if(S.ultBackup==iso())return"";return'<div class="card" style="background:var(--c2)">💾 O backup de hoje ainda não foi feito. <button class="chip on" onclick="ajustes()">Fazer agora</button></div>'}
function bkDia(){if(!S.items.length||S.ultBackup==iso()||S.lembrou==iso())return;var el=$("lk");if(el&&el.style.display!="none"&&pinCfg())return;S.lembrou=iso();save();
 $("sh").innerHTML='<h1>💾 Backup de hoje</h1><p class="mu">Seus dados ficam só neste aparelho. Que tal guardar uma cópia agora?</p><button class="btn" onclick="compartilhar();closeS()">📤 Compartilhar (Drive, WhatsApp…)</button><button class="btn2 btn" onclick="baixar();closeS()">⬇️ Baixar arquivo</button><button class="btn2 btn" onclick="closeS()">Agora não</button>';$("ov").style.display="flex"}
patchFn("destrava",[['if(el)el.style.display="none"','if(el)el.style.display="none";setTimeout(bkDia,300)']]);
setTimeout(bkDia,900);
(function(){var h=document.querySelector(".top h1");if(h)h.textContent="💰 Minhas Contas"})();
draw();
