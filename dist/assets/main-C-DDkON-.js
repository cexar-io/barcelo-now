import{l as y,a as g}from"./loader-CM_iV2ui.js";const b="https://api.sheety.co/55ad31708c31d543a624b88053f567d9/barcelo/hoja1";document.querySelector("#app").innerHTML=`
  <div class="container">
    <a href="https://vite.dev" target="_blank">
      <img src="${y}" class="logo" alt="Barceló Now" />
    </a>
    <form class="card" id="lead-form">
      <input type="email" name="email" placeholder="User email." required />
      <input type="text" name="name" placeholder="User name." required />
      <input type="tel" name="phone" placeholder="User phone." required />
      <button type="submit">
        <span class="button-label">Play</span>
        <img class="button-loader" src="${g}" alt="Loading" />
      </button>
      <p id="form-message" role="status" aria-live="polite"></p>
    </form>
  </div>
`;const n=document.querySelector("#lead-form"),i=document.querySelector("#form-message"),u=n.querySelector('button[type="submit"]'),h=n.querySelector('input[name="email"]'),c="&#*+%?£@§$";let d=0;const p=e=>new Promise(t=>setTimeout(t,e)),w=e=>{let t="";for(;t.length<e;)t+=c.charAt(Math.floor(Math.random()*c.length));return t},M=async e=>{const t=++d;let o=0;for(;o<e.length;){if(t!==d)return;o=Math.min(e.length,o+2),i.textContent=w(o),await p(20)}const a=Array.from(e).map(s=>({cycles:Math.floor(Math.random()*12)+1,character:s}));let r=!0;for(;r;){if(t!==d)return;r=!1;let s="";for(const m of a)m.cycles>0?(r=!0,m.cycles-=1,s+=c.charAt(Math.floor(Math.random()*c.length))):s+=m.character;i.textContent=s,r&&await p(50)}},l=(e,t="")=>{i.setAttribute("aria-label",e),i.className=t,M(e)},f=e=>{u.disabled=e,u.classList.toggle("is-loading",e)};n.addEventListener("submit",async e=>{if(e.preventDefault(),!h||h.type!=="email"){l('Invalid form setup: email field must be type="email".',"error");return}if(!n.checkValidity()){l("Please complete all fields with valid data.","error");return}const t=new FormData(n),o={hoja1:{email:t.get("email"),name:t.get("name"),phone:t.get("phone")}};f(!0);try{const a=await fetch(b,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!a.ok)throw new Error(`Sheety respondió ${a.status}`);const r=await a.json();console.log(r.hoja1),l("Form sent successfully.","success"),n.reset()}catch(a){console.error(a),l("Could not send the form. Please try again.","error")}finally{f(!1)}});
