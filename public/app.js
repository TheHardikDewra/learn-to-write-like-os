/* ===== shared: theme, nav, data, text engine ===== */
const PAGES=[["index.html","Overview"],["evolution.html","Evolution"],["lexicon.html","Lexicon"],
  ["phrase.html","Phrase"],["pattern.html","Pattern"],["register.html","Register"],["workbench.html","Workbench"],
  ["drills.html","Drills"],["regimen.html","Regimen"]];

/* Phosphor (MIT) sprite, inlined once per page */
function icon(name, cls){
  return `<svg class="ic ${cls||""}" aria-hidden="true"><use href="#ph-${name}"/></svg>`;
}
async function injectSprite(){
  try{
    const r=await fetch("icons.svg");
    const t=await r.text();
    const d=document.createElement("div");
    d.style.cssText="position:absolute;width:0;height:0;overflow:hidden";
    d.innerHTML=t; document.body.prepend(d);
  }catch(e){}
}
const PAGE_ICON={"index.html":"books","evolution.html":"chart-line","lexicon.html":"text-aa",
  "phrase.html":"quotes","pattern.html":"blueprint","register.html":"arrows-left-right",
  "workbench.html":"note-pencil","drills.html":"barbell","regimen.html":"calendar-check"};

function initChrome(){
  injectSprite();
  const cur=(location.pathname.split("/").pop()||"index.html").replace(/^$/,"index.html");
  const h=document.createElement("header"); h.className="nav";
  h.innerHTML=`<div class="nav-in">
    <a class="brand" href="index.html">Write like <span>Om&nbsp;Swami</span></a>
    <nav class="navlinks" id="navlinks">${PAGES.map(([f,n])=>
      `<a href="${f}" class="${f===cur?'on':''}">${icon(PAGE_ICON[f]||"circle")}<span>${n}</span></a>`).join("")}</nav>
    <div class="navbtns">
      <button class="tbtn" id="themeBtn" title="Light or dark" aria-label="Toggle theme">${icon("sun","i-sun")}${icon("moon","i-moon")}</button>
      <button class="tbtn menubtn" id="menuBtn" aria-label="Menu" aria-expanded="false"
        aria-controls="navlinks">${icon("list","i-open")}${icon("x","i-close")}</button>
    </div>
  </div>`;
  document.body.prepend(h);
  setTimeout(()=>{try{decorate()}catch(e){}},0);

  const saved=localStorage.getItem("os_theme");
  if(saved) document.documentElement.setAttribute("data-theme",saved);
  document.getElementById("themeBtn").onclick=()=>{
    const c=document.documentElement.getAttribute("data-theme");
    const next=c==="dark"?"light":c==="light"?"":"dark";
    if(next){document.documentElement.setAttribute("data-theme",next);localStorage.setItem("os_theme",next);}
    else{document.documentElement.removeAttribute("data-theme");localStorage.removeItem("os_theme");}
  };
  const btn=document.getElementById("menuBtn"), links=document.getElementById("navlinks");
  const close=()=>{h.classList.remove("open");btn.setAttribute("aria-expanded","false");
    document.body.style.overflow="";};
  btn.onclick=e=>{e.stopPropagation();
    const open=!h.classList.contains("open");
    h.classList.toggle("open",open); btn.setAttribute("aria-expanded",String(open));
    document.body.style.overflow=open&&innerWidth<=900?"hidden":"";};
  links.addEventListener("click",e=>{if(e.target.closest("a"))close();});
  document.addEventListener("click",e=>{if(!h.contains(e.target))close();});
  addEventListener("keydown",e=>{if(e.key==="Escape")close();});
  addEventListener("resize",()=>{if(innerWidth>900)close();});
}
/* decorate eyebrows / buttons with Phosphor glyphs, keyed by their own text */
const EYEBROW_ICON=[
  [/start here|how to use/i,"graduation-cap"],[/corpus|shelf/i,"books"],
  [/measured|numbers|live finding|tested claim/i,"chart-line"],
  [/layer one|the word/i,"text-aa"],[/layer two|the phrase/i,"quotes"],
  [/layer three|the pattern|deep set/i,"blueprint"],
  [/trainer|flashcard/i,"cards"],[/reference/i,"stack"],
  [/the arc|unified|divergent|evolution/i,"chart-line"],
  [/correction/i,"warning-circle"],[/negative space/i,"scissors"],
  [/generator|workbench/i,"note-pencil"],[/the gym|drill/i,"barbell"],
  [/programme|every day|twelve weeks/i,"calendar-check"],
  [/books against blog|register/i,"arrows-left-right"],
  [/pronoun|shape of one post|for your actual job/i,"seal-check"],
  [/adoption|do this/i,"target"],[/how he actually used/i,"quotes"],
];
function decorate(){
  document.querySelectorAll(".eyebrow").forEach(el=>{
    if(el.querySelector(".ic")) return;
    const t=el.textContent||"";
    const hit=EYEBROW_ICON.find(([re])=>re.test(t));
    el.insertAdjacentHTML("afterbegin", icon(hit?hit[1]:"sparkle")+" ");
  });
  document.querySelectorAll("input[type=search]").forEach(inp=>{
    if(inp.dataset.dec) return; inp.dataset.dec=1;
    const w=document.createElement("span"); w.className="searchwrap";
    inp.parentNode.insertBefore(w,inp); w.appendChild(inp);
    w.insertAdjacentHTML("afterbegin", icon("magnifying-glass","sic"));
  });
  document.querySelectorAll(".note b").forEach(el=>{
    if(!el.querySelector(".ic")) el.insertAdjacentHTML("afterbegin", icon("lightning")+" ");
  });
  document.querySelectorAll(".drill .test b, .tpl .demo b").forEach(el=>{
    if(!el.querySelector(".ic")) el.insertAdjacentHTML("afterbegin", icon("target")+" ");
  });
  document.querySelectorAll(".ship").forEach(el=>{
    if(!el.querySelector(".ic")) el.insertAdjacentHTML("afterbegin", icon("seal-check")+" ");
  });
}
const DATA={};
async function load(...names){
  await Promise.all(names.map(async n=>{
    if(DATA[n])return;
    const r=await fetch(`data/${n}.json`); DATA[n]=await r.json();
  }));
  queueMicrotask(()=>{try{decorate()}catch(e){}});
  setTimeout(()=>{try{decorate()}catch(e){}},60);
  return DATA;
}

