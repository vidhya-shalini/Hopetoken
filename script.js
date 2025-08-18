/* ---------------- Utility & storage ---------------- */
const STORAGE_KEY = "hopetoken_demo_v1";
const el = id => document.getElementById(id);

function load(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch(e){return []} }
function save(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

/* ---------------- Smooth scroll ---------------- */
function scrollToId(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}) }

/* ---------------- Counters & UI updates ---------------- */
function updateCounters(){
  const list = load();
  const total = list.reduce((s,i)=>s + Number(i.amount||0),0);
  const donors = new Set(list.map(d=>d.email)).size;
  el('totalAmt').innerText = '₹' + total.toLocaleString();
  el('donorCount').innerText = donors;
  el('txCount').innerText = list.length;
}
function renderFeed(){
  const feed = el('liveFeed'); feed.innerHTML = '';
  const list = load().slice().sort((a,b)=>b.ts-a.ts);
  for(const d of list){
    const item = document.createElement('div'); item.className = 'item';
    item.innerHTML = `<strong>${escapeHtml(d.name)}</strong> donated <strong>₹${Number(d.amount).toLocaleString()}</strong> for <em>${escapeHtml(d.purpose)}</em>
      <div style="color:var(--muted);font-size:12px">${new Date(d.ts).toLocaleString()} • ${escapeHtml(d.message||'')}</div>`;
    feed.appendChild(item);
  }
  renderLeaderboard();
}
function renderLeaderboard(){
  const tbody = document.querySelector('#leaderboard tbody'); tbody.innerHTML = '';
  const list = load();
  const map = {};
  for(const d of list){ map[d.email] = map[d.email] || {name:d.name,total:0}; map[d.email].total += Number(d.amount||0) }
  const rows = Object.values(map).sort((a,b)=>b.total-a.total).slice(0,20);
  for(const r of rows){ const tr=document.createElement('tr'); tr.innerHTML = `<td>${escapeHtml(r.name)}</td><td>₹${Number(r.total).toLocaleString()}</td>`; tbody.appendChild(tr) }
}
function escapeHtml(s){ return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }

