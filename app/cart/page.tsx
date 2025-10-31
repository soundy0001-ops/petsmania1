"use client"

import { useState, useEffect } from "react"
import { t } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Trash2, ArrowLeft } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
  out_of_stock?: boolean
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartItems(JSON.parse(cart))
  }, [])

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id)
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    const updated = cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const getItemName = (item: CartItem): string => {
    return item.name
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 10 : 0
  const total = subtotal + shipping - discount

  if (!mounted) return null

  return (
    <div>
      <Header cartCount={cartItems.length} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/shop" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t("shop")}
        </Link>

        <h1 className="text-4xl font-bold mb-8">{t("cart")}</h1>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg mb-6">{t("emptyCart")}</p>
            <Link href="/shop">
              <Button>{t("shop")}</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={getItemName(item)}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{getItemName(item)}</h3>
                        <p className="text-primary font-bold">{item.price.toFixed(2)} DA</p>
                        {item.out_of_stock && (
                          <p className="text-xs text-red-600 font-medium">Rupture de stock</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="font-bold text-lg mb-4">{t("checkout")}</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span>{subtotal.toFixed(2)} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span>{shipping.toFixed(2)} DA</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-accent">
                      <span>Discount</span>
                      <span>-{discount.toFixed(2)} DA</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>{t("total")}</span>
                    <span className="text-primary">{total.toFixed(2)} DA</span>
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full">{t("placeOrder")}</Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer language="fr" />
    </div>
  )
}
