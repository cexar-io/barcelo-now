import './style.css'
import logo from './assets/images/logo.png'
import loader from './assets/images/loader.svg'

const SHEETY_URL = 'https://api.sheety.co/55ad31708c31d543a624b88053f567d9/barcelo/hoja1'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <a href="https://vite.dev" target="_blank">
      <img src="${logo}" class="logo" alt="Barceló Now" />
    </a>
    <form class="card" id="lead-form">
      <input type="email" name="email" placeholder="User email." required />
      <input type="text" name="name" placeholder="User name." required />
      <input type="tel" name="phone" placeholder="User phone." required />
      <button type="submit">
        <span class="button-label">Play</span>
        <img class="button-loader" src="${loader}" alt="Loading" />
      </button>
      <p id="form-message" role="status" aria-live="polite"></p>
    </form>
  </div>
`

const form = document.querySelector('#lead-form')
const message = document.querySelector('#form-message')
const submitButton = form.querySelector('button[type="submit"]')
const emailInput = form.querySelector('input[name="email"]')
const RANDOM_CHARS = '&#*+%?£@§$'
let messageAnimationId = 0

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const randomText = (length) => {
  let text = ''
  while (text.length < length) {
    text += RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length))
  }
  return text
}

const animateMessageText = async (text) => {
  const animationId = ++messageAnimationId
  let currentLength = 0

  while (currentLength < text.length) {
    if (animationId !== messageAnimationId) return
    currentLength = Math.min(text.length, currentLength + 2)
    message.textContent = randomText(currentLength)
    await wait(20)
  }

  const fadeBuffer = Array.from(text).map((character) => ({
    cycles: Math.floor(Math.random() * 12) + 1,
    character,
  }))

  let hasPending = true
  while (hasPending) {
    if (animationId !== messageAnimationId) return

    hasPending = false
    let output = ''

    for (const item of fadeBuffer) {
      if (item.cycles > 0) {
        hasPending = true
        item.cycles -= 1
        output += RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length))
      } else {
        output += item.character
      }
    }

    message.textContent = output
    if (hasPending) await wait(50)
  }
}

const setMessage = (text, type = '') => {
  message.setAttribute('aria-label', text)
  message.className = type
  animateMessageText(text)
}

const setLoadingState = (isLoading) => {
  submitButton.disabled = isLoading
  submitButton.classList.toggle('is-loading', isLoading)
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!emailInput || emailInput.type !== 'email') {
    setMessage('Invalid form setup: email field must be type="email".', 'error')
    return
  }

  if (!form.checkValidity()) {
    setMessage('Please complete all fields with valid data.', 'error')
    return
  }

  const formData = new FormData(form)
  const body = {
    hoja1: {
      email: formData.get('email'),
      name: formData.get('name'),
      phone: formData.get('phone'),
    },
  }

  setLoadingState(true)

  try {
    const response = await fetch(SHEETY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Sheety respondió ${response.status}`)
    }

    const json = await response.json()
    console.log(json.hoja1)
    setMessage('Form sent successfully.', 'success')
    form.reset()
  } catch (error) {
    console.error(error)
    setMessage('Could not send the form. Please try again.', 'error')
  } finally {
    setLoadingState(false)
  }
})
