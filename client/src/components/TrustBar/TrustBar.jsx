import { Truck, Wallet, ShieldCheck, Lock } from 'lucide-react'
import { trustFeatures } from '../../data/products'
import './TrustBar.css'

const icons = { truck: Truck, wallet: Wallet, shield: ShieldCheck, lock: Lock }

function TrustBar() {
  return (
    <section className="trust">
      <div className="trust__inner">
        {trustFeatures.map((f) => {
          const Icon = icons[f.icon]
          return (
            <div key={f.id} className="trust__item">
              <Icon size={22} strokeWidth={1.5} />
              <div>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default TrustBar
