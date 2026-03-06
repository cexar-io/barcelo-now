import{l as k,a as I}from"./loader-CM_iV2ui.js";const h="https://api.sheety.co/55ad31708c31d543a624b88053f567d9/barcelo/ranking";document.body.classList.add("ranking-page");document.querySelector("#app").innerHTML=`
  <main class="ranking-container">
    <header class="ranking-header">
      <div class="ranking-title-wrap">
        <h1>WINNERS RANKING</h1>
      </div>
      <div class="ranking-logo-wrap">
        <img src="${k}" class="ranking-logo" alt="Barceló Now" />
      </div>
    </header>

    <div id="ranking-loading" class="ranking-loading">
      <img src="${I}" class="ranking-loader" alt="Loading" />
    </div>

    <section class="ranking-table-card" aria-live="polite">
      <p id="ranking-status" class="ranking-status"></p>
      <table class="ranking-table" aria-label="Winners ranking table">
        <tbody id="ranking-body"></tbody>
      </table>
    </section>
  </main>
`;const d=document.querySelector("#ranking-status"),m=document.querySelector("#ranking-body"),g=document.querySelector("#ranking-loading"),N=document.querySelector(".ranking-table-card"),S=()=>{g.hidden=!1,N.hidden=!0,d.textContent=""},b=n=>{if(n==null)return Number.POSITIVE_INFINITY;const e=String(n).trim();if(!e)return Number.POSITIVE_INFINITY;const r=e.replace(",",".");if(r.includes(":")){const t=r.split(":").map(a=>Number(a));return t.some(a=>Number.isNaN(a))?Number.POSITIVE_INFINITY:t.length===2?(t[0]*60+t[1])*1e3:t.length===3?(t[0]*3600+t[1]*60+t[2])*1e3:Number.POSITIVE_INFINITY}const i=Number(r);return Number.isNaN(i)?Number.POSITIVE_INFINITY:i*1e3},p=n=>{if(n==null)return"-";const e=String(n).trim();if(!e)return"-";const r=e.replace(",",".");if(r.includes(":")){const s=r.split(":").map(c=>c.trim());if(s.some(c=>c===""||Number.isNaN(Number(c))))return"-";const l=Number(s.length===3?s[0]*60+Number(s[1]):s[0]),f=Number(s[s.length-1]);return`${String(l).padStart(2,"0")}:${String(f).padStart(2,"0")}`}if(Number.isNaN(Number(r)))return"-";const[i,t=""]=r.split("."),a=String(Math.max(0,Number(i))).padStart(2,"0"),o=(t+"00").slice(0,2);return`${a}:${o}`},u=(n,e)=>{for(const r of e)if(n[r]!=null&&n[r]!=="")return String(n[r]).trim();return""},T=n=>Array.isArray(n)?n:!n||typeof n!="object"?[]:Array.isArray(n.rankings)?n.rankings:Array.isArray(n.ranking)?n.ranking:Array.isArray(n.data)?n.data:[],y=n=>{if(g.hidden=!0,N.hidden=!1,!n.length){m.innerHTML="",d.textContent="No ranking data available.";return}d.textContent="";const r=[...n].sort((i,t)=>{const a=b(u(i,["tiempo","time"])),o=b(u(t,["tiempo","time"]));return a-o}).map((i,t)=>{const a=`${String(t+1).padStart(2,"0")}.`,o=u(i,["nickname","nombre","name"])||"Sin nombre",s=u(i,["tiempo","time"]),l=p(s);return`
        <tr>
          <td>${a}</td>
          <td>${o}</td>
          <td>${l}</td>
        </tr>
      `}).join("");m.innerHTML=r},w=async()=>{S();try{const n=await fetch(h);if(!n.ok)throw new Error(`Sheety respondió ${n.status}`);const e=await n.json();y(T(e))}catch(n){console.error(n),g.hidden=!0,N.hidden=!1,m.innerHTML="",d.textContent="Could not load ranking right now."}};w();