/* ---------------- Signup / Login validation ---------------- */
function validEmail(e){ if(!e||e.length<8) return false; const re=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; return re.test(e); }
function validPassword(p){ if(!p||p.length<8) return false; const hasUpper=/[A-Z]/.test(p); const hasLower=/[a-z]/.test(p); const hasNum=/\d/.test(p); const hasSpec=/[@#$!%*?&]/.test(p); return hasUpper && hasLower && hasNum && hasSpec; }

el('btnSignup').addEventListener('click', ()=>{
  const name = el('name').value.trim();
  const email = el('email').value.trim();
  const pass = el('password').value;
  el('errName').style.display = name? 'none':'block';
  el('errEmail').style.display = validEmail(email)? 'none':'block';
  el('errPass').style.display = validPassword(pass)? 'none':'block';
  if(!name||!validEmail(email)||!validPassword(pass)) return;
  // demo: store current user in sessionStorage (not secure)
  sessionStorage.setItem('ht_user', JSON.stringify({name,email}));
  el('authMsg').style.display = 'block'; el('authMsg').className='alert ok'; el('authMsg').innerText = 'Signed up & logged in (demo)';
});
el('btnLogin').addEventListener('click', ()=>{
  const name = el('name').value.trim() || 'Guest';
  const email = el('email').value.trim(); const pass = el('password').value;
  if(!validEmail(email) || pass.length===0){ el('authMsg').style.display='block'; el('authMsg').className='alert err'; el('authMsg').innerText='Invalid login (demo)'; return }
  sessionStorage.setItem('ht_user', JSON.stringify({name,email}));
  el('authMsg').style.display='block'; el('authMsg').className='alert ok'; el('authMsg').innerText='Logged in (demo)';
});

/* ---------------- Donation flow (calls secure pay) ---------------- */
el('btnDonate').addEventListener('click', ()=>{
  const user = JSON.parse(sessionStorage.getItem('ht_user')||'null');
  const amount = Number(el('amount').value||0);
  const purpose = el('purpose').value;
  const message = el('message').value.trim();
  el('donateError').style.display='none';
  if(!user){ el('donateError').style.display='block'; el('donateError').innerText='Please sign up / login first (demo)'; return; }
  if(!amount || amount < 10){ el('donateError').style.display='block'; el('donateError').innerText='Enter amount ≥ ₹10'; return; }
  // call secure pay simulator; on success, record donation
  startSecurePay({from:(user.email||'demo'), to:'hopetoken_splitter', token:'HTKN', amount}).then(txhash=>{
    // txhash is demo string; save donation record
    const list = load();
    list.push({id:'d_'+Date.now(), name:user.name, email:user.email, amount, purpose, message, ts:Date.now(), txhash});
    save(list); updateCounters(); renderFeed();
    el('donateAlert').style.display='block'; el('donateAlert').innerText='Donation recorded (demo) — tx: '+txhash;
    setTimeout(()=> el('donateAlert').style.display='none',4000);
    el('amount').value=''; el('message').value='';
  }).catch(err=>{
    el('donateError').style.display='block'; el('donateError').innerText = 'Payment cancelled or failed';
  });
});

/* split preview */
el('btnSplitPreview').addEventListener('click', ()=>{
  const amount = Number(el('amount').value||0);
  if(!amount){ alert('Enter amount to preview split'); return; }
  const f = Math.round(amount*0.5), e=Math.round(amount*0.3), s=Math.round(amount*0.2);
  alert(`Split preview:\n• Food: ₹${f}\n• Education: ₹${e}\n• Savings: ₹${s}`);
});

/* crypto quick buttons */
el('btnCryptoQuick').addEventListener('click', ()=> {
  el('fromAddr').value='hopetoken1quick';
  el('token').value='HTKN';
  el('cryptoAmount').value = 50;
  el('btnCryptoPay').click();
});

/* secure pay trigger from Crypto section */
el('btnCryptoPay').addEventListener('click', ()=>{
  const from = el('fromAddr').value || 'hopetoken1demo';
  const token = el('token').value || 'HTKN';
  const amount = Number(el('cryptoAmount').value || 0);
  if(!amount || amount <= 0){ alert('Enter crypto amount'); return; }
  startSecurePay({from, to:'hopetoken_splitter', token, amount}).then(txhash=>{
    // record a crypto-style donation (convert token units to INR-ish demo)
    const list = load(); list.push({id:'c_'+Date.now(), name:'Wallet Donor', email:'wallet@local', amount: Math.round(amount*80), purpose:'Crypto '+token, message:'on-chain demo tx', ts:Date.now(), txhash});
    save(list); updateCounters(); renderFeed();
    alert('Crypto simulated and recorded — tx: '+txhash);
  }).catch(()=>alert('Crypto transfer cancelled'));
});

/* CSV export & clear */
el('exportCSV').addEventListener('click', ()=>{
  const list = load();
  const rows=[['name','email','amount','purpose','message','ts','txhash']];
  for(const r of list) rows.push([r.name,r.email,r.amount,r.purpose,r.message,new Date(r.ts).toISOString(), r.txhash||'']);
  const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='hopetoken_donations.csv'; a.click(); URL.revokeObjectURL(url);
});
el('clearData').addEventListener('click', ()=>{ if(confirm('Clear local demo data?')){ localStorage.removeItem(STORAGE_KEY); updateCounters(); renderFeed(); } });

/* init sample data if empty */
(function init(){
  if(!localStorage.getItem(STORAGE_KEY)){
    const seed = [
      {id:'s1',name:'Asha',email:'asha@example.com',amount:500,purpose:'Food',message:'For kids',ts:Date.now()-86400000,txhash:'seed1'},
      {id:'s2',name:'Rahul',email:'rahul@example.com',amount:1200,purpose:'Education',message:'Books',ts:Date.now()-43200000,txhash:'seed2'},
      {id:'s3',name:'Priya',email:'priya@example.com',amount:800,purpose:'Medical',message:'Medicines',ts:Date.now()-7200000,txhash:'seed3'}
    ];
    save(seed);
  }
  updateCounters(); renderFeed();
})();

/* ---------------- Secure Pay Component Implementation ----------------
   This function drives the modal animation and returns a Promise that
   resolves with a demo txhash when complete, or rejects if cancelled.
*/
function startSecurePay({from='me', to='splitter', token='HTKN', amount=100}={}){
  return new Promise(async (resolve,reject)=>{
    const overlay = el('spOverlay'), term = el('spTerm'), meta = el('spMeta'), hint = el('spHint'), bar = el('spBar'), success = el('spSuccess'), okBtn = el('spOk'), confetti = el('spConfetti');
    overlay.style.display='flex'; overlay.setAttribute('aria-hidden','false'); term.innerHTML='[secure-pay] starting';
    meta.textContent = `From: ${from} → To: ${to} • ${token} ${amount}`;
    success.style.display='none'; okBtn.style.display='none'; confetti.innerHTML='';
    document.querySelectorAll('#spSteps .sp-step').forEach(s=>{s.classList.remove('active','done')}); bar.style.width='0%';
    const wait = ms => new Promise(r=>setTimeout(r,ms));
    const randHash = ()=>{ const b = crypto.getRandomValues(new Uint8Array(16)); return Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join('') };

    function write(text,cls){ const d = document.createElement('div'); if(cls) d.className=cls; d.textContent = text; term.appendChild(d); term.scrollTop = term.scrollHeight; }

    function setStep(n,state){
      document.querySelectorAll('#spSteps .sp-step').forEach(step=>{
        const id = +step.dataset.step;
        step.classList.toggle('active', id===n && state!=='done');
        if(id < n || state==='done') step.classList.add('done'); 
      });
      bar.style.width = Math.min((n-1)*16 + (state==='done'?16:6), 100) + '%';
    }

    // sequence
    try{
      // 1: key exchange
      setStep(1,'active'); hint.textContent='Exchanging ECDH keys…'; write('[kx] client_pub = '+randHash()); await wait(300);
      write('[kx] server_pub = '+randHash()); await wait(260); write('[kx] OK','sp-ok'); setStep(1,'done');

      // 2: derive secret
      setStep(2,'active'); hint.textContent='Deriving shared secret…';
      for(let i=0;i<3;i++){ write(`[kdf] h${i+1} = ${randHash()}`); await wait(220) }
      write('[kdf] secret ready','sp-ok'); setStep(2,'done');

      // 3: encrypt
      setStep(3,'active'); hint.textContent='Encrypting (AES-GCM)…';
      for(let i=0;i<4;i++){ write(`[aes] block ${i+1} = ${randHash()}`); await wait(160) }
      write('[aes] ciphertext ok','sp-ok'); setStep(3,'done');

      // 4: sign
      setStep(4,'active'); hint.textContent='Signing transaction…'; write('[sig] signature = '+randHash()); await wait(420);
      write('[sig] OK','sp-ok'); setStep(4,'done');

      // 5: broadcast
      setStep(5,'active'); hint.textContent='Broadcasting to network…';
      write('[p2p] peers: 68'); await wait(260); write('[p2p] txHash = '+randHash(),'sp-ok'); await wait(360); setStep(5,'done');

      // 6: confirmations
      setStep(6,'active'); hint.textContent='Waiting confirmations…';
      for(let i=1;i<=3;i++){ write(`[chain] confirmation ${i}/3 ✓`,'sp-ok'); await wait(380) }
      setStep(6,'done'); hint.textContent='Complete';

      // show success + confetti
      success.style.display='flex'; okBtn.style.display='inline-block';
      for(let i=0;i<40;i++){
        const p = document.createElement('div'); p.className='sp-piece';
        p.style.left = (Math.random()*100)+'%'; p.style.top='-10vh'; p.style.background = (i%2? '#22d3ee' : '#0ea5a0');
        p.style.animationDelay = (Math.random()*0.8)+'s'; confetti.appendChild(p);
      }
      const demoTx = 'tx_'+randHash();
      // allow user to click Done or auto-resolve after short delay
      okBtn.onclick = ()=>{ overlay.style.display='none'; overlay.setAttribute('aria-hidden','true'); resolve(demoTx); };
      el('spCancel').onclick = ()=>{ overlay.style.display='none'; overlay.setAttribute('aria-hidden','true'); reject(new Error('cancelled'))};
      // auto-close after 2s
      setTimeout(()=>{ overlay.style.display='none'; overlay.setAttribute('aria-hidden','true'); resolve(demoTx); }, 2500);
    }catch(err){ overlay.style.display='none'; overlay.setAttribute('aria-hidden','true'); reject(err) }
  });
}
