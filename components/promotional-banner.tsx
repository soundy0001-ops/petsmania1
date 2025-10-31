"use client"
import { useState, useEffect } from "react"
import { Zap, Gift, X } from "lucide-react"

export function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const dismissed = localStorage.getItem("promo-banner-dismissed")
    if (dismissed) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("promo-banner-dismissed", "true")
  }

  if (!isVisible) return null

  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-b border-primary/20 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Fermer la bannière promotionnelle"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Promotion 1 */}
          <div className="bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 rounded-lg p-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Réduction 20%</h3>
                <p className="text-sm text-muted-foreground">Sur les accessoires</p>
              </div>
            </div>
            <span className="text-primary font-bold text-xl">-20%</span>
          </div>

          {/* Promotion 2 */}
          <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/20 rounded-lg p-3">
                <Gift className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Livraison Gratuite</h3>
                <p className="text-sm text-muted-foreground">À partir de 10.000 DA</p>
              </div>
            </div>
            <span className="text-secondary font-bold text-xl">GRATUIT</span>
          </div>

          {/* Promotion 3 */}
          <div className="bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-accent/20 rounded-lg p-3">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Flash Sale</h3>
                <p className="text-sm text-muted-foreground">Jusqu'à minuit</p>
              </div>
            </div>
            <span className="text-accent font-bold text-xl">-35%</span>
          </div>
        </div>
      </div>
    </section>
  )
}
