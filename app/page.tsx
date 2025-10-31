"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Truck, Shield, TrendingUp } from "lucide-react"
import { PromotionalBanner } from "@/components/promotional-banner"
import { FeaturedProducts } from "@/components/featured-products"
import { OutOfStockProducts } from "@/components/out-of-stock-products"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function Home() {
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState([
    {
      name: "Chats",
      href: "/categories/cats",
      emoji: "🐱",
      color: "from-pink-300 to-pink-400",
      count: "0 produits",
      animal: "cats",
    },
    {
      name: "Chiens",
      href: "/categories/dogs",
      emoji: "🐕",
      color: "from-amber-300 to-amber-400",
      count: "0 produits",
      animal: "dogs",
    },
    {
      name: "Oiseaux",
      href: "/categories/birds",
      emoji: "🦜",
      color: "from-green-300 to-green-400",
      count: "0 produits",
      animal: "birds",
    },
    {
      name: "Autres animaux",
      href: "/categories/other",
      emoji: "🐾",
      color: "from-purple-300 to-purple-400",
      count: "0 produits",
      animal: "other",
    },
  ])

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartCount(JSON.parse(cart).length)

    // Fetch product counts for each category
    fetchProductCounts()
  }, [])

  const fetchProductCounts = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("products")
        .select("animal")

      if (error) throw error

      // Count products by animal
      const counts = data?.reduce((acc: Record<string, number>, product: { animal: string }) => {
        acc[product.animal] = (acc[product.animal] || 0) + 1
        return acc
      }, {}) || {}

      setCategories(prev => prev.map(cat => ({
        ...cat,
        count: `${counts[cat.animal] || 0} produits`
      })))
    } catch (error) {
      console.error("Error fetching product counts:", error)
    }
  }

  if (!mounted) return null

  return (
    <div>
      <Header cartCount={cartCount} />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <div className="mb-4 inline-block">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2 w-fit">
                    <TrendingUp className="w-4 h-4" />
                    Nouveau et Tendance
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Bienvenue à <span className="text-primary">PetHouse</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Découvrez des fournitures pour animaux de compagnie premium pour chats, chiens, oiseaux et bien
                  d'autres. Des produits de qualité de marques de confiance pour garder vos animaux heureux et en bonne
                  santé.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/categories/cats">
                    <Button size="lg" className="gap-2">
                      Acheter maintenant <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      En savoir plus
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative h-96 md:h-full animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl h-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="https://i.imgur.com/EfdFUwO.png"
                    alt="Bienvenue à PetHouse"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <PromotionalBanner />

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-card/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pourquoi nous choisir</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Produits de qualité",
                  desc: "Articles soigneusement sélectionnés parmi les marques de confiance",
                },
                {
                  icon: Truck,
                  title: "Livraison rapide",
                  desc: "Expédition rapide et fiable à votre porte",
                },
                {
                  icon: Shield,
                  title: "Achat sécurisé",
                  desc: "Transactions sûres et protection des clients",
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="p-8 text-center hover:shadow-lg transition-shadow animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <FeaturedProducts />



        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Acheter par catégorie</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <Link key={i} href={cat.href}>
                  <Card
                    className="p-8 text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 animate-scale-in overflow-hidden group"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="relative">
                      <div
                        className={`bg-gradient-to-br ${cat.color} rounded-full w-20 h-20 flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform`}
                      >
                        {cat.emoji}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.count}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offer Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-secondary/20 to-accent/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Livraison gratuite à partir de 10.000 DA</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Profitez de la livraison gratuite sur toutes les commandes de 10.000 DA et plus. Livraison rapide et
              sécurisée dans toute l'Algérie.
            </p>
            <Link href="/categories/cats">
              <Button size="lg" className="gap-2">
                Commencer les achats <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer language="fr" />
    </div>
  )
}
