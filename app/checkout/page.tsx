"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { t } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSupabaseClient } from "@/lib/supabase-client"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

interface CartItem {
  id: string
  name_en: string
  name_fr: string
  name_ar: string
  price: number
  quantity: number
  image_url: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartItems(JSON.parse(cart))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 10

      // Get user ID from localStorage
      const userData = localStorage.getItem("user")
      const userId = userData ? JSON.parse(userData).id : null

      // Require login for order tracking
      if (!userId) {
        alert("Veuillez vous connecter pour passer une commande et suivre vos achats.")
        window.location.href = "/auth/login"
        return
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            address: formData.address,
            city: "", // Add city field if needed
            total_price: total,
            status: "pending",
            user_id: userId,
          },
        ])
        .select()

      if (orderError) throw orderError

      // Create order items
      if (order && order[0]) {
        const orderItems = cartItems.map((item) => ({
          order_id: order[0].id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) throw itemsError
      }

      // Clear cart
      localStorage.removeItem("cart")
      setOrderPlaced(true)
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Erreur lors de la commande. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 10

  if (orderPlaced) {
    return (
      <div>
        <Header cartCount={0} />

        <main className="max-w-2xl mx-auto px-4 py-12">
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
            <p className="text-muted-foreground mb-8">
              Merci pour votre commande ! Vous pouvez maintenant suivre votre commande dans votre compte.
            </p>
            <div className="space-y-4">
              <Link href="/orders">
                <Button className="w-full">Suivre ma commande</Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" className="w-full">Continuer mes achats</Button>
              </Link>
            </div>
          </Card>
        </main>

        <Footer language="fr" />
      </div>
    )
  }

  return (
    <div>
      <Header cartCount={cartItems.length} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">{t("checkout")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">{t("customerInfo")}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("name")}</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t("email")}</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t("phone")}</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t("address")}</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Pet Street, City, Country"
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    rows={4}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? t("loading") : t("placeOrder")}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <img
                      src={item.image_url || "/tipos-manto-perro.jpg"}
                        alt={item.name_fr}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span>
                        {item.name_fr} x{item.quantity}
                      </span>
                    </div>
                    <span>{(item.price * item.quantity).toFixed(2)} DA</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span>10.00 DA</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("total")}</span>
                  <span className="text-primary">{total.toFixed(2)} DA</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer language="fr" />
    </div>
  )
}
