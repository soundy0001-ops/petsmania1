"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase-client"
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from "lucide-react"
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
  images?: string[]
  animal: string
  type: string
  subtype?: string
  marque: string
  stock: number
}

const RELATED_PRODUCTS: any[] = []

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [cartCount, setCartCount] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [productId, setProductId] = useState<string>("")

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartCount(JSON.parse(cart).length)
  }, [])

  useEffect(() => {
    if (!mounted || !productId) return

    const fetchProduct = async () => {
      try {
        const supabase = getSupabaseClient()
        let query = supabase.from("products").select("*")

        // Check if ID looks like a UUID or numeric
        if (productId.includes("-") || productId.match(/^[0-9a-f]{8}-[0-9a-f]{4}/i)) {
          // It's a UUID
          query = query.eq("id", productId)
        } else {
          // It's numeric, get the nth product instead
          const { data: products, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .limit(1)
            .offset(Number.parseInt(productId) - 1)

          if (fetchError) throw fetchError

          if (products && products.length > 0) {
            setProduct(products[0])
            setLoading(false)
            return
          } else {
            setError("Ce produit n'existe pas")
            setLoading(false)
            return
          }
        }

        const { data, error } = await query.single()

        if (error) {
          if (error.code === "PGRST116") {
            setError("Ce produit n'existe pas")
          } else {
            throw error
          }
        } else {
          setProduct(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching product:", error)
        setError("Erreur lors du chargement du produit")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, mounted])

  const addToCart = (prod: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === prod.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...prod, quantity })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    setCartCount(cart.length)
    setQuantity(1)
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </main>
        <Footer language="fr" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">{error || "Produit non trouvé"}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Assurez-vous que des produits existent dans la base de données via le tableau de bord admin.
            </p>
            <Link href="/categories/cats">
              <Button className="mt-4">Retour aux produits</Button>
            </Link>
          </div>
        </main>
        <Footer language="fr" />
      </div>
    )
  }

  const displayPrice = product.promo_price || product.price
  const images = product.images && product.images.length > 0 ? product.images : [product.image_url]

  return (
    <div>
      <Header cartCount={cartCount} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span>/</span>
          <Link href={`/categories/${product.animal}`} className="hover:text-primary">
            {product.animal.charAt(0).toUpperCase() + product.animal.slice(1)}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.reduction && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                  <span>-{product.reduction}%</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === idx ? "border-primary" : "border-border"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${idx}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground font-semibold uppercase mb-2">{product.marque}</p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(142 avis)</span>
              </div>

              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Price Section */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">{displayPrice.toFixed(0)} DA</span>
                {product.promo_price && (
                  <span className="text-xl text-muted-foreground line-through">{product.price.toFixed(0)} DA</span>
                )}
              </div>
              {product.promo_price && (
                <p className="text-sm text-green-600 font-semibold">
                  Économisez {(product.price - product.promo_price).toFixed(0)} DA
                </p>
              )}
            </Card>

            {/* Stock Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-destructive"}`}></div>
                <span className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
                  {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
                </span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-muted">
                    -
                  </button>
                  <span className="px-6 py-2 border-l border-r border-border">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-muted">
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                size="lg"
                className="w-full gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => setWishlisted(!wishlisted)}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-current text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg" className="flex-1 gap-2 bg-transparent">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Product Benefits */}
            <div className="border-t border-border pt-6 space-y-3">
              {[
                { icon: Truck, text: "Livraison gratuite à partir de 10.000 DA" },
                { icon: Shield, text: "Garantie satisfait ou remboursé" },
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <benefit.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Product Details */}
            <Card className="p-6 space-y-3">
              <h3 className="font-semibold">Détails du produit</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{product.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Catégorie:</span>
                  <span>{product.subtype || "Général"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pour:</span>
                  <span>{product.animal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marque:</span>
                  <span>{product.marque}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {RELATED_PRODUCTS.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RELATED_PRODUCTS.map((prod) => (
                <Link key={prod.id} href={`/products/${prod.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 group cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden relative">
                      <Image
                        src={prod.image || "/placeholder.svg"}
                        alt={prod.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{prod.name}</h3>
                      <p className="text-primary font-bold">{prod.price.toFixed(0)} DA</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer language="fr" />
    </div>
  )
}
