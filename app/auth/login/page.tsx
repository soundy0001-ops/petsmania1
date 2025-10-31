"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSupabaseClient } from "@/lib/supabase-client"
import { LogIn, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseClient()

      // For now, we'll use a simple email/password check
      // In production, this should be handled by Supabase Auth
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      if (error || !data) {
        alert("Email ou mot de passe incorrect")
        return
      }

      // Simple password check (in production, use proper hashing)
      if (data.password_hash !== password) {
        alert("Email ou mot de passe incorrect")
        return
      }

      // Store user session
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name
      }))

      alert("Connexion réussie!")
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      alert("Erreur lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header cartCount={0} />

      <main className="max-w-md mx-auto px-4 py-12">
        <Card className="p-8">
          <div className="text-center mb-8">
            <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </Card>
      </main>

      <Footer language="fr" />
    </div>
  )
}
