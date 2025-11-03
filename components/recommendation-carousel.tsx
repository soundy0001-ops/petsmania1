"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface RecommendationProduct {
  id: string
  name: string
  price: number
  promoPrice?: number
  image: string
  reduction?: number
  reason: string
}

interface RecommendationCarouselProps {
  title: string
  products: RecommendationProduct[]
  reason?: string
}

export function RecommendationCarousel({ title, products, reason }: RecommendationCarouselProps) {
  const [scroll, setScroll] = useState(0)

  const scroll_left = () => {
    const container = document.getElementById("carousel-" + title)
    if (container) {
      container.scrollBy({ left: -400, behavior: "smooth" })
      setScroll(scroll - 1)
    }
  }

  const scroll_right = () => {
    const container = document.getElementById("carousel-" + title)
    if (container) {
      container.scrollBy({ left: 400, behavior: "smooth" })
      setScroll(scroll + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {reason && <p className="text-muted-foreground">{reason}</p>}
      </div>

      <div className="relative">
        <div
          id={"carousel-" + title}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="flex-shrink-0 w-64">
              <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 h-full group">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  <Image
                    src={product.image || "/tipos-manto-perro.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                  {product.reduction && (
                    <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-lg font-bold">
                      -{product.reduction}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-primary">
                      {(product.promoPrice || product.price).toFixed(0)} DA
                    </span>
                    {product.promoPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.price.toFixed(0)} DA</span>
                    )}
                  </div>
                  <Button size="sm" className="w-full gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={scroll_left}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/80 transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scroll_right}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/80 transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
