"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  products: {
    id: string
    name: string
    image_url: string
  }
}

interface Order {
  id: string
  total_price: number
  status: string
  created_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  city: string
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/auth/login"
      return
    }

    const user = JSON.parse(userData)
    fetchOrders(user.id)

    // Get cart count
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)
  }, [])

  const fetchOrders = async (userId: string) => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "confirmed":
        return <Package className="w-4 h-4 text-blue-500" />
      case "shipped":
        return <Truck className="w-4 h-4 text-orange-500" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "confirmed":
        return "Confirmée"
      case "shipped":
        return "Expédiée"
      case "delivered":
        return "Livrée"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">Chargement de vos commandes...</div>
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
          <h1 className="text-3xl font-bold mb-2">Mes commandes</h1>
          <p className="text-muted-foreground">
            {orders.length} commande{orders.length !== 1 ? 's' : ''} trouvée{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucune commande trouvée</h2>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore passé de commande. Commencez vos achats dès maintenant !
            </p>
            <Link href="/shop">
              <Button>Explorer les produits</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Commande #{order.id.slice(-8)}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Passée le {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-2xl font-bold text-primary">{order.total_price.toFixed(2)} DA</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium mb-3">Articles commandés</h4>
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <img
                          src={item.products.image_url || "/tipos-manto-perro.jpg"}
                          alt={item.products.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.products.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantité: {item.quantity} × {item.price.toFixed(2)} DA
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} DA</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Informations de livraison</h4>
                      <p className="text-muted-foreground">{order.customer_name}</p>
                      <p className="text-muted-foreground">{order.customer_email}</p>
                      <p className="text-muted-foreground">{order.customer_phone}</p>
                      <p className="text-muted-foreground">{order.address}, {order.city}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Voir les détails
                      </Button>
                    </div>
                  </div>
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
