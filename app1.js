var CATS={"Moradia":"🏠","Casa":"🛋️","Transporte":"🚗","Filhos":"🧸","Celular":"📱","Mercado":"🛒","Fast food":"🍔","Roupas":"👗","Saúde":"💊","Seguro":"🛡️","Reserva":"🐷","Pet":"🐶","Academia":"🏋️","Lazer":"🎈","Outros":"✨"};
var GR=["Fixas","Mercado Pago","Play","Nu","Outro","Dia a dia"],GC={"Fixas":"--c1","Mercado Pago":"--c2","Play":"--c3","Nu":"--c4","Outro":"--c6","Dia a dia":"--c5"};
var CARDS=["Mercado Pago","Play","Nu","Outro"],PAYS=["Crédito","Débito","Dinheiro","Pix"],QUEM=["Eu"];
var B=tm();
function I(n,v,g,c,t,d,q,cat,rec){return{id:Math.random().toString(36).slice(2),n:n,v:v,g:g,cur:c||0,tot:t||0,dia:d||0,q:q||"",cat:cat,mes:B,rec:!!rec,pago:{},pay:""}}
var seed=[];
function tm(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}
function iso(){var d=new Date();return tm()+"-"+String(d.getDate()).padStart(2,"0")}
var S={items:seed,lim:{},renda:0,mes:tm(),tab:"resumo",v:2},ed=null,ext=[],F={};
function save(){try{localStorage.setItem("mc1",JSON.stringify(S))}catch(e){}}
function $(i){return document.getElementById(i)}
function R(n){return(n||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function mi(m){var a=m.split("-");return a[0]*12+(+a[1])-1}
function mv(d){var k=mi(S.mes)+d,y=Math.floor(k/12);S.mes=y+"-"+String(k%12+1).padStart(2,"0");save();draw()}
function MN(m){var a=m.split("-");return["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"][a[1]-1]+"/"+a[0].slice(2)}
function vis(mm){var d=mi(mm||S.mes);return S.items.map(function(x){var o=d-mi(x.mes),c=x.tot?x.cur+o:0;
 if(x.tot){if(c<1||c>x.tot)return null}else if(!x.rec&&o!==0)return null;
 return{x:x,c:c,falta:x.tot?x.tot-c:0,dia:eff(x,mm||S.mes)}}).filter(Boolean)}
function pg(o){return !!o.x.pago[S.mes]}
function tog(id){var x=S.items.find(function(i){return i.id==id});x.pago[S.mes]=!x.pago[S.mes];save();draw()}
function guess(n){n=n.toLowerCase();var m={"ifood":"Fast food","lanche":"Fast food","burger":"Fast food","pizza":"Fast food","tênis":"Roupas","roupa":"Roupas","remédio":"Saúde","farm":"Saúde","mercado":"Mercado","luz":"Casa","gás":"Casa","aluguel":"Moradia","celular":"Celular","uber":"Transporte","gasolina":"Transporte","seguro":"Seguro","cinema":"Lazer","ração":"Pet","veterin":"Pet","wellhub":"Academia","academia":"Academia"};
 for(var k in m)if(n.indexOf(k)>-1)return m[k];return"Outros"}
function row(o){var x=o.x,hoje=(S.mes==tm()?new Date().getDate():0),st="";
 if(!pg(o)&&o.dia&&hoje&&x.g!="Dia a dia"){var df=o.dia-hoje;st=df<0?' · <span class="bad">atrasada</span>':df==0?' · <span class="warn">vence hoje</span>':df<=5?' · <span class="warn">em '+df+' dia(s)</span>':""}
 var rc=x.q&&x.q!="Eu";return'<div class="row '+(pg(o)?"done":"")+(rc?" recv":"")+'"><div class="ic" style="background:var('+GC[x.g]+')" onclick="openS(\''+x.id+'\')">'+(x.img?'<img src="'+x.img+'" style="width:100%;height:100%;object-fit:cover;border-radius:11px">':(x.emo||CATS[x.cat]||"✨"))+'</div><div class="n" onclick="openS(\''+x.id+'\')"><b>'+x.n+'</b><small>'+(o.dia?"dia "+o.dia+" · ":"")+(x.pay&&x.g=="Dia a dia"?x.pay+" · ":"")+(x.tot?"parcela "+o.c+"/"+x.tot+(o.falta?" · faltam "+o.falta:" · última!"):"")+(x.outro?" · "+x.outro:"")+(rc?" · 💸 "+x.q+" te deve":"")+st+'</small></div><span class="v">'+(rc?"+ ":"")+R(x.v)+'</span><button class="x" onclick="openS(\''+x.id+'\')" aria-label="Editar">✏️</button><input type="checkbox" '+(pg(o)?"checked":"")+' onchange="tog(\''+x.id+'\')"></div>'}
function resumo(){var v=vis(),t=0,tr=0,pm=0,fat={};v.forEach(function(o){if(o.x.q&&o.x.q!="Eu")tr+=o.x.v;else{t+=o.x.v;if(pg(o))pm+=o.x.v}fat[o.x.g]=(fat[o.x.g]||0)+o.x.v});
 var prox=v.filter(function(o){return !pg(o)&&o.dia&&o.x.g!="Dia a dia"}).sort(function(a,b){return a.dia-b.dia}),
 fim=v.filter(function(o){return o.x.tot&&o.falta<=2}),dd=v.filter(function(o){return o.x.g=="Dia a dia"}).sort(function(a,b){return b.x.dia-a.x.dia}).slice(0,4);
 var h='<div class="card hero"><div class="mu">Seus gastos em '+MN(S.mes)+'</div><div class="big">'+R(t)+'</div><div class="bar"><i style="width:'+(t?pm/t*100:0)+'%"></i></div><div class="mu">Pago '+R(pm)+' · falta '+R(t-pm)+'</div></div>';
 h+='<div class="g3">'+["Mercado Pago","Play","Nu"].map(function(k){var gk=v.filter(function(o){return o.x.g==k}),pd=gk.length&&gk.every(pg);return'<div style="background:var('+GC[k]+')"><span class="mu">'+k+'</span><b>'+R(fat[k])+'</b><span class="mu">'+(pd?"✔ paga":"vence "+vs(k))+'</span></div>'}).join("")+"</div>";
 var dev={};v.forEach(function(o){var k=o.x.q;if(k&&k!="Eu"){dev[k]=dev[k]||[0,0];dev[k][0]+=o.x.v;if(!pg(o))dev[k][1]+=o.x.v}});if(tr)h+='<h2>💸 Quem te deve</h2><div class="card">'+Object.keys(dev).map(function(k){return'<div class="row"><div class="ic" style="background:var(--c5)">💸</div><div class="n"><b>'+k+'</b><small>falta receber '+R(dev[k][1])+'</small></div><span class="v" style="color:var(--ok)">+ '+R(dev[k][0])+'</span></div>'}).join("")+'</div>';h+=saldo();
 h+='<h2>⏰ Próximos vencimentos</h2><div class="card">'+(prox.length?prox.slice(0,6).map(row).join(""):'<span class="mu">Nada com data. Toque numa conta e coloque o dia do vencimento.</span>')+'</div>';
 h+='<h2>🛍️ Últimas compras do dia a dia</h2><div class="card">'+(dd.length?dd.map(row).join(""):'<span class="mu">Toque no + pra lançar uma compra.</span>')+'</div>';
 h+='<h2>🏁 Parcelas acabando</h2><div class="card">'+(fim.length?fim.map(function(o){return'<div class="row"><div class="n"><b>'+o.x.n+'</b><small>'+(o.falta?"faltam "+o.falta+" parcela(s)":"última parcela!")+'</small></div><span class="v">'+R(o.x.v)+'</span></div>'}).join(""):'<span class="mu">Nada por enquanto.</span>')+'</div>';return h}
function contas(){var v=vis(),h="";GR.forEach(function(g){var l=v.filter(function(o){return o.x.g==g});if(!l.length)return;
 var t=l.reduce(function(a,o){return a+o.x.v},0);h+='<h2>'+g+' · '+R(t)+'</h2><div class="card">'+l.map(row).join("")+"</div>"});
 return h+'<h2>⚙️ Vencimento dos cartões</h2><div class="card"><div class="g3" style="gap:8px">'+["Mercado Pago","Play","Nu"].map(function(k){return'<div><div class="lab">'+k+'</div><input type="number" min="1" max="28" style="width:100%" value="'+S.cartoes[k].venc+'" onchange="S.cartoes[\''+k+'\'].venc=+this.value;save();draw()"></div>'}).join("")+'</div><p class="mu">Se cair no fim de semana, passa pro próximo dia útil (feriados não entram na conta).</p></div><p class="mu" style="text-align:center">Toque numa conta pra editar · ✔ pra marcar como paga</p>'+bkCard()}
function chips(k,opts,sel){return'<div class="chips">'+opts.map(function(o){return'<button class="chip '+(sel==o?"on":"")+'" onclick="sf(\''+k+'\',\''+o+'\')">'+(CATS[o]?CATS[o]+" ":"")+o+"</button>"}).join("")+"</div>"}
function sf(k,val){rd();F[k]=val;sheet()}
function rd(){["fv","fn","fdt","fp","ft","fd","fo"].forEach(function(i){var e=$(i);if(e)F[i]=e.value})}
function openS(id,pre){ed=id||null;var x=id&&S.items.find(function(i){return i.id==id});
 if(x){F={fix:x.rec&&x.g=="Fixas"||x.g=="Fixas",pay:x.g=="Dia a dia"?(x.pay||"Débito"):"Crédito",card:CARDS.indexOf(x.g)>-1?x.g:"Nu",cat:x.cat,q:x.q||"Eu",fv:x.v,fn:x.n,fdt:"",fp:x.tot?x.cur+mi(S.mes)-mi(x.mes):"",ft:x.tot||"",fd:x.dia||"",img:x.img||"",emo:x.emo||"",fo:x.outro||""}}
 else{F={fix:false,pay:"Crédito",card:"Nu",cat:"",q:"Eu",fv:"",fn:"",fdt:iso(),fp:"",ft:"",fd:""};if(pre)Object.assign(F,pre)}
 $("ov").style.display="flex";sheet()}
function closeS(){$("ov").style.display="none";ed=null}
function sheet(){var f=F;
 var h='<div class="top"><h1>'+(ed?"Editar":"Nova compra")+'</h1><button onclick="closeS()">✕</button></div><br>';
 h+='<input id="fv" type="number" inputmode="decimal" step="0.01" placeholder="R$ 0,00" style="font-size:26px;font-weight:700" value="'+(f.fv||"")+'"><input id="fn" placeholder="O que foi? (ex: pizza, farmácia)" value="'+(f.fn||"").replace(/"/g,"&quot;")+'">';
 h+='<div class="lab">Tipo</div><div class="chips"><button class="chip '+(!f.fix?"on":"")+'" onclick="sf(\'fix\',false)">🛍️ Compra</button><button class="chip '+(f.fix?"on":"")+'" onclick="sf(\'fix\',true)">🔁 Conta fixa do mês</button></div>';
 if(f.fix){h+='<div class="lab">Dia do vencimento</div><input id="fd" type="number" placeholder="Ex: 10" value="'+(f.fd||"")+'"><div class="lab">Parcelas (deixe vazio se repete sempre)</div><input id="ft" type="number" value="'+(f.ft||"")+'">'+(ed&&f.ft>1?'<div class="lab">Parcela atual (neste mês)</div><input id="fp" type="number" value="'+(f.fp||"")+'">':"")}
 else{h+='<div class="lab">Como pagou?</div>'+chips("pay",PAYS,f.pay);
  if(f.pay=="Crédito")h+='<div class="lab">Qual cartão?</div>'+chips("card",CARDS,f.card)+'<div class="lab">Parcelas (1 = à vista)</div><input id="ft" type="number" placeholder="1" value="'+(f.ft||"")+'">'+(ed&&f.ft>1?'<div class="lab">Parcela atual (neste mês)</div><input id="fp" type="number" value="'+(f.fp||"")+'">':"")+'<div class="lab">Dia do vencimento da fatura (opcional)</div><input id="fd" type="number" value="'+(f.fd||"")+'">';
  if(!ed)h+='<div class="lab">Data</div><input id="fdt" type="date" value="'+f.fdt+'">'}
 h+='<div class="lab">Categoria</div>'+chips("cat",Object.keys(CATS),f.cat)+(f.cat=="Outros"?'<input id="fo" placeholder="O que é? (ex: presente, cabeleireiro)" value="'+(f.fo||"")+'">':"")+iconBlk()+'<div class="lab">Quem gastou? (se não for você, ela te deve)</div>'+chips("q",S.pessoas,f.q)+'<div class="grid2"><input id="np" placeholder="Nova pessoa" style="margin:0"><button class="chip" onclick="addP()">+ pessoa</button></div><br><button class="btn" onclick="add()">Salvar</button>';
 if(ed)h+='<button class="btn2 btn" style="color:var(--bad)" onclick="del()">Apagar</button>';$("sh").innerHTML=h}
function add(){rd();var f=F,n=(f.fn||"").trim(),v=parseFloat(f.fv);if(!n||isNaN(v)){alert("Põe o nome e o valor 😊");return}
 var cat=f.cat||guess(n),q=f.q=="Eu"?"":f.q,o;
 if(f.fix){var t2=+f.ft>1?+f.ft:0;o={g:"Fixas",rec:!t2,tot:t2,cur:t2?(+f.fp||1):0,dia:+f.fd||0,pay:""}}
 else if(f.pay=="Crédito"){var t=+f.ft>1?+f.ft:0;o={g:f.card,rec:false,tot:t,cur:t?(+f.fp||1):0,dia:+f.fd||0,pay:"Crédito"}}
 else{o={g:"Dia a dia",rec:false,tot:0,cur:0,dia:+(f.fdt||iso()).slice(8)||0,pay:f.pay}}
 o.n=n;o.v=v;o.cat=cat;o.q=q;o.img=F.img||"";o.emo=F.emo||"";o.outro=cat=="Outros"?(F.fo||""):"";
 if(ed){var x=S.items.find(function(i){return i.id==ed});if(o.tot||x.tot)o.mes=S.mes;Object.assign(x,o)}
 else{o.mes=(f.fdt||iso()).slice(0,7);o.id=Math.random().toString(36).slice(2);o.pago={};if(o.g=="Dia a dia")o.pago[o.mes]=true;S.items.push(o);if(o.mes!=S.mes&&!o.rec)S.mes=o.mes}
 save();closeS();draw()}
function del(){if(confirm("Apagar essa conta?")){S.items=S.items.filter(function(i){return i.id!=ed});save();closeS();draw()}}
function num(s){s=s.replace(/[R$\s]/g,"");if(/,\d{1,2}$/.test(s))s=s.replace(/\./g,"").replace(",",".");return parseFloat(s)}
function toIso(d){if(/^\d{4}/.test(d))return d;var a=d.split("/"),y=a[2]?(a[2].length==2?"20"+a[2]:a[2]):new Date().getFullYear();return y+"-"+a[1]+"-"+a[0]}
