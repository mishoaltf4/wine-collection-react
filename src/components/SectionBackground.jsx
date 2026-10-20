import bg from '../assets/images/home/incoming-events.webp'

// Blurred vineyard photo with a navy overlay, used behind content sections
export default function SectionBackground() {
  return (
    <>
      <img
        src={bg}
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute -inset-10 size-[calc(100%+80px)] max-w-none object-cover blur-[13px]"
      />
      <div className="absolute inset-0 bg-navy/45" />
    </>
  )
}
