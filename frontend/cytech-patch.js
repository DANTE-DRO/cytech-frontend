/* ============ CyTech Platform Patch — layers onto original design without changing it ============ */
(function(){
'use strict';
/* >>> SET YOUR RENDER BACKEND URL HERE <<< */
const API = window.CYTECH_API || 'https://cytechbackend.onrender.com';
const NOTES = [
 {id:'cybersecurity-foundations',t:'Cybersecurity Foundations',d:'CIA triad, threats, malware, defenses, careers'},
 {id:'ethical-hacking',t:'Ethical Hacking & Pentesting',d:'Recon, scanning, exploitation, post-exploitation, reports'},
 {id:'reverse-engineering',t:'Reverse Engineering',d:'Assembly, disassemblers, debuggers, malware analysis'},
 {id:'network-security',t:'Network Security',d:'TCP/IP, firewalls, IDS/IPS, Wireshark, VPNs'},
 {id:'linux-security-tools',t:'Linux & Security Tools',d:'Kali, Nmap, Burp, Metasploit, Hydra, John, Ghidra'},
 {id:'dfir',t:'Digital Forensics & IR',d:'Evidence, disk/memory forensics, incident response'}
];
const FREE_APPS=['terminal','cybot','sysmon','monitor','notepad','files','settings'];
const S={
 get tok(){return localStorage.cyt_token||''},set tok(v){localStorage.cyt_token=v||''},
 get user(){try{return JSON.parse(localStorage.cyt_user||'null')}catch(e){return null}},set user(v){localStorage.cyt_user=JSON.stringify(v)},
 get ent(){try{return JSON.parse(localStorage.cyt_ent||'[]')}catch(e){return []}},set ent(v){localStorage.cyt_ent=JSON.stringify(v)}
};
/* ---------- CSS ---------- */
const css=`
.cyt-btn{position:relative;display:inline-block;padding:10px 22px;background:linear-gradient(135deg,#021a12,#033);border:1px solid #00ff9c;color:#00ffe1!important;font-family:inherit;font-weight:bold;letter-spacing:1px;border-radius:6px;cursor:pointer;text-transform:uppercase;box-shadow:0 0 8px #00ff9c55,inset 0 0 8px #00ff9c22;transition:all .18s;animation:cytpulse 2.2s infinite;user-select:none;text-align:center}
.cyt-btn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 0 22px #00ff9c,inset 0 0 14px #00ff9c44;color:#fff!important}
.cyt-btn:active{transform:scale(.96)}
@keyframes cytpulse{0%,100%{box-shadow:0 0 8px #00ff9c55}50%{box-shadow:0 0 20px #00ff9c99}}
.cyt-overlay{position:fixed;inset:0;background:rgba(0,8,4,.82);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px)}
.cyt-modal{background:#050f0a;border:1px solid #00ff9c;border-radius:10px;box-shadow:0 0 40px #00ff9c44;width:min(560px,94vw);max-height:88vh;display:flex;flex-direction:column;font-family:'Share Tech Mono',monospace;color:#00ff9c;overflow:hidden}
.cyt-mhead{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:linear-gradient(90deg,#032,#011);border-bottom:1px solid #0f6;cursor:move;user-select:none}
.cyt-mhead b{color:#00ffe1;letter-spacing:2px}.cyt-x{background:#300;border:1px solid #f55;color:#f88;border-radius:4px;padding:2px 10px;cursor:pointer;font-family:inherit}
.cyt-x:hover{background:#f55;color:#000}
.cyt-mbody{padding:14px;overflow-y:auto}
.cyt-in{width:100%;box-sizing:border-box;background:#000;border:1px solid #0a5;color:#00ff9c;padding:10px;margin:6px 0;border-radius:5px;font-family:inherit}
.cyt-in:focus{outline:none;border-color:#00ffe1;box-shadow:0 0 10px #00ffe166}
.cyt-err{color:#f66;font-size:12px;min-height:14px}.cyt-ok{color:#0f6;font-size:13px}
.cyt-tabs{display:flex;gap:6px;margin-bottom:10px}.cyt-tab{flex:1;text-align:center;padding:7px;border:1px solid #084;border-radius:5px;cursor:pointer;color:#0a8}
.cyt-tab.on{background:#032;color:#00ffe1;box-shadow:0 0 10px #00ff9c55}
.cyt-card{border:1px solid #0a4;border-radius:8px;padding:12px;margin:8px 0;background:#071510;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;transition:all .2s}
.cyt-card:hover{border-color:#00ffe1;box-shadow:0 0 14px #00ff9c33;transform:translateX(3px)}
.cyt-badge{background:#013;border:1px solid #0f6;color:#0fc;border-radius:20px;padding:2px 12px;font-size:11px}
.cyt-step{border-left:3px solid #0f6;padding:6px 12px;margin:6px 0;background:#07151080}
.cyt-step b{color:#00ffe1}
.cyt-link{color:#00ffe1;cursor:pointer;text-decoration:underline}
#cyt-apppop{position:fixed;right:16px;bottom:70px;z-index:9998;width:min(340px,90vw)}
.cyt-toast{position:fixed;top:14px;left:50%;transform:translateX(-50%);background:#021a12;border:1px solid #00ff9c;color:#00ffe1;padding:10px 22px;border-radius:30px;z-index:10001;box-shadow:0 0 20px #00ff9c66;animation:cytpulse 1.5s infinite}
@media (max-width:768px){
 #icons{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(72px,1fr))!important;gap:8px!important;padding:8px!important;position:static!important;height:auto!important;max-height:calc(100vh - 130px);overflow-y:auto}
 .window,.win{max-width:96vw!important;max-height:80vh!important}
 #sysmon{position:static!important;width:100%!important;margin-top:6px}
 body{font-size:14px}
}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
/* ---------- helpers ---------- */
function toast(m){const t=document.createElement('div');t.className='cyt-toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),3200)}
async function api(p,method,body){const r=await fetch(API+p,{method:method||'GET',headers:{'Content-Type':'application/json',...(S.tok?{Authorization:'Bearer '+S.tok}:{})},body:body?JSON.stringify(body):undefined});return r.json().catch(()=>({error:'Network error'}))}
function dragify(el,handle){let x,y,dx,dy,on=false;handle=handle||el;
 handle.addEventListener('pointerdown',e=>{on=true;x=e.clientX;y=e.clientY;const r=el.getBoundingClientRect();dx=r.left;dy=r.top;el.style.position='fixed';el.style.left=dx+'px';el.style.top=dy+'px';el.style.right='auto';el.style.bottom='auto';el.style.margin='0';e.preventDefault()});
 addEventListener('pointermove',e=>{if(!on)return;el.style.left=(dx+e.clientX-x)+'px';el.style.top=(dy+e.clientY-y)+'px'});
 addEventListener('pointerup',()=>on=false)}
function modal(title,html,drag){const o=document.createElement('div');o.className='cyt-overlay';
 o.innerHTML='<div class="cyt-modal"><div class="cyt-mhead"><b>'+title+'</b><button class="cyt-x">X</button></div><div class="cyt-mbody">'+html+'</div></div>';
 document.body.appendChild(o);o.querySelector('.cyt-x').onclick=()=>o.remove();
 o.addEventListener('click',e=>{if(e.target===o)o.remove()});
 if(drag)dragify(o.querySelector('.cyt-modal'),o.querySelector('.cyt-mhead'));
 return o}
/* ---------- auth ---------- */
function authModal(){const o=modal('CYTECH LOGIN','<div class="cyt-tabs"><div class="cyt-tab on" data-t="login">LOGIN</div><div class="cyt-tab" data-t="signup">SIGN UP</div><div class="cyt-tab" data-t="forgot">FORGOT</div></div><div id="cyt-abody"></div><div class="cyt-err" id="cyt-aerr"></div>');
 const body=o.querySelector('#cyt-abody'),err=o.querySelector('#cyt-aerr');
 function render(t){o.querySelectorAll('.cyt-tab').forEach(x=>x.classList.toggle('on',x.dataset.t===t));err.textContent='';
  if(t==='login'){body.innerHTML='<input class="cyt-in" id="al-e" type="email" placeholder="Email"><input class="cyt-in" id="al-p" type="password" placeholder="Password"><button class="cyt-btn" style="width:100%" id="al-go">ENTER SYSTEM</button>';
   body.querySelector('#al-go').onclick=async()=>{const r=await api('/api/auth/login','POST',{email:body.querySelector('#al-e').value,password:body.querySelector('#al-p').value});
    if(r.token){S.tok=r.token;S.user=r.user;await refreshEnt();o.remove();toast('Welcome back, '+r.user.name)}else err.textContent=r.error||'Login failed'}}
  if(t==='signup'){body.innerHTML='<input class="cyt-in" id="as-n" placeholder="Full name"><input class="cyt-in" id="as-e" type="email" placeholder="Email"><input class="cyt-in" id="as-p" type="password" placeholder="Password (min 6 chars)"><button class="cyt-btn" style="width:100%" id="as-go">CREATE ACCOUNT</button>';
   body.querySelector('#as-go').onclick=async()=>{const r=await api('/api/auth/signup','POST',{name:body.querySelector('#as-n').value,email:body.querySelector('#as-e').value,password:body.querySelector('#as-p').value});
    if(r.token){S.tok=r.token;S.user=r.user;o.remove();toast('Account created — welcome, '+r.user.name)}else err.textContent=r.error||'Signup failed'}}
  if(t==='forgot'){body.innerHTML='<input class="cyt-in" id="af-e" type="email" placeholder="Your email"><button class="cyt-btn" style="width:100%" id="af-go">SEND RESET</button><div id="af-tok"></div>';
   body.querySelector('#af-go').onclick=async()=>{const r=await api('/api/auth/forgot','POST',{email:body.querySelector('#af-e').value});
    body.querySelector('#af-tok').innerHTML='<div class="cyt-ok">'+(r.message||'Check your email')+(r.devToken?'<br>DEV token: '+r.devToken+'<br><input class="cyt-in" id="af-np" type="password" placeholder="New password"><button class="cyt-btn" id="af-rs">RESET NOW</button>':'')+'</div>';
    const b=body.querySelector('#af-rs');if(b)b.onclick=async()=>{const rr=await api('/api/auth/reset','POST',{token:r.devToken,password:body.querySelector('#af-np').value});err.textContent=rr.ok?'Password reset — please login':(rr.error||'Failed')}}}}
 o.querySelectorAll('.cyt-tab').forEach(x=>x.onclick=()=>render(x.dataset.t));render('login')}
function requireAuth(){if(S.tok)return true;authModal();return false}
async function refreshEnt(){const r=await api('/api/me');if(r.entitlements){S.ent=r.entitlements;S.user=r.user}return r}
/* ---------- payments ---------- */
async function pay(purpose,onOk){if(!requireAuth())return;
 const o=modal('SECURE CHECKOUT — PAYSTACK','<div style="text-align:center;padding:20px"><div style="font-size:40px">&#x1F512;</div><p>Initializing secure M-PESA / card payment...</p><div class="cyt-err" id="pp-err"></div><div id="pp-st"></div></div>');
 const r=await api('/api/pay/init','POST',{purpose});
 if(r.error){o.querySelector('#pp-err').textContent=r.error;return}
 if(r.demo){const v=await api('/api/pay/verify/'+r.reference);o.remove();if(v.status==='success'){await refreshEnt();toast('Payment confirmed (demo)');onOk&&onOk()}return}
 if(r.authorization_url){const w=window.open(r.authorization_url,'cytpay','width=480,height=640');
  o.querySelector('#pp-st').innerHTML='<p>Complete the payment in the popup (M-PESA STK push / card).</p><button class="cyt-btn" id="pp-chk">I HAVE PAID</button>';
  const chk=async()=>{const v=await api('/api/pay/verify/'+r.reference);
   if(v.status==='success'){clearInterval(iv);o.remove();await refreshEnt();toast('Payment successful!');onOk&&onOk()}
   else o.querySelector('#pp-err').textContent='Not confirmed yet — complete payment then retry'};
  o.querySelector('#pp-chk').onclick=chk;const iv=setInterval(chk,6000)}}
/* ---------- new windows ---------- */
function openNotes(){const owned=S.ent.includes('notes');
 const rows=NOTES.map(n=>'<div class="cyt-card"><div><b style="color:#00ffe1">'+n.t+'</b><br><small>'+n.d+'</small></div>'+(owned?'<button class="cyt-btn" data-dl="'+n.id+'">DOWNLOAD PDF</button>':'<span class="cyt-badge">LOCKED — KES 30</span>')+'</div>').join('');
 const o=modal('CYTECH NOTES VAULT',(owned?'':'<p>One-time <b style="color:#ff0">KES 30</b> unlocks ALL study PDFs below (hundreds of pages, exam-ready).</p>')+rows+(owned?'':'<button class="cyt-btn" style="width:100%" id="nt-pay">UNLOCK ALL NOTES — KES 30</button>'),true);
 const b=o.querySelector('#nt-pay');if(b)b.onclick=()=>pay('notes',()=>{o.remove();openNotes()});
 o.querySelectorAll('[data-dl]').forEach(x=>x.onclick=()=>{window.open(API+'/notes/'+x.dataset.dl+'.pdf','_blank')})}
function openPracticals(){const owned=S.ent.includes('practicals');
 if(!owned){const o=modal('CYBER PRACTICALS — LOCKED','<p>Get hands-on: attack a live, legal practice target with guided step-by-step labs.</p><p>One-time <b style="color:#ff0">KES 100</b>.</p><button class="cyt-btn" style="width:100%" id="pr-pay">UNLOCK PRACTICALS — KES 100</button>',true);
  o.querySelector('#pr-pay').onclick=()=>pay('practicals',()=>{o.remove();openPracticals()});return}
 api('/api/me').then(me=>{const url=(me&&me.practicalUrl)||'http://testphp.vulnweb.com';
 modal('CYBER PRACTICALS LAB','<p>Target (authorized practice site): <a class="cyt-link" href="'+url+'" target="_blank">'+url+'</a></p>'+
 '<div class="cyt-step"><b>Step 1 — Recon:</b> visit the target, note technologies. Run <code>nmap -sV '+url.replace(/^https?:\/\//,'')+'</code> (use the online Kali tools panel or your own VM).</div>'+
 '<div class="cyt-step"><b>Step 2 — Map:</b> browse every page, list input fields and URL parameters like <code>?id=1</code>.</div>'+
 '<div class="cyt-step"><b>Step 3 — SQLi test:</b> append <code>\'</code> to a parameter and watch for SQL errors; try <code>\' OR \'1\'=\'1</code> in the login form.</div>'+
 '<div class="cyt-step"><b>Step 4 — XSS test:</b> submit <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> in the search box.</div>'+
 '<div class="cyt-step"><b>Step 5 — Scan:</b> run <code>nikto -h '+url+'</code> or OWASP ZAP/Burp passive scan; record findings.</div>'+
 '<div class="cyt-step"><b>Step 6 — Report:</b> write severity, impact and remediation for each finding — that is what a real pentest delivers.</div>'+
 '<p style="color:#fa0">Only attack targets you are authorized to test. This lab target is intentionally vulnerable and legal to practice on.</p>',true)})}
function openCourse(){const owned=S.ent.includes('course');
 if(!owned){const o=modal('APPLY — CYBERSECURITY COURSE','<p>Full CyTech bootcamp: ethical hacking, reverse engineering, forensics &amp; career mentorship.</p><p>Application fee: <b style="color:#ff0">KES 2,000</b></p><button class="cyt-btn" style="width:100%" id="co-pay">PAY & APPLY — KES 2,000</button>',true);
  o.querySelector('#co-pay').onclick=()=>pay('course',()=>{o.remove();openCourse()});return}
 api('/api/me').then(me=>{const a=(me&&me.application)||{};const note=(me&&me.adminNote)||'';
 modal('MY STUDENT PORTAL','<div class="cyt-card"><div><b style="color:#0f0">&#10003; REGISTERED</b><br>Applicant: '+(S.user?S.user.email:'')+'<br>Status: '+(a.status||'registered')+'<br>Since: '+(a.createdAt?new Date(a.createdAt).toLocaleString():'')+'</div><span class="cyt-badge">STUDENT</span></div>'+
 (note?'<div class="cyt-step"><b>Message from CyTech (venue & class times):</b><br>'+note.replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</div>':'<p>No announcements yet — check back soon.</p>')+
 '<button class="cyt-btn" onclick="window.print()">PRINT ADMISSION SLIP</button>',true)})}
function openTools(){modal('LINUX / CYBERSECURITY TOOLKIT',[
 ['Kali Linux','Full pentest distro','https://www.kali.org/get-kali/'],
 ['Nmap','Network scanner','https://nmap.org/download.html'],
 ['Wireshark','Packet analyzer','https://www.wireshark.org/download.html'],
 ['Burp Suite CE','Web proxy/scanner','https://portswigger.net/burp/communitydownload'],
 ['Metasploit','Exploitation framework','https://docs.metasploit.com/docs/using-metasploit/getting-started/nightly-installers.html'],
 ['Ghidra','Reverse engineering (NSA)','https://ghidra-sre.org/'],
 ['John the Ripper','Password cracker','https://www.openwall.com/john/'],
 ['Hashcat','GPU hash cracking','https://hashcat.net/hashcat/'],
 ['OWASP ZAP','Web app scanner','https://www.zaproxy.org/download/'],
 ['Hydra','Login brute-forcer','https://github.com/vanhauser-thc/thc-hydra'],
 ['Aircrack-ng','Wi-Fi auditing','https://www.aircrack-ng.org/downloads.html'],
 ['Autopsy','Disk forensics','https://www.autopsy.com/download/'],
 ['VirtualBox','Run lab VMs','https://www.virtualbox.org/wiki/Downloads'],
 ['Proton VPN','Free VPN tier','https://protonvpn.com/download'],
 ['Tor Browser','Anonymous browsing','https://www.torproject.org/download/']
 ].map(t=>'<div class="cyt-card"><div><b style="color:#00ffe1">'+t[0]+'</b><br><small>'+t[1]+'</small></div><button class="cyt-btn" onclick="window.open(\''+t[2]+'\',\'_blank\')">GET TOOL</button></div>').join(''),true)}
/* ---------- desktop icons ---------- */
function addIcon(label,glyph,fn){const c=document.getElementById('icons');if(!c)return;
 const d=document.createElement('div');d.className=c.children[0]?c.children[0].className:'icon';
 d.style.cssText='cursor:pointer;text-align:center;padding:6px';
 d.innerHTML='<div style="font-size:30px;filter:drop-shadow(0 0 6px #00ff9c)">'+glyph+'</div><div style="font-size:11px;color:#00ff9c;text-shadow:0 0 4px #000">'+label+'</div>';
 d.onclick=()=>{if(requireAuth())fn()};c.appendChild(d)}
/* ---------- app promo popup (draggable, dismissible, returns on refresh until downloaded) ---------- */
function appPopup(){if(localStorage.cyt_app_done)return;
 const o=document.createElement('div');o.id='cyt-apppop';
 o.innerHTML='<div class="cyt-modal"><div class="cyt-mhead"><b>GET THE CYTECH APP</b><button class="cyt-x">_</button></div><div class="cyt-mbody"><p>Install CyTech like WhatsApp/Instagram on your device:</p>'+
 '<button class="cyt-btn" style="width:100%;margin:4px 0" data-p="windows">&#x1F5A5; WINDOWS (.exe)</button>'+
 '<button class="cyt-btn" style="width:100%;margin:4px 0" data-p="android">&#x1F4F1; ANDROID (.apk)</button>'+
 '<button class="cyt-btn" style="width:100%;margin:4px 0" data-p="mac">&#x1F34E; macOS (.dmg)</button>'+
 '<button class="cyt-btn" style="width:100%;margin:4px 0" data-p="ios">&#x1F4F1; iPHONE (iOS)</button>'+
 '<small style="color:#0a8">Drag me anywhere. I come back on refresh until you install.</small></div></div>';
 document.body.appendChild(o);dragify(o.querySelector('.cyt-modal'),o.querySelector('.cyt-mhead'));
 o.querySelector('.cyt-x').onclick=()=>o.remove();
 o.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{localStorage.cyt_app_done='1';window.open(API+'/downloads/cytech-'+b.dataset.p+'.txt','_blank');o.remove();toast('Enjoy the CyTech app!')})}
/* ---------- gate original apps behind signup & make buttons clickable ---------- */
if(typeof window.openApp==='function'){const orig=window.openApp;
 window.openApp=function(id){if(!S.tok&&!FREE_APPS.includes(String(id).toLowerCase())){authModal();return}return orig.apply(this,arguments)}}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.classList.contains('cyt-btn')&&!b.classList.contains('cyt-x'))b.classList.add('cyt-btn')},true);
/* ---------- boot ---------- */
function init(){addIcon('Notes Vault','&#x1F4DA;',openNotes);addIcon('Practicals','&#x1F3AF;',openPracticals);addIcon('Apply Course','&#x1F393;',openCourse);addIcon('Sec Tools','&#x1F6E0;',openTools);
 setTimeout(appPopup,4000);
 if(S.tok)refreshEnt();
 addIcon('Account','&#x1F464;',()=>{if(S.tok){const u=S.user||{};const o=modal('MY ACCOUNT','<p>'+(u.name||'')+'<br>'+(u.email||'')+'</p><p>Entitlements: '+(S.ent.join(', ')||'none')+'</p><button class="cyt-btn" id="lo">LOGOUT</button>',true);o.querySelector('#lo').onclick=()=>{S.tok='';S.user=null;S.ent=[];o.remove();toast('Logged out')}}else authModal()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,1500));else setTimeout(init,1500);
})();
