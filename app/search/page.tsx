"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Search, ShoppingCart, X } from "lucide-react"
import { BRANDS } from "@/lib/categories-data"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  promo_price?: number
  reduction?: number
  image_url: string
  animal: string
  type: string
  marque: string
  stock: number
}

const ANIMALS = ["cats", "dogs", "birds", "other"]

export default function SearchPage() {
  const [cartCount, setCartCount] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartCount(JSON.parse(cart).length)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchProducts = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("products").select("*")

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("[v0] Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [mounted])

  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.marque.toLowerCase().includes(query),
      )
    }

    // Animal filter
    if (selectedAnimal) {
      filtered = filtered.filter((p) => p.animal === selectedAnimal)
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter((p) => p.marque === selectedBrand)
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = p.promo_price || p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => (a.promo_price || a.price) - (b.promo_price || b.price))
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => (b.promo_price || b.price) - (a.promo_price || a.price))
    } else if (sortBy === "newest") {
      filtered = [...filtered].reverse()
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedAnimal, selectedBrand, priceRange, sortBy])

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    setCartCount(cart.length)
  }

  if (!mounted) return null

  return (
    <div>
      <Header cartCount={cartCount} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Rechercher des produits</h1>
        <p className="text-muted-foreground mb-8">
          {filteredProducts.length} résultat{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6 bg-card p-6 rounded-lg border border-border">
              {/* Search */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Recherche
                </h3>
                <Input
                  placeholder="Produits, marques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-4">Prix</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={50000}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0].toLocaleString()} DA</span>
                    <span>{priceRange[1].toLocaleString()} DA</span>
                  </div>
                </div>
              </div>

              {/* Animal Filter */}
              <div>
                <h3 className="font-semibold mb-3">Type d'animal</h3>
                <div className="space-y-2">
                  {ANIMALS.map((animal) => (
                    <button
                      key={animal}
                      onClick={() => setSelectedAnimal(selectedAnimal === animal ? null : animal)}
                      className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                        selectedAnimal === animal
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted"
                      }`}
                    >
                      {animal.charAt(0).toUpperCase() + animal.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="font-semibold mb-3">Marque</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                      className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                        selectedBrand === brand ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-semibold mb-3">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="newest">Plus récent</option>
                  <option value="price-low">Prix: du plus bas</option>
                  <option value="price-high">Prix: du plus élevé</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedAnimal || selectedBrand || priceRange[0] > 0 || priceRange[1] < 50000) && (
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedAnimal(null)
                    setSelectedBrand(null)
                    setPriceRange([0, 50000])
                  }}
                >
                  <X className="w-4 h-4" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Aucun produit trouvé</p>
                <p className="text-sm text-muted-foreground mt-2">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, i) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card
                      className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 animate-scale-in h-full flex flex-col group cursor-pointer"
                      style={{ animationDelay: `${(i % 6) * 50}ms` }}
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden relative">
                        {product.image_url ? (
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="text-4xl">🐾</div>
                        )}
                        {product.reduction && (
                          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-lg font-bold">
                            -{product.reduction}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase">{product.marque}</p>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-primary">
                              {(product.promo_price || product.price).toFixed(0)} DA
                            </span>
                            {product.promo_price && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.price.toFixed(0)} DA
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Add to Cart */}
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            addToCart(product)
                          }}
                          disabled={product.stock === 0}
                          className="w-full gap-2 mt-auto"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Ajouter
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer language="fr" />
    </div>
  )
}
