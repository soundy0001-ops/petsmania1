"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Gift, Clock } from "lucide-react"
import { RecommendationCarousel } from "@/components/recommendation-carousel"

interface PromotionalBanner {
  id: string
  title: string
  subtitle: string
  discount: string
  image: string
  animal: string
  color: string
}

interface PromotionDeal {
  id: string
  title: string
  description: string
  discount: number
  endTime: string
  category: string
  image: string
}

const PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  {
    id: "1",
    title: "Réduction MEGA sur les Accessoires",
    subtitle: "Profitez de jusqu'à 50% de réduction sur tous les accessoires pour chats et chiens",
    discount: "-50%",
    image: "/cat-bed.jpg",
    animal: "cats",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "2",
    title: "Flash Sale - Nourriture Premium",
    subtitle: "Aliments haut de gamme en promotion jusqu'à minuit",
    discount: "-35%",
    image: "/cat-food.jpg",
    animal: "chats",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "3",
    title: "Offre Spéciale - Literie Confortable",
    subtitle: "Les lits et coussins les plus vendus à prix réduit",
    discount: "-40%",
    image: "/dog-toy.jpg",
    animal: "chiens",
    color: "from-blue-500 to-cyan-500",
  },
]

const TOP_DEALS: PromotionDeal[] = [
  {
    id: "1",
    title: "Lit Chat Luxe",
    description: "Le confort ultime pour votre chat",
    discount: 20,
    endTime: "2 jours restants",
    category: "Accessoires",
    image: "/cat-bed.jpg",
  },
  {
    id: "2",
    title: "Jouet Interactif Chien",
    description: "Divertissement et exercice combinés",
    discount: 30,
    endTime: "1 jour restant",
    category: "Jouets",
    image: "/dog-toy.jpg",
  },
  {
    id: "3",
    title: "Cage Oiseau Premium",
    description: "Design élégant et spacieux",
    discount: 20,
    endTime: "3 jours restants",
    category: "Accessoires",
    image: "/bird-cage.jpg",
  },
  {
    id: "4",
    title: "Nourriture Premium Chat",
    description: "Nutrition équilibrée et saveur optimale",
    discount: 20,
    endTime: "5 jours restants",
    category: "Alimentaire",
    image: "/cat-food.jpg",
  },
]

const RECOMMENDED_FOR_YOU = [
  {
    id: "1",
    name: "Arbre à Chat Multi-Niveaux",
    price: 5500,
    promoPrice: 4400,
    image: "/cat-tree.jpg",
    reduction: 20,
    reason: "Basé sur vos achats précédents",
  },
  {
    id: "2",
    name: "Laisse Rétractable Chien",
    price: 2500,
    promoPrice: 2000,
    image: "/dog-leash.jpg",
    reduction: 20,
    reason: "Tendance cette semaine",
  },
  {
    id: "3",
    name: "Gamelle Inox Chien",
    price: 1800,
    promoPrice: 1350,
    image: "/dog-bowl.jpg",
    reduction: 25,
    reason: "Nouveau stock",
  },
  {
    id: "4",
    name: "Brosse de Toilettage",
    price: 1200,
    promoPrice: 900,
    image: "/grooming-brush.jpg",
    reduction: 25,
    reason: "Bestseller",
  },
  {
    id: "5",
    name: "Litière Chat Naturelle",
    price: 3500,
    promoPrice: 2625,
    image: "/cat-litter.jpg",
    reduction: 25,
    reason: "Meilleur choix",
  },
  {
    id: "6",
    name: "Jouet Balles Chasse",
    price: 800,
    promoPrice: 600,
    image: "/cat-toy-balls.jpg",
    reduction: 25,
    reason: "Meilleur rapport qualité-prix",
  },
]

