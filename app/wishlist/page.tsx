"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    promo_price?: number
    image_url: string
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/auth/login"
      return
    }

    const user = JSON.parse(userData)
    fetchWishlist(user.id)

    // Get cart count
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)
  }, [])

  const fetchWishlist = async (userId: string) => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          id,
          product:products (
            id,
            name,
            price,
            promo_price,
            image_url
          )
        `)
        .eq("user_id", userId)

      if (error) throw error
      setWishlistItems(data || [])
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", wishlistId)

      if (error) throw error

      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistId))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.promo_price || product.price,
        image_url: product.image_url,
        quantity: 1
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    setCartCount(cart.length)
    alert("Produit ajouté au panier!")
  }

  if (loading) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">Chargement...</div>
        </main>
        <Footer language="fr" />
      </div>
    )
  }

  return (
    <div>
      <Header cartCount={cartCount} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ma liste de souhaits</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} produit{wishlistItems.length !== 1 ? 's' : ''} dans votre liste
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Votre liste de souhaits est vide</h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits et ajoutez vos favoris à votre liste de souhaits.
            </p>
            <Link href="/shop">
              <Button>Explorer les produits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.product.image_url || "/pets-cut-out.png"}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.product.name}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    {item.product.promo_price ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          {item.product.promo_price.toFixed(2)} DA
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {item.product.price.toFixed(2)} DA
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {item.product.price.toFixed(2)} DA
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => addToCart(item.product)}
                    className="w-full gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au panier
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
