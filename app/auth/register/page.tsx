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
import { UserPlus, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    if (formData.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseClient()

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.email)
        .single()

      if (existingUser) {
        alert("Un compte avec cet email existe déjà")
        return
      }

      // Create new user
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            email: formData.email,
            password_hash: formData.password, // In production, hash the password
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone || null,
            address: formData.address || null,
            city: formData.city || null,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Supabase error:", error)
        alert(`Erreur lors de la création du compte: ${error.message || 'Erreur inconnue'}`)
        return
      }

      // Store user session
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name
      }))

      alert("Compte créé avec succès!")
      router.push("/")
    } catch (error) {
      console.error("Registration error:", error)
      alert("Erreur lors de la création du compte: " + (error as Error).message)
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
            <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Inscription</h1>
            <p className="text-muted-foreground">Créez votre compte</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prénom</label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adresse</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Votre adresse"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ville</label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Votre ville"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
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

            <div>
              <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirmez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création du compte..." : "S'inscrire"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Déjà un compte?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </Card>
      </main>

      <Footer language="fr" />
    </div>
  )
}
