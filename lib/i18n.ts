export type Language = "fr"

export const translations = {
  fr: {
    // Navigation
    home: "Accueil",
    shop: "Boutique",
    about: "À propos",
    contact: "Contact",
    admin: "Admin",

    // Categories
    cats: "Chats",
    dogs: "Chiens",
    birds: "Oiseaux",
    other: "Autres animaux",
    currency: "DA",
    productType: "Type de produit",
    accessories: "Accessoires",
    food: "Alimentaire",
    careGrooming: "Soin et Toilettage",
    animalType: "Type d'animal",
    searchByName: "Rechercher par nom",
    searchProducts: "Rechercher des produits",
    noProductsFound: "Aucun produit trouvé",
    enterSearchCriteria: "Entrez des critères de recherche pour trouver des produits",

    // Products
    price: "Prix",
    stock: "En stock",
    outOfStock: "Rupture de stock",
    addToCart: "Ajouter au panier",
    viewDetails: "Voir les détails",
    brand: "Marque",
    subcategory: "Sous-catégorie",

    // Cart
    cart: "Panier",
    checkout: "Passer la commande",
    emptyCart: "Votre panier est vide",
    subtotal: "Sous-total",
    shipping: "Livraison",
    total: "Total",
    freeShipping: "Livraison gratuite à partir de 10.000 DA",

    // Checkout
    customerInfo: "Informations client",
    name: "Nom complet",
    email: "E-mail",
    phone: "Téléphone",
    address: "Adresse",
    placeOrder: "Passer la commande",
    orderConfirmed: "Commande confirmée",

    // Search & Filter
    search: "Rechercher des produits",
    filter: "Filtrer",
    sortBy: "Trier par",
    priceLowest: "Prix: du plus bas au plus élevé",
    priceHighest: "Prix: du plus élevé au plus bas",
    newest: "Plus récent",
    filterByBrand: "Filtrer par marque",
    filterByType: "Filtrer par type",
    filterBySubcategory: "Filtrer par sous-catégorie",
    clearFilters: "Réinitialiser les filtres",

    // About & Contact
    aboutUs: "À propos de nous",
    contactUs: "Nous contacter",
    message: "Message",
    send: "Envoyer",
    bestPetsSupplies: "Les meilleurs produits pour vos animaux de compagnie",
    qualityProducts: "Produits de qualité",
    fastDelivery: "Livraison rapide",
    bestPrices: "Meilleurs prix",

    // Admin
    adminPanel: "Panneau d'administration",
    password: "Mot de passe",
    login: "Connexion",
    logout: "Déconnexion",
    products: "Produits",
    orders: "Commandes",
    coupons: "Coupons",
    addProduct: "Ajouter un produit",
    editProduct: "Modifier le produit",
    deleteProduct: "Supprimer le produit",

    // Common
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    save: "Enregistrer",
    delete: "Supprimer",
    edit: "Modifier",
  },
} as const

export function t(key: keyof typeof translations.fr): string {
  return translations.fr[key] || key
}
