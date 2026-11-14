import { useEffect, useRef, useState } from 'react'

const root = document.documentElement
const store = (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} }

const modes = [['light', 'Light'], ['dark', 'Dark'], ['auto', 'Auto']]
const palettes = [
  ['apricot', ['#F7F3E8', '#37233D', '#F2A681'], 'Parchment, Aubergine, Apricot'],
  ['citron', ['#F7F3E8', '#37233D', '#D3E66A'], 'Parchment, Aubergine, Citron'],
  ['forest', ['#F4F5EF', '#204033', '#99A4E0'], 'Pearl, Forest, Periwinkle'],
]

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(() => root.getAttribute('data-theme') || 'auto')
  const [palette, setPalette] = useState(() => root.getAttribute('data-palette') || 'apricot')
  const btnRef = useRef(null)

  useEffect(() => {
    if (mode === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', mode)
  }, [mode])

  useEffect(() => {
    if (palette === 'apricot') root.removeAttribute('data-palette')
    else root.setAttribute('data-palette', palette)
  }, [palette])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="theme">
      <div className="theme-panel" id="themePanel" hidden={!open}>
        <div className="grp">
          <h4>Mode</h4>
          <div className="modes">
            {modes.map(([m, label]) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => { setMode(m); store('zino-theme', m) }}>{label}</button>
            ))}
          </div>
        </div>
        <div className="grp">
          <h4>Colours</h4>
          <div className="pals">
            {palettes.map(([p, colors, label]) => (
              <button key={p} type="button" aria-pressed={palette === p} onClick={() => { setPalette(p); store('zino-palette', p) }}>
                <span className="sw">{colors.map((c) => <i key={c} style={{ background: c }}></i>)}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button ref={btnRef} className="theme-btn" type="button" aria-expanded={open} aria-controls="themePanel" onClick={() => setOpen(!open)}>
        <span className="dots" aria-hidden="true">
          <i style={{ background: 'var(--accent)' }}></i>
          <i style={{ background: 'var(--ink)' }}></i>
        </span>
        Theme
      </button>
    </div>
  )
}