/* ===== text engine ===== */
const RX_WORD=/[A-Za-zÀ-ɏ'’]+/g;
const ABBR=/\b(Mr|Mrs|Ms|Dr|St|Sri|Jr|Sr|etc|vs|i\.e|e\.g|No|Vol|Fig|pp)\.$/i;

function sentences(t){
  const parts=t.replace(/\s+/g," ").split(/(?<=[.!?])["'’)\]]*\s+/);
  const out=[]; let buf="";
  for(const p of parts){
    buf=buf?buf+" "+p:p;
    if(!ABBR.test(buf.trim())){ out.push(buf.trim()); buf=""; }
  }
  if(buf.trim()) out.push(buf.trim());
  return out.filter(s=>(s.match(RX_WORD)||[]).length>=2);
}
function words(t){ return t.match(RX_WORD)||[]; }
function syl(w){
  w=w.toLowerCase().replace(/[^a-z]/g,""); if(!w)return 0;
  let g=(w.match(/[aeiouy]+/g)||[]).length;
  if(w.endsWith("e")&&g>1&&!/(le|ee|ye)$/.test(w))g--;
  return Math.max(1,g);
}
const RX_LAT=/(tion|sion|ment|ance|ence|ity|ous|ive|ate|ify|ize|ise|able|ible|al|ic)$/;
const INTENS=["very","really","extremely","incredibly","truly","absolutely","completely","totally",
  "utterly","quite","simply","literally","actually","basically","essentially","fundamentally",
  "definitely","certainly","obviously","clearly","honestly","seriously","super","insanely","massively"];
const BANNED=[
 ["little did (i|he|she|they) know","novelistic cliché - he uses it zero times"],
 ["words (cannot|can't) describe","the confession that you did not describe it"],
 ["a shiver ran","stock body-horror"],
 ["(eyes|heart) (widened|skipped)","stock reaction shot"],
 ["at the end of the day","filler - zero uses across 216k words of his teaching prose"],
 ["needless to say","if it were needless you would not say it"],
 ["it goes without saying","same"],
 ["studies show|research (shows|suggests)","zero across four teaching books; name a mechanism or a person"],
 ["in conclusion|to sum up|to summarise|to summarize","he never summarises at a close"],
 ["moreover|furthermore","down 93% in his prose by 2024"],
 ["couldn't help but","hedge dressed as description"],
 ["the air was thick with","stock atmosphere"],
 ["time (seemed to slow|stood still for)","stock"],
 ["isn't just|is not just","the negation-then-reveal tell"],
 ["dive into|delve into","corporate filler"],
 ["unpack|leverage|paradigm","corporate abstraction; zero or near-zero in his prose"],
 ["game.?chang(er|ing)|next level","marketing filler"],
 ["i think that|i believe that|in my humble opinion","hedge stack"],
 ["very unique|most unique","broken intensifier"],
 ["perhaps (it )?(may|might)|it may perhaps","hedge stack - he uses one hedge, never two"]
];
const LY_SAID=/\b(\w+ly\s+(said|asked|replied)|\b(said|asked|replied)\s+\w+ly)\b/gi;

function analyse(text){
  const S=sentences(text), W=words(text), lw=W.map(w=>w.toLowerCase());
  const nw=W.length, ns=S.length;
  if(!ns||!nw) return null;
  const L=S.map(s=>(s.match(RX_WORD)||[]).length);
  const mean=L.reduce((a,b)=>a+b,0)/ns;
  const sd=Math.sqrt(L.reduce((a,b)=>a+(b-mean)**2,0)/ns);
  let burst=0; for(let i=0;i<L.length-1;i++) burst+=Math.abs(L[i+1]-L[i]);
  burst=L.length>1?burst/(L.length-1):0;
  let beats=0; for(let i=0;i<L.length-1;i++) if(L[i]>=25&&L[i+1]<=6) beats++;
  const low=text.toLowerCase();
  const count=re=>(low.match(re)||[]).length;
  return {
    n_words:nw, n_sents:ns,
    sent_mean:+mean.toFixed(1), sent_sd:+sd.toFixed(1),
    pct_le8:+(100*L.filter(x=>x<=8).length/ns).toFixed(1),
    pct_ge30:+(100*L.filter(x=>x>=30).length/ns).toFixed(1),
    pct_1syl:+(100*lw.filter(w=>syl(w)===1).length/nw).toFixed(1),
    pct_ge4syl:+(100*lw.filter(w=>syl(w)>=4).length/nw).toFixed(1),
    pct_latinate:+(100*lw.filter(w=>w.length>5&&RX_LAT.test(w)).length/nw).toFixed(1),
    pct_ly_adverb:+(100*lw.filter(w=>w.endsWith("ly")&&w.length>4).length/nw).toFixed(1),
    comma_per_sent:+((count(/,/g))/ns).toFixed(2),
    mean_word_len:+(W.reduce((a,w)=>a+w.length,0)/nw).toFixed(2),
    burstiness:+burst.toFixed(1),
    beats_per1k_s:+(1000*beats/ns).toFixed(1),
    semicolons:count(/;/g),
    exclamations:count(/!/g),
    intens:lw.filter(w=>INTENS.includes(w)).length,
    lysaid:(text.match(LY_SAID)||[]).length,
    conj_open_pct:+(100*S.filter(x=>["and","but","so","yet","or","because","for","then","now"]
        .includes(((x.match(RX_WORD)||[""])[0]||"").toLowerCase())).length/ns).toFixed(1),
    lengths:L, sents:S
  };
}

/* target bands: calibrated to THE LIVE VOICE - his last 12 blog posts,
   Oct 2025 to Aug 2026 - which is measurably tighter than his 2024 books.
   Values come from the same analyse() logic below, run over the re-scraped
   corpus, so the bands and the grader always agree. */
const BANDS={
  sent_mean:[12,16.5,"words per sentence","Live 14.3 · his 2024 books 14.2 · his 2024 blog was 16.6. He tightened."],
  sent_sd:[7,11.5,"sentence-length spread","Live 9.2. The variance is the style, not the average."],
  pct_le8:[24,42,"% sentences ≤ 8 words","Live 29.6%. Nearly one in three. This is where the verdict sits."],
  pct_ge30:[3,9.5,"% sentences ≥ 30 words","Live 7.0%. You still need long ones to make the short ones land."],
  pct_1syl:[66,100,"% one-syllable words","Live 72.3%. Seven in ten, and rising."],
  pct_ge4syl:[0,4,"% 4+ syllable words","Live 2.3%. Save the big words for dry exposition."],
  pct_latinate:[0,3.8,"% Latinate abstraction","Live 2.4%. The -tion/-ment/-ness layer he stripped out."],
  pct_ly_adverb:[0,1.9,"% -ly adverbs","Live 1.3%. He kept measuring adverbs and cut manner adverbs."],
  comma_per_sent:[0.7,1.35,"commas per sentence","Live 1.13. One or two clauses, not four."],
  burstiness:[7,12.5,"gear-change (avg jump)","Live 9.3. Long, then short."],
  beats_per1k_s:[0,60,"verdict beats / 1k sentences","Rare by design: only 1.6% of his sentences. A deliberate device, not a rhythm to hit."],
  conj_open_pct:[7,18,"% sentences opening And/But/So","Live 13.0%. One in eight. This is why he reads like speech."]
};
function grade(k,v){
  const [lo,hi]=BANDS[k]; if(v>=lo&&v<=hi) return "ok";
  const span=hi-lo||1; const d=v<lo?(lo-v)/span:(v-hi)/span;
  return d<=0.45?"mid":"off";
}
function scoreOf(m){
  const ks=Object.keys(BANDS); let s=0;
  for(const k of ks){const g=grade(k,m[k]); s+= g==="ok"?1:g==="mid"?0.5:0;}
  let pen=0;
  pen+=Math.min(6,m.semicolons*1.5)+Math.min(4,m.exclamations)+Math.min(6,m.intens*0.6)+m.lysaid*2;
  return Math.max(0,Math.round(100*s/ks.length - pen));
}
function findFlags(text){
  const out=[];
  for(const [pat,why] of BANNED){
    const re=new RegExp("\\b("+pat+")\\b","gi");
    const hits=[...text.matchAll(re)];
    if(hits.length) out.push({txt:hits[0][0],n:hits.length,why});
  }
  const low=text.toLowerCase();
  for(const w of INTENS){
    const n=(low.match(new RegExp("\\b"+w+"\\b","g"))||[]).length;
    if(n>=2) out.push({txt:w,n,why:"intensifier - swap for a specific number"});
  }
  const semi=(text.match(/;/g)||[]).length;
  if(semi) out.push({txt:"; ("+semi+")",n:semi,why:"he cut 83% of his semicolons in ten years. Use a full stop."});
  const ex=(text.match(/!/g)||[]).length;
  if(ex) out.push({txt:"! ("+ex+")",n:ex,why:"5 exclamation marks in a 52,000-word book, all inside dialogue."});
  const ing=[...text.matchAll(/(^|\.\s+)([A-Z]\w+ing\b[^,.]{0,40}),/g)];
  if(ing.length) out.push({txt:ing[0][2].slice(0,32)+"…",n:ing.length,
    why:"front-loaded participle. Main clause first - he cut these 25%."});
  return out.sort((a,b)=>b.n-a.n);
}
