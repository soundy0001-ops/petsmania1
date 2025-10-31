"use client"

import { useState, useEffect } from "react"
import { t } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Search, ShoppingCart, Heart } from "lucide-react"

interface Product {
  id: string
  name_en: string
  name_fr: string
  name_ar: string
  description_en: string
  description_fr: string
  description_ar: string
  price: number
  category: string
  image_url: string
  brand: string
  stock: number
  out_of_stock?: boolean
}

export default function ShopPage() {
  const [cartCount, setCartCount] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("newest")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartCount(JSON.parse(cart).length)

    // Get category from URL
    const params = new URLSearchParams(window.location.search)
    const category = params.get("category")
    if (category) setSelectedCategory(category)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchProducts = async () => {
      try {
        const supabase = getSupabaseClient()
        let query = supabase.from("products").select("*")

        if (selectedCategory) {
          query = query.eq("animal", selectedCategory)
        }

        const { data, error } = await query

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, mounted])

  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name_en.toLowerCase().includes(query) ||
          p.name_fr.toLowerCase().includes(query) ||
          p.name_ar.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query),
      )
    }

    // Sort
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === "newest") {
      filtered = [...filtered].reverse()
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, sortBy])

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name_fr,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
        out_of_stock: product.out_of_stock
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    setCartCount(cart.length)
  }

  const addToWishlist = async (product: Product) => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      alert("Veuillez vous connecter pour ajouter à la liste de souhaits")
      return
    }

    const user = JSON.parse(userData)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("wishlist")
        .insert({
          user_id: user.id,
          product_id: product.id
        })

      if (error) throw error

      alert("Produit ajouté à la liste de souhaits!")
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      alert("Erreur lors de l'ajout à la liste de souhaits")
    }
  }

  const getProductName = (product: Product): string => {
    return product.name_fr
  }

  const getProductDescription = (product: Product): string => {
    return product.description_fr
  }

  if (!mounted) return null

  const categories = ["cats", "dogs", "birds", "other"]

  return (
    <div>
      <Header cartCount={cartCount} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-8">{t("shop")}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background"
            >
              <option value="newest">{t("newest")}</option>
              <option value="price-low">{t("priceLowest")}</option>
              <option value="price-high">{t("priceHighest")}</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              >
                {t(cat as any)}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${(i % 4) * 50}ms` }}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={getProductName(product)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">🐾</div>
                  )}
                  <button
                    onClick={() => addToWishlist(product)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{getProductName(product)}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{getProductDescription(product)}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary">{product.price.toFixed(2)} DA</span>
                    <span className="text-xs text-muted-foreground">
                      {product.out_of_stock ? "Rupture de stock" : product.stock > 0 ? t("stock") : t("outOfStock")}
                    </span>
                  </div>

                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0 || product.out_of_stock}
                    className="w-full gap-2"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.out_of_stock ? "Rupture de stock" : product.stock === 0 ? t("outOfStock") : t("addToCart")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer language="fr" />
    </div>
  )
}
