import { useCallback, useEffect, useRef, useState } from 'react'
import logo from '../assets/icons/wcg-logo.svg'
import Divider from '../components/Divider'
import SectionBackground from '../components/SectionBackground'
import { deleteEvent, fetchEvents, login, saveEvent } from '../api'

const TOKEN_KEY = 'admin-token'

const FIELDS = [
  ['title', 'Title', 'input'],
  ['description', 'Description', 'textarea'],
  ['place', 'Venue', 'input'],
  ['place_short', 'Venue (short, e.g. city)', 'input'],
]
const EMPTY = { date: '' }
for (const [name] of FIELDS) for (const l of ['ka', 'en']) EMPTY[`${name}_${l}`] = ''

const input = 'w-full rounded-sm border border-white/25 bg-white/10 px-3 py-2 font-normal text-white outline-none placeholder:text-white/50 focus:border-gold'
const card = 'rounded-sm bg-white/10 shadow-[0_12px_32px_rgba(15,42,74,0.15)]'
const secondary = 'border border-white/40 text-white hover:bg-white/15'
const button = 'cursor-pointer rounded-sm px-4 py-2 text-sm font-semibold uppercase disabled:opacity-50'

const readToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { token } = await login(password)
      onLogin(token)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit} className={`mx-auto flex max-w-sm flex-col gap-4 p-5 md:p-8 ${card}`}>
      <h1 className="title-sm font-display text-gold">Admin login</h1>
      <Divider className="w-full" gold={false} />
      <input type="password" autoFocus placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button className={`${button} bg-navy text-gold`}>Log in</button>
    </form>
  )
}

const RATIOS = [['Free', 0], ['16:10', 1.6], ['4:3', 4 / 3], ['1:1', 1]]
const HANDLES = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  n: 'left-1/2 top-0 cursor-ns-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  e: 'left-full top-1/2 cursor-ew-resize',
  se: 'left-full top-full cursor-nwse-resize',
  s: 'left-1/2 top-full cursor-ns-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  w: 'left-0 top-1/2 cursor-ew-resize',
}
const MIN = 20

// New rect after dragging `handle` of `r` to pointer (px, py), inside a W x H box.
function resize(r, handle, px, py, W, H, ratio) {
  const cl = (v, max) => Math.min(Math.max(v, 0), max)
  let l = r.x
  let t = r.y
  let rt = r.x + r.w
  let b = r.y + r.h
  if (handle.includes('w')) l = Math.min(cl(px, W), rt - MIN)
  if (handle.includes('e')) rt = Math.max(cl(px, W), l + MIN)
  if (handle.includes('n')) t = Math.min(cl(py, H), b - MIN)
  if (handle.includes('s')) b = Math.max(cl(py, H), t + MIN)
  let w = rt - l
  let h = b - t
  if (ratio) {
    if (handle.includes('w') || handle.includes('e')) h = w / ratio
    else w = h * ratio
    const k = Math.min(1, (handle.includes('w') ? rt : W - l) / w, (handle.includes('n') ? b : H - t) / h)
    w *= k
    h *= k
    if (handle.includes('w')) l = rt - w
    if (handle.includes('n')) t = b - h
  }
  return { x: l, y: t, w, h }
}

