"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

interface FeaturedProduct {
  id: string
  name: string
  animal: string
  price: number
  promo_price?: number
  image_url: string
  reduction?: number
  rating: number
  reviews: number
}

const FEATURED_PRODUCTS: FeaturedProduct[] = []

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const supabase = getSupabaseClient()
        // First try to fetch all products and filter client-side
        // This avoids the column error if 'featured' column doesn't exist yet
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(20)

        if (error) {
          console.error("Supabase error:", error)
          setFeaturedProducts([])
        } else {
          // Filter featured products client-side
          const featured = (data || []).filter((product: any) => product.featured === true)
          setFeaturedProducts(featured)
        }
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Produits en Vedette</h2>
            <p className="text-lg text-muted-foreground">
              Découvrez nos meilleurs produits avec des réductions exclusives
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Produits en Vedette</h2>
          <p className="text-lg text-muted-foreground">
            Découvrez nos meilleurs produits avec des réductions exclusives
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:scale-105 group cursor-pointer">
                  {/* Product Image */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.reduction && (
                      <Badge variant="destructive" className="absolute top-3 right-3">
                        -{product.reduction}%
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>

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

                    {/* Add to Cart */}
                    <Button size="sm" className="w-full gap-2 mt-auto">
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter au panier
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit en vedette pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
