"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

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

interface OrderItemsProps {
  orderId: string
}

export function OrderItems({ orderId }: OrderItemsProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("order_items")
          .select(`
            id,
            product_id,
            quantity,
            price,
            products (
              id,
              name,
              image_url
            )
          `)
          .eq("order_id", orderId)

        if (error) throw error
        setOrderItems(data || [])
      } catch (error) {
        console.error("Error fetching order items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderItems()
  }, [orderId])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Chargement des articles...</p>
  }

  if (orderItems.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun article trouvé</p>
  }

  return (
    <div className="space-y-3">
      {orderItems.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <img
            src={item.products.image_url || "/placeholder.svg"}
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
  )
}
