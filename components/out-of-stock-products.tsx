"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

interface OutOfStockProduct {
  id: string
  name: string
  animal: string
  price: number
  promo_price?: number
  image_url: string
  reduction?: number
  rating: number
  reviews: number
  out_of_stock?: boolean
  stock?: number
}

export function OutOfStockProducts() {
  const [outOfStockProducts, setOutOfStockProducts] = useState<OutOfStockProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      try {
        const supabase = getSupabaseClient()
        // Fetch products that are either out of stock (stock = 0) or marked as out_of_stock
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or('stock.eq.0,out_of_stock.eq.true')
          .limit(20)

        if (error) {
          console.error("Supabase error:", error)
          setOutOfStockProducts([])
        } else {
          setOutOfStockProducts(data || [])
        }
      } catch (error) {
        console.error("Error fetching out-of-stock products:", error)
        setOutOfStockProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchOutOfStockProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden h-80 animate-pulse">
            <div className="h-40 bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (outOfStockProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Tous les produits sont actuellement en stock.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {outOfStockProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:scale-105 group cursor-pointer opacity-75">
            {/* Product Image */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <Badge variant="destructive" className="absolute top-3 right-3">
                {product.out_of_stock ? "Rupture de stock" : "Stock épuisé"}
              </Badge>
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-lg text-primary">
                    {product.promo_price ? product.promo_price.toFixed(0) : product.price.toFixed(0)} DA
                  </span>
                  {product.promo_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.price.toFixed(0)} DA
                    </span>
                  )}
                </div>
              </div>

              {/* Out of Stock Message */}
              <div className="mt-auto">
                <p className="text-sm text-red-600 font-medium">Rupture de stock</p>
                <p className="text-xs text-muted-foreground">Indisponible actuellement</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
