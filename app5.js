/* ---- leitura de extratos ---- */
var DRE=/^(\d{2})[\/.-](\d{2})[\/.-](\d{4}|\d{2})$|^(\d{4})-(\d{2})-(\d{2})(T.*)?$/;
function toIso2(s){var m=s.match(DRE);if(!m)return"";if(m[4])return m[4]+"-"+m[5]+"-"+m[6];return(m[3].length==2?"20"+m[3]:m[3])+"-"+m[2]+"-"+m[1]}
function money(s){s=String(s).replace(/[\u0000\s]/g,"").replace(/R\$/gi,"");if(!/^[+\-(]*[\d.,]+[)\-]?$/.test(s)||!/[,.]\d{2}[)\-]?$/.test(s))return NaN;var neg=/^\(|^-|-$/.test(s);s=s.replace(/[+\-()]/g,"");var c=s.lastIndexOf(","),p=s.lastIndexOf(".");
 if(c>-1&&p>-1)s=c>p?s.replace(/\./g,"").replace(",","."):s.replace(/,/g,"");else if(c>-1)s=s.replace(",",".");var n=parseFloat(s);return isNaN(n)?NaN:(neg?-n:n)}
function parseTxt(txt,src){var out=[];
 if(/<STMTTRN>/i.test(txt)){(txt.match(/<STMTTRN>[\s\S]*?(?=<\/STMTTRN>|<STMTTRN>|<\/BANKTRANLIST>|$)/gi)||[]).forEach(function(b){var g=function(k){var m=b.match(new RegExp("<"+k+">([^<\\r\\n]*)","i"));return m?m[1].trim():""};
  var d=g("DTPOSTED").slice(0,8),a=parseFloat(g("TRNAMT").replace(",","."));if(d.length<8||isNaN(a))return;out.push({d:d.slice(0,4)+"-"+d.slice(4,6)+"-"+d.slice(6,8),t:g("MEMO")||g("NAME"),v:a,src:src})})}
 else txt.split(/\r?\n/).forEach(function(l){var p=(/[;\t]/.test(l)?l.split(/[;\t]/):l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)).map(function(z){return z.replace(/"/g,"").trim()});
  var d=p.find(function(z){return DRE.test(z)});if(!d)return;var vs=p.filter(function(z){return z!==d&&!isNaN(money(z))});if(!vs.length)return;
  out.push({d:toIso2(d),t:p.filter(function(z){return z!==d&&vs.indexOf(z)<0}).join(" "),v:money(vs[0]),src:src})});
 var neg=out.some(function(o){return o.v<0});out.forEach(function(o){o.ent=neg?o.v>0:/dep[oó]sito|cr[eé]dito|recebid|sal[aá]rio|estorno/i.test(o.t)});return out}
function parseSeq(T,src){var i=T.findIndex(function(t){return /^DETALHEDOSMOVIMENTOS$/i.test(t.replace(/\s/g,""))}),out=[],cur=null;
 for(var k=i<0?0:i+1;k<T.length;k++){var t=T[k];if(/^Saldo final/i.test(t))break;
  if(/^(Data|Descri[cç][aã]o|Valor|Saldo|ID da opera[cç][aã]o)$/i.test(t)||/^\d{1,3}\/\d{1,3}$/.test(t)||/^DETALHEDOSMOVIMENTOS$/i.test(t.replace(/\s/g,""))||(/^(segunda|ter[cç]a|quarta|quinta|sexta|s[aá]bado|domingo)/i.test(t)&&/\d{4}/.test(t)))continue;
  if(DRE.test(t)){cur={d:toIso2(t),parts:[],vals:[]};out.push(cur);continue}if(!cur)continue;
  var m=money(t);if(!isNaN(m)){cur.vals.push(m);continue}if(/^\d{8,}$/.test(t))continue;cur.parts.push(t)}
 return out.filter(function(r){return r.vals.length}).map(function(r){var all=r.parts.join(" "),desc=all.replace(/^Debito visa electron brasil\s*/i,"").trim()||all;return{d:r.d,t:desc,v:r.vals[0],src:src,ent:r.vals[0]>0}})}
function parseNu(T,src){var i=T.findIndex(function(t){return /^Movimenta/i.test(t)}),out=[],d="",mode="",skip=false,acc=[],M={JAN:1,FEV:2,MAR:3,ABR:4,MAI:5,JUN:6,JUL:7,AGO:8,SET:9,OUT:10,NOV:11,DEZ:12};
 for(var k=i+1;k<T.length;k++){var t=T[k],m;
  if(/^VALORES EM R\$$/i.test(t)){acc=[];continue}
  if(m=t.match(/^(\d{2}) (JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ) (\d{4})$/i)){d=m[3]+"-"+String(M[m[2].toUpperCase()]).padStart(2,"0")+"-"+m[1];acc=[];continue}
  if(/^Total de entradas$/i.test(t)){mode="in";skip=true;acc=[];continue}
  if(/^Total de sa[ií]das$/i.test(t)){mode="out";skip=true;acc=[];continue}
  if(/^[+\-]?\s*[\d.]+,\d{2}$/.test(t)){if(skip){skip=false;continue}var v=money(t);if(!isNaN(v)&&d&&mode)out.push({d:d,t:acc.join(" ").trim(),v:Math.abs(v),src:src,ent:mode=="in"});acc=[];continue}
  if(/^(Tem alguma d|Caso a solu|Extrato gerado|O saldo l|N[aã]o nos respons|Asseguramos|Nu Financeira|Nu Pagamentos|CNPJ|Investimento$|metropolitanas|dispon[ií]veis)/i.test(t))continue;acc.push(t)}
 return out}
function titular(T){var c=/^EXTRATO DE CONTA$/i.test(T[0]||"")?T[1]:T[0];return c&&/^[A-Za-zÀ-ÿ ]+$/.test(c)&&c.trim().split(/\s+/).length>=2?c.trim():""}
function parsePdfToks(T,src){var n=titular(T);if(n&&!S.meuNome)S.meuNome=n;
 return(/Total de (entradas|sa[ií]das)/i.test(T.join("\n"))&&T.some(function(t){return /^Movimenta/i.test(t)}))?parseNu(T,src):parseSeq(T,src)}
function loadScr(u){return new Promise(function(ok,no){var s=document.createElement("script");s.src=u;s.onload=ok;s.onerror=function(){no(new Error("sem internet para carregar o leitor"))};document.head.appendChild(s)})}
async function pdfToks(f){if(!window.pdfjsLib){await loadScr("https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js");pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"}
 var d=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,out=[];for(var p=1;p<=d.numPages;p++){var tc=await(await d.getPage(p)).getTextContent();tc.items.forEach(function(it){var s=(it.str||"").trim();if(s)out.push(s)})}return out}
async function xlsTxt(f){if(!window.XLSX)await loadScr("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");var wb=XLSX.read(await f.arrayBuffer(),{type:"array",cellDates:true}),o=[];wb.SheetNames.forEach(function(n){o.push(XLSX.utils.sheet_to_csv(wb.Sheets[n],{FS:";",dateNF:"dd/mm/yyyy"}))});return o.join("\n")}
function desdePad(){var d=new Date();d.setMonth(d.getMonth()-1);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-01"}
async function lerArq(fl){var arr=Array.prototype.slice.call(fl),rows=[],falhas=[],ds=S.desde||desdePad();if(!arr.length)return;
 for(var i=0;i<arr.length;i++){var f=arr[i],nm=(f.name||"").toLowerCase();try{
  if(/\.pdf$/.test(nm)||f.type=="application/pdf")rows=rows.concat(parsePdfToks(await pdfToks(f),f.name));
  else if(/\.xlsx?$/.test(nm))rows=rows.concat(parseTxt(await xlsTxt(f),f.name));
  else rows=rows.concat(parseTxt(await f.text(),f.name))}catch(e){falhas.push(f.name+": "+(e.message||e))}}
 if(falhas.length)alert("Não consegui ler:\n"+falhas.join("\n"));save();analisa(rows.filter(function(r){return r.d>=ds}))}
function colar(){var t=$("cola").value;if(t.trim())analisa(parseTxt(t,"colado").filter(function(r){return r.d>=(S.desde||desdePad())}))}
KW=/transferencia (entre|propria)|mesma titularidade|transf\.? propria|^aplicacao|resgate (rdb|cdb|de investimento)|\brdb\b|\bcdb\b|investimento/;
patchFn("ehMeu",[["x.indexOf(w[w.length-1])>-1","x.indexOf(w[w.length-1].slice(0,4))>-1"],["var n=norm(S.meuNome).trim();","if(/salario/.test(norm(t)))return false;var n=norm(S.meuNome).trim();"]]);
patchFn("analisa",[["Não consegui ler lançamentos. Se for PDF, manda aqui no chat que eu converto pra você 😊","Não encontrei lançamentos nesse arquivo, ou nada depois da data escolhida em “Importar a partir de”. Confira se é um extrato (PDF, Excel, CSV ou OFX)."]]);
patchFn("extrato",[["<br><br><input type=\"file\" multiple","<div class=\"lab\">Importar lançamentos a partir de:</div><input type=\"date\" value=\"'+(S.desde||desdePad())+'\" onchange=\"S.desde=this.value;save()\"><br><input type=\"file\" multiple"],["(CSV, OFX ou TXT)","(PDF, Excel, CSV, OFX ou TXT; PDF e Excel precisam de internet na 1ª vez)"]]);
/* ---- inicialização ---- */
(function(){var st=document.createElement("style");st.textContent="#lk{background:var(--bg);align-items:center;justify-content:center;text-align:center}.lkb{max-width:320px;width:100%}.pds{display:flex;gap:12px;justify-content:center;margin:16px 0}.pd{width:14px;height:14px;border-radius:50%;border:2px solid var(--ac)}.pd.on{background:var(--ac)}.pkp{display:grid;grid-template-columns:repeat(3,72px);gap:12px;justify-content:center}.pk{height:72px;border-radius:50%;font-size:24px;border:0;background:var(--c4)}.recv.done .n b{text-decoration:line-through}";document.head.appendChild(st);
 var top=document.querySelector(".top");if(top&&top.lastElementChild)top.lastElementChild.insertAdjacentHTML("beforeend",' <button onclick="ajustes()" aria-label="Ajustes">⚙️</button>');
 aplicaTema();if(pinCfg())travar();
 document.addEventListener("visibilitychange",function(){if(document.hidden)LK.h=Date.now();else if(pinCfg()&&Date.now()-LK.h>60000)travar()});
 draw();
 var q=new URLSearchParams(location.search);if(q.get("novo")||q.get("v")){var P={credito:"Crédito",debito:"Débito",pix:"Pix",dinheiro:"Dinheiro"},C={nu:"Nu",play:"Play",mp:"Mercado Pago","mercado pago":"Mercado Pago"};
  openS(null,{fv:q.get("v")||"",fn:q.get("n")||"",pay:P[(q.get("pay")||"").toLowerCase()]||"Crédito",card:C[(q.get("card")||"").toLowerCase()]||"Nu"});history.replaceState(null,"",location.pathname)}})();
