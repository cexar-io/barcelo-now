import './style.css'
import javascriptLogo from './javascript.svg'
import logo from './assets/images/logo.png'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <a href="https://vite.dev" target="_blank">
      <img src="${logo}" class="logo" alt="Barceló Now" />
    </a>
    <div class="card">
      <input type="email" placeholder="User email." />
      <input type="text" placeholder="User name." />
      <input type="tel" placeholder="User phone." />
      <button type="button">Play</button>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))
