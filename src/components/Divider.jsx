export default function Divider({ className = 'w-20', gold = true, ...rest }) {
  return <div className={`h-px ${gold ? 'bg-gold' : 'bg-white/20'} ${className}`} {...rest} />
}