const TRENDING = [
  {
    id: "1",
    name: "Collier GPS Chien",
    price: 8900,
    promoPrice: 7120,
    image: "/gps-collar.jpg",
    reduction: 20,
    reason: "Tendance cette semaine",
  },
  {
    id: "2",
    name: "Fontaine d'Eau Chat",
    price: 4500,
    promoPrice: 3375,
    image: "/water-fountain.jpg",
    reduction: 25,
    reason: "Tendance cette semaine",
  },
  {
    id: "3",
    name: "Manteau Chien Hiver",
    price: 3200,
    promoPrice: 2400,
    image: "/dog-coat.jpg",
    reduction: 25,
    reason: "Tendance cette semaine",
  },
  {
    id: "4",
    name: "Perchoir Oiseau",
    price: 2800,
    promoPrice: 2100,
    image: "/bird-perch.jpg",
    reduction: 25,
    reason: "Tendance cette semaine",
  },
  {
    id: "5",
    name: "Peigne Anti-Puces",
    price: 1500,
    promoPrice: 1125,
    image: "/flea-comb.jpg",
    reduction: 25,
    reason: "Tendance cette semaine",
  },
  {
    id: "6",
    name: "Tunnel de Jeu Chat",
    price: 2200,
    promoPrice: 1650,
    image: "/cat-tunnel.jpg",
    reduction: 25,
    reason: "Tendance cette semaine",
  },
]

export default function PromotionsPage() {
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartCount(JSON.parse(cart).length)
  }, [])

  if (!mounted) return null

  return (
    <div>
      <Header cartCount={cartCount} />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/20 to-accent/20 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-block mb-4">
              <Badge className="gap-2 px-4 py-2">
                <Zap className="w-4 h-4" />
                Promotions et Deals Exclusifs
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Économisez Grand Cette Semaine</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez les meilleures offres sur une large gamme de produits pour animaux de compagnie
            </p>
          </div>
        </section>

        {/* Promotional Carousels */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 space-y-16">
            {PROMOTIONAL_BANNERS.map((banner) => (
              <div key={banner.id} className={`bg-gradient-to-r ${banner.color} rounded-2xl overflow-hidden`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                  <div className="text-white space-y-6">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-2">{banner.title}</h2>
                      <p className="text-lg opacity-90">{banner.subtitle}</p>
                    </div>
                    <Link href={`/categories/${banner.animal}`}>
                      <Button className="gap-2 bg-white text-primary hover:bg-white/90">
                        Voir les offres <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Deals Grid */}
        <section className="py-16 md:py-24 bg-card/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Gift className="w-8 h-8 text-primary" />
              Meilleures Offres de la Semaine
            </h2>
            <p className="text-muted-foreground mb-12">Temps limité - stocks limités</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TOP_DEALS.map((deal) => (
                <Link key={deal.id} href={`/products/${deal.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 group cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                      <Image
                        src={deal.image || "/placeholder.svg"}
                        alt={deal.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-lg font-bold flex items-center gap-1">
                        <Zap className="w-4 h-4" />-{deal.discount}%
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {deal.endTime}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">{deal.category}</p>
                      <h3 className="font-semibold mb-1 flex-1">{deal.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
                      <Button className="w-full gap-2" size="sm">
                        Voir l'offre
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 space-y-24">
            {/* Recommended for You */}
            <RecommendationCarousel
              title="Recommandé pour Vous"
              reason="Basé sur votre historique de navigation et vos préférences"
              products={RECOMMENDED_FOR_YOU}
            />

            {/* Trending */}
            <RecommendationCarousel
              title="Tendances Cette Semaine"
              reason="Les produits les plus populaires et recherchés"
              products={TRENDING}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/15 to-secondary/15">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ne Manquez Pas Nos Promotions</h2>
            <p className="text-lg text-muted-foreground">
              Inscrivez-vous à notre newsletter pour recevoir les meilleures offres en avant-première
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background"
              />
              <Button>S'inscrire</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer language="fr" />
    </div>
  )
}
