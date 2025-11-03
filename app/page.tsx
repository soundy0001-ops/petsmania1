"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { t } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Truck, Shield, TrendingUp, Star } from "lucide-react"
import { PromotionalBanner } from "@/components/promotional-banner"
import { FeaturedProducts } from "@/components/featured-products"
import { OutOfStockProducts } from "@/components/out-of-stock-products"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function Home() {
  const { language } = useTheme()
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState([
    {
      name: t("cats", language),
      href: "/categories/cats",
      emoji: "🐱",
      color: "from-pink-300 to-pink-400",
      count: "0 " + t("products", language),
      animal: "cats",
    },
    {
      name: t("dogs", language),
      href: "/categories/dogs",
      emoji: "🐕",
      color: "from-amber-300 to-amber-400",
      count: "0 " + t("products", language),
      animal: "dogs",
    },
    {
      name: t("birds", language),
      href: "/categories/birds",
      emoji: "🦜",
      color: "from-green-300 to-green-400",
      count: "0 " + t("products", language),
      animal: "birds",
    },
    {
      name: t("other", language),
      href: "/categories/other",
      emoji: "🐾",
      color: "from-purple-300 to-purple-400",
      count: "0 " + t("products", language),
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
        count: `${counts[cat.animal] || 0} ${t("products", language)}`
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
        {/* Hero Section - Premium Architecture */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 py-20 md:py-32">
          {/* Architectural Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
            <div className="absolute top-16 left-16 w-32 h-32 border border-gold-400/20 rounded-full"></div>
            <div className="absolute top-32 right-24 w-24 h-24 border border-gold-400/30 rounded-full"></div>
            <div className="absolute bottom-32 left-1/3 w-40 h-40 border border-gold-400/10 rounded-full"></div>
            <div className="absolute bottom-16 right-1/4 w-28 h-28 border border-gold-400/25 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-gold-400/15 rounded-full"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in text-white">
                <div className="mb-6 inline-block">
                  <span className="text-sm font-semibold text-gold-400 bg-gold-400/10 px-4 py-2 rounded-full border border-gold-400/20 flex items-center gap-2 w-fit">
                    <TrendingUp className="w-4 h-4" />
                    Architecture & Luxe
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  petsmania
                  <span className="block text-3xl md:text-4xl font-light text-gold-400 mt-2">
                    Excellence in Pet Luxury
                  </span>
                </h1>
                <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                  {t("qualityProducts", language)}
                </p>
                <p className="text-lg text-slate-400 mb-6">
                  {t("fastDelivery", language)}
                </p>
                <p className="text-lg text-slate-400 mb-8">
                  {t("bestPrices", language)}
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/categories/cats">
                    <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-slate-900 font-semibold px-8 py-3 gap-2 border border-gold-400">
                      {t("shop", language)} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-slate-900 px-8 py-3">
                      {t("about", language)}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Architectural Hero Image */}
              <div className="relative h-96 md:h-full animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-slate-700/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl h-full flex items-center justify-center overflow-hidden border border-gold-400/20">
                  <div className="flex flex-col items-center gap-6 w-full h-full p-6">
                    <div className="relative rounded-2xl overflow-hidden w-full max-w-md h-48 border border-gold-400/30">
                      <Image
                        src="https://i.imgur.com/vSAcMIT.jpeg"
                        alt="petsmania - Luxury Pet Supplies"
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                      <div className="relative rounded-xl overflow-hidden h-24 border border-gold-400/20">
                        <Image
                          src="https://i.imgur.com/5ldxbx5.png"
                          alt="Premium Pet Supplies"
                          width={150}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="relative rounded-xl overflow-hidden h-24 border border-gold-400/20">
                        <Image
                          src="https://wallpapercave.com/wp/wp2544022.jpg"
                          alt="Luxury Pet Care"
                          width={150}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <PromotionalBanner />

        {/* Features Section - Architectural Design */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-orange-900">{t("whyChooseUs", language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: t("securePurchase", language),
                  desc: t("securePurchaseDesc", language),
                  color: "text-orange-600",
                },
                {
                  icon: Truck,
                  title: t("fastDelivery", language),
                  desc: t("fastDeliveryDesc", language),
                  color: "text-orange-600",
                },
                {
                  icon: Star,
                  title: t("qualityProducts", language),
                  desc: t("qualityProductsDesc", language),
                  color: "text-orange-600",
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="p-8 text-center hover:shadow-xl transition-all duration-300 animate-slide-up border-0 bg-white/80 backdrop-blur-sm"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-slate-600/20 rounded-full blur-xl"></div>
                    <feature.icon className={`w-12 h-12 mx-auto relative z-10 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <FeaturedProducts />



        {/* Categories Section - Premium Design */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-orange-800 via-orange-700 to-orange-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">{t("shopByCategory", language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <Link key={i} href={cat.href}>
                  <Card
                    className="p-8 text-center cursor-pointer hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-scale-in overflow-hidden group border-0 bg-white/10 backdrop-blur-md"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-400/30 to-slate-600/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div
                        className={`bg-gradient-to-br ${cat.color} rounded-full w-20 h-20 flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform relative z-10 border-2 border-gold-400/50`}
                      >
                        {cat.emoji}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-gold-400 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-slate-300 group-hover:text-gold-300 transition-colors">{cat.count}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offer Section - Luxury Call to Action */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t("freeShippingFrom", language)}</h2>
            <p className="text-lg text-orange-100 mb-8 font-medium">
              {t("startShopping", language)}
            </p>
            <Link href="/categories/cats">
              <Button size="lg" className="bg-white hover:bg-orange-50 text-orange-900 gap-2 px-8 py-3 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                {t("startShopping", language)} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