function Cropper({ file, onApply, onCancel }) {
  const [src, setSrc] = useState(null)
  const [rect, setRect] = useState(null)
  const [ratio, setRatio] = useState(0)
  const img = useRef(null)
  const drag = useRef(null)

  // created in the effect (not during render) so StrictMode's mount/unmount/mount doesn't leave a revoked URL
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const box = () => ({ W: img.current.clientWidth, H: img.current.clientHeight })
  const point = (e) => {
    const b = img.current.getBoundingClientRect()
    return [e.clientX - b.left, e.clientY - b.top]
  }
  const fullRect = (r) => {
    const { W, H } = box()
    let w = W
    let h = H
    if (r) {
      if (W / H > r) w = H * r
      else h = W / r
    }
    return { x: (W - w) / 2, y: (H - h) / 2, w, h }
  }
  const pick = (value) => {
    setRatio(value)
    setRect(fullRect(value))
  }

  const begin = (mode) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const [px, py] = point(e)
    drag.current = { mode, px, py, rect: mode === 'draw' ? { x: px, y: py, w: 0, h: 0 } : rect }
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    const { W, H } = box()
    const [px, py] = point(e)
    if (d.mode === 'move') {
      const x = Math.min(Math.max(d.rect.x + px - d.px, 0), W - d.rect.w)
      const y = Math.min(Math.max(d.rect.y + py - d.py, 0), H - d.rect.h)
      setRect({ ...d.rect, x, y })
    } else if (d.mode === 'draw') {
      if (Math.abs(px - d.px) < 3 && Math.abs(py - d.py) < 3) return
      const handle = (py < d.py ? 'n' : 's') + (px < d.px ? 'w' : 'e')
      setRect(resize(d.rect, handle, px, py, W, H, ratio))
    } else {
      setRect(resize(d.rect, d.mode, px, py, W, H, ratio))
    }
  }
  const end = () => {
    drag.current = null
  }

  const apply = () => {
    if (!rect || rect.w < MIN || rect.h < MIN) return
    const el = img.current
    const k = el.naturalWidth / el.clientWidth
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(rect.w * k)
    canvas.height = Math.round(rect.h * k)
    canvas.getContext('2d').drawImage(el, rect.x * k, rect.y * k, rect.w * k, rect.h * k, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => blob && onApply(new File([blob], `${file.name.replace(/\.\w+$/, '')}.jpg`, { type: 'image/jpeg' })), 'image/jpeg', 0.92)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center gap-3 overflow-auto bg-black/80 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {RATIOS.map(([label, value]) => (
          <button key={label} type="button" onClick={() => pick(value)} className={`${button} ${ratio === value ? 'bg-gold text-navy' : 'bg-white text-navy'}`}>
            {label}
          </button>
        ))}
        <button type="button" onClick={apply} className={`${button} bg-navy text-gold`}>Apply crop</button>
        <button type="button" onClick={onCancel} className={`${button} bg-white text-navy`}>Cancel</button>
      </div>
      <div className="relative inline-block select-none" style={{ touchAction: 'none' }} onPointerDown={begin('draw')} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        {src && <img ref={img} src={src} alt="" draggable={false} onLoad={() => setRect(fullRect(0))} className="block max-h-[75vh] max-w-full" />}
        {rect && (
          <div
            onPointerDown={begin('move')}
            className="absolute cursor-move border border-white"
            style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)' }}
          >
            {Object.entries(HANDLES).map(([h, pos]) => (
              <span key={h} onPointerDown={begin(h)} className={`absolute size-4 -translate-x-1/2 -translate-y-1/2 border border-navy bg-white ${pos}`} />
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-white">Drag the box to move it, drag the handles to resize, or drag on the image to draw a new area.</p>
    </div>
  )
}

function EventForm({ token, event, onSaved, onCancel, onAuthError }) {
  const [values, setValues] = useState(event ? { ...EMPTY, ...event } : EMPTY)
  const [file, setFile] = useState(null)
  const [source, setSource] = useState(null) // the picked file, kept so it can be re-cropped
  const [cropping, setCropping] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }))
  const [filePreview, setFilePreview] = useState(null)
  useEffect(() => {
    if (!file) return setFilePreview(null)
    const url = URL.createObjectURL(file)
    setFilePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  const preview = filePreview ?? (file ? null : event?.image)

  const submit = async (e) => {
    e.preventDefault()
    if (!event && !file) return setError('Please choose an image')
    const form = new FormData()
    for (const key of Object.keys(EMPTY)) form.append(key, values[key] ?? '')
    if (file) form.append('image', file)
    setBusy(true)
    setError('')
    try {
      await saveEvent(token, event?.id, form)
      onSaved()
    } catch (err) {
      if (err.status === 401) return onAuthError()
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className={`flex flex-col gap-4 p-5 md:p-8 ${card}`}>
      <h2 className="title-sm font-display text-gold">{event ? 'Edit event' : 'New event'}</h2>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Date
        <input type="date" required value={values.date} onChange={set('date')} className={input} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        {['ka', 'en'].map((l) => (
          <div key={l} className="flex flex-col gap-4">
            <h3 className="font-semibold uppercase text-gold">{l === 'ka' ? 'ქართული' : 'English'}</h3>
            {FIELDS.map(([name, label, kind]) => {
              const Tag = kind
              return (
                <label key={name} className="flex flex-col gap-1 text-sm font-semibold">
                  {label}
                  <Tag
                    required={name === 'title'}
                    rows={kind === 'textarea' ? 5 : undefined}
                    value={values[`${name}_${l}`]}
                    onChange={set(`${name}_${l}`)}
                    className={input}
                  />
                </label>
              )
            })}
          </div>
        ))}
      </div>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Image {event && '(leave empty to keep the current one)'}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
          const f = e.target.files[0] ?? null
          setFile(f)
          setSource(f)
          setCropping(!!f)
        }} />
        {preview && <img src={preview} alt="" className="h-40 w-64 rounded-sm object-cover" />}
      </label>
      {source && (
        <button type="button" onClick={() => setCropping(true)} className={`${button} w-fit ${secondary}`}>Crop image</button>
      )}
      {cropping && source && (
        <Cropper file={source} onCancel={() => setCropping(false)} onApply={(f) => { setFile(f); setCropping(false) }} />
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="flex gap-3">
        <button disabled={busy} className={`${button} bg-navy text-gold`}>{busy ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className={`${button} ${secondary}`}>Cancel</button>
      </div>
    </form>
  )
}

export default function Admin() {
  const [token, setToken] = useState(readToken)
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null) // null = list, {} = new event, row = edit
  const [error, setError] = useState('')

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch {
      // storage unavailable
    }
    setToken(null)
  }, [])

  const handleLogin = (t) => {
    try {
      sessionStorage.setItem(TOKEN_KEY, t)
    } catch {
      // storage unavailable
    }
    setToken(t)
  }

  const load = useCallback(() => fetchEvents().then(setEvents).catch((err) => setError(err.message)), [])
  useEffect(() => {
    if (token) load()
  }, [token, load])

  const remove = async (ev) => {
    if (!confirm(`Delete "${ev.title_en}"?`)) return
    try {
      await deleteEvent(token, ev.id)
      load()
    } catch (err) {
      if (err.status === 401) logout()
      else setError(err.message)
    }
  }

  const wrap = (children) => (
    <div className="flex min-h-screen flex-col font-sans text-white">
      <header className="sticky top-0 z-40 bg-navy max-lg:px-5 lg:px-10 2xl:px-20">
        <div className="flex h-20 items-center justify-between gap-6 lg:h-25">
          <a href="/" className="flex shrink-0 items-center gap-3 lg:gap-4">
            <img src={logo} alt="Wine Collection of Georgia" className="size-10 rounded-full lg:size-12" />
            <span className="hidden font-brand text-base font-semibold text-gold min-[500px]:block 2xl:text-xl">
              Wine Collection of Georgia
            </span>
          </a>
          <a
            href="/"
            className="rounded-sm bg-gold px-4 py-2 text-xs font-semibold uppercase text-white transition hover:brightness-110"
          >
            Back to site
          </a>
        </div>
      </header>
      <main className="relative flex-1 overflow-hidden px-5 py-16 md:px-10 lg:py-25">
        <SectionBackground />
        <div className="relative">{children}</div>
      </main>
      <footer className="bg-navy px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-310 flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="" className="size-10 rounded-full" />
            <p className="font-brand text-xl text-white">Wine Collection Of Georgia</p>
          </div>
          <div className="h-px w-full bg-white/15" />
          <p className="text-center text-xs text-white/50">© {new Date().getFullYear()} Wine Collection of Georgia</p>
        </div>
      </footer>
    </div>
  )

  if (!token) return wrap(<Login onLogin={handleLogin} />)

  return wrap(
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-4">
          <h1 className="title-lg font-display text-gold">Events admin</h1>
          <Divider className="w-20" />
        </div>
        <div className="flex gap-3">
          {!editing && <button onClick={() => setEditing({})} className={`${button} bg-navy text-gold`}>Add event</button>}
          <button onClick={logout} className={`${button} ${secondary}`}>Log out</button>
        </div>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}

      {editing ? (
        <EventForm
          token={token}
          event={editing.id ? editing : null}
          onSaved={() => { setEditing(null); load() }}
          onCancel={() => setEditing(null)}
          onAuthError={logout}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {events.length === 0 && <li className="text-fog">No events yet.</li>}
          {events.map((ev) => (
            <li key={ev.id} className={`flex items-center gap-4 rounded-sm border p-3 ${ev.isPast ? 'border-white/20 bg-white/5' : 'border-gold bg-gold text-navy'}`}>
              <img src={ev.image} alt="" className="h-16 w-24 rounded-sm object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{ev.title_en}</p>
                <p className={`text-sm ${ev.isPast ? 'text-fog' : 'text-navy/80'}`}>{ev.date} · {ev.isPast ? 'Past' : 'Upcoming'}</p>
              </div>
              <button onClick={() => setEditing(ev)} className={`${button} ${ev.isPast ? secondary : 'border border-navy text-navy hover:bg-navy/10'}`}>Edit</button>
              <button onClick={() => remove(ev)} className={`${button} bg-red-700 text-white hover:brightness-125`}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>,
  )
}
