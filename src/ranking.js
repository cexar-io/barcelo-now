import './style.css'
import logo from './assets/images/logo.png'
import loader from './assets/images/loader.svg'

const RANKING_URL = 'https://api.sheety.co/55ad31708c31d543a624b88053f567d9/barcelo/ranking'

document.body.classList.add('ranking-page')

document.querySelector('#app').innerHTML = `
  <main class="ranking-container">
    <header class="ranking-header">
      <div class="ranking-title-wrap">
        <h1>WINNERS RANKING</h1>
      </div>
      <div class="ranking-logo-wrap">
        <img src="${logo}" class="ranking-logo" alt="Barceló Now" />
      </div>
    </header>

    <div id="ranking-loading" class="ranking-loading">
      <img src="${loader}" class="ranking-loader" alt="Loading" />
    </div>

    <section class="ranking-table-card" aria-live="polite">
      <p id="ranking-status" class="ranking-status"></p>
      <table class="ranking-table" aria-label="Winners ranking table">
        <tbody id="ranking-body"></tbody>
      </table>
    </section>
  </main>
`

const status = document.querySelector('#ranking-status')
const body = document.querySelector('#ranking-body')
const loading = document.querySelector('#ranking-loading')
const section = document.querySelector('.ranking-table-card')

const setLoading = () => {
  loading.hidden = false
  section.hidden = true
  status.textContent = ''
}

const parseTimeToMs = (value) => {
  if (value == null) return Number.POSITIVE_INFINITY

  const raw = String(value).trim()
  if (!raw) return Number.POSITIVE_INFINITY

  const normalized = raw.replace(',', '.')

  if (normalized.includes(':')) {
    const parts = normalized.split(':').map((part) => Number(part))
    if (parts.some((part) => Number.isNaN(part))) return Number.POSITIVE_INFINITY

    if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1_000
    if (parts.length === 3) return (parts[0] * 3_600 + parts[1] * 60 + parts[2]) * 1_000
    return Number.POSITIVE_INFINITY
  }

  const numeric = Number(normalized)
  if (Number.isNaN(numeric)) return Number.POSITIVE_INFINITY
  return numeric * 1_000
}

const formatTime = (value) => {
  if (value == null) return '-'

  const raw = String(value).trim()
  if (!raw) return '-'

  const normalized = raw.replace(',', '.')

  if (normalized.includes(':')) {
    const parts = normalized.split(':').map((part) => part.trim())
    if (parts.some((part) => part === '' || Number.isNaN(Number(part)))) return '-'
    const minutes = Number(parts.length === 3 ? parts[0] * 60 + Number(parts[1]) : parts[0])
    const seconds = Number(parts[parts.length - 1])
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  if (Number.isNaN(Number(normalized))) return '-'
  const [whole, fraction = ''] = normalized.split('.')
  const left = String(Math.max(0, Number(whole))).padStart(2, '0')
  const right = (fraction + '00').slice(0, 2)
  return `${left}:${right}`
}

const getStringValue = (row, keys) => {
  for (const key of keys) {
    if (row[key] != null && row[key] !== '') {
      return String(row[key]).trim()
    }
  }
  return ''
}

const extractRankingRows = (payload) => {
  if (Array.isArray(payload)) return payload

  if (!payload || typeof payload !== 'object') return []

  if (Array.isArray(payload.rankings)) return payload.rankings
  if (Array.isArray(payload.ranking)) return payload.ranking
  if (Array.isArray(payload.data)) return payload.data

  return []
}

const renderRows = (rankings) => {
  loading.hidden = true
  section.hidden = false

  if (!rankings.length) {
    body.innerHTML = ''
    status.textContent = 'No ranking data available.'
    return
  }

  status.textContent = ''

  const sorted = [...rankings].sort((a, b) => {
    const aTime = parseTimeToMs(getStringValue(a, ['tiempo', 'time']))
    const bTime = parseTimeToMs(getStringValue(b, ['tiempo', 'time']))
    return aTime - bTime
  })

  const rows = sorted
    .map((entry, index) => {
      const position = `${String(index + 1).padStart(2, '0')}.`
      const name = getStringValue(entry, ['nickname', 'nombre', 'name']) || 'Sin nombre'
      const rawTime = getStringValue(entry, ['tiempo', 'time'])
      const time = formatTime(rawTime)

      return `
        <tr>
          <td>${position}</td>
          <td>${name}</td>
          <td>${time}</td>
        </tr>
      `
    })
    .join('')

  body.innerHTML = rows
}

const loadRanking = async () => {
  setLoading()

  try {
    const response = await fetch(RANKING_URL)

    if (!response.ok) {
      throw new Error(`Sheety respondió ${response.status}`)
    }

    const json = await response.json()
    renderRows(extractRankingRows(json))
  } catch (error) {
    console.error(error)
    section.hidden = false
    body.innerHTML = ''
    status.textContent = 'Could not load ranking right now.'
  } finally {
    loading.hidden = true
  }
}

loadRanking()
