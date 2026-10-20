import { useEffect, useRef, useState } from 'react'

// Items per view: 1 on mobile, 2 from md (768px), 3 from lg (1024px)
function getPerView(max) {
  if (window.matchMedia('(min-width: 1024px)').matches) return Math.min(3, max)
  if (window.matchMedia('(min-width: 768px)').matches) return Math.min(2, max)
  return 1
}

export default function Carousel({ items, renderItem, maxPerView = 3, gap = 28, className = '', ...rest }) {
  // 3 on the server and first client render (must match prerendered HTML), real value right after mount
  const [perView, setPerView] = useState(maxPerView)
  const [index, setIndex] = useState(0)
  const touchStart = useRef(null)

  useEffect(() => {
    const onResize = () => setPerView(getPerView(maxPerView))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [maxPerView])

  const maxIndex = Math.max(0, items.length - perView)
  const current = Math.min(index, maxIndex)
  const go = (i) => setIndex(Math.min(Math.max(i, 0), maxIndex))

  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    touchStart.current = null
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1))
  }

  const arrow = 'flex size-10 cursor-pointer items-center justify-center rounded-full border border-gold text-gold transition hover:bg-gold hover:text-navy disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold'

  return (
    <div className={className} {...rest}>
      <div
        className="overflow-hidden"
        onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            gap: gap,
            transform: `translateX(calc(${current} * (-100% - ${gap}px) / ${items.length}))`,
            width: `calc(${(items.length / perView) * 100}% + ${(items.length / perView - 1) * gap}px)`,
          }}
        >
          {items.map((item, i) => (
            <div key={i} className="min-w-0 flex-1">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      {maxIndex > 0 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <button className={arrow} onClick={() => go(current - 1)} disabled={current === 0} aria-label="Previous">
            ‹
          </button>
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                className={`size-2 cursor-pointer rounded-full ${i === current ? 'bg-gold' : 'bg-white/30'}`}
              />
            ))}
          </div>
          <button className={arrow} onClick={() => go(current + 1)} disabled={current === maxIndex} aria-label="Next">
            ›
          </button>
        </div>
      )}
    </div>
  )
}
