import { useState } from 'react'

function App() {
  const [page, setPage] = useState('home')
  const [cart, setCart] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [usersList, setUsersList] = useState<any[]>([])

  const [showAuthAlert, setShowAuthAlert] = useState(false)

  const addToCart = (item: any) => {
    if (!user) {
      setShowAuthAlert(true)
      return
    }
    setCart([...cart, { ...item, id: Date.now() }])
    setPage('cart')
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const handleSignup = (userData: any) => {
    const newUser = { ...userData, id: Date.now() }
    setUsersList([...usersList, newUser])
    setUser(newUser)
    setPage('home')
  }

  const handleLogin = (credentials: any) => {
    const foundUser = usersList.find(u => u.email === credentials.email && u.password === credentials.password)
    if (foundUser) {
      setUser(foundUser)
      setPage('home')
      return true
    }
    return false
  }

  const handleLogout = () => {
    setUser(null)
    setPage('home')
  }

  const placeOrder = () => {
    if (!user) {
      setPage('signup')
      return
    }
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR'),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price, 0) * 1.05, // Total avec taxes
      status: 'En préparation'
    }
    setOrders([newOrder, ...orders])
    setCart([])
    setPage('profile')
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Auth Alert Modal */}
      {showAuthAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center">
            <div className="w-20 h-20 bg-gran-light rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🔒
            </div>
            <h3 className="text-2xl font-bold text-gran-green mb-4">Connexion Requise</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Pour ajouter votre création au panier et passer commande, vous devez être connecté à votre compte Gran d'Or.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowAuthAlert(false)
                  setPage('login')
                }}
                className="w-full bg-gran-green text-white py-4 rounded-2xl font-bold hover:bg-gran-dark transition-all"
              >
                Se connecter
              </button>
              <button 
                onClick={() => {
                  setShowAuthAlert(false)
                  setPage('signup')
                }}
                className="w-full border border-gray-100 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                Créer un compte
              </button>
              <button 
                onClick={() => setShowAuthAlert(false)}
                className="w-full py-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gran-green transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gran-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
              <span className="text-2xl font-bold text-gran-green font-serif">Gran d'Or</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => setPage('home')} className={`text-sm font-medium transition-colors ${page === 'home' ? 'text-gran-green border-b-2 border-gran-green py-2' : 'text-gray-500 hover:text-gran-green'}`}>L'Aventure</button>
              <button onClick={() => setPage('configurator')} className={`text-sm font-medium transition-colors ${page === 'configurator' ? 'text-gran-green border-b-2 border-gran-green py-2' : 'text-gray-500 hover:text-gran-green'}`}>Configurateur</button>
              <button onClick={() => setPage('mission')} className={`text-sm font-medium transition-colors ${page === 'mission' ? 'text-gran-green border-b-2 border-gran-green py-2' : 'text-gray-500 hover:text-gran-green'}`}>Notre Mission</button>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setPage(user ? 'profile' : 'signup')}
                className={`flex items-center gap-2 transition-colors ${user ? 'text-gran-green font-bold' : 'text-gray-500 hover:text-gran-green'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user && <span className="text-sm hidden sm:inline">{user.name.split(' ')[0]}</span>}
              </button>
              <button onClick={() => setPage('cart')} className="text-gray-500 hover:text-gran-green transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gran-gold text-gran-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {page === 'home' && <Home onStart={() => setPage('configurator')} />}
        {page === 'configurator' && <Configurator onAddToCart={addToCart} />}
        {page === 'mission' && <Mission />}
        {page === 'cart' && <Cart items={cart} onRemove={removeFromCart} onContinue={() => setPage('configurator')} onCheckout={placeOrder} isLoggedIn={!!user} />}
        {page === 'signup' && <Signup onSignup={handleSignup} onSwitch={() => setPage('login')} />}
        {page === 'login' && <Login onLogin={handleLogin} onSwitch={() => setPage('signup')} />}
        {page === 'profile' && <Profile user={user} orders={orders} onLogout={handleLogout} />}
      </main>

      <footer className="bg-white border-t border-gran-green/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <span className="text-xl font-bold text-gran-green font-serif">Gran d'Or</span>
              <p className="mt-4 text-sm text-gray-500">
                L'équilibre parfait entre gourmandise et bien-être. Fabriqué avec passion pour des matins inspirés.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gran-green uppercase tracking-wider">Navigation</h3>
              <ul className="mt-4 space-y-2">
                <li><button onClick={() => setPage('home')} className="text-sm text-gray-500 hover:text-gran-green">L'Aventure</button></li>
                <li><button onClick={() => setPage('configurator')} className="text-sm text-gray-500 hover:text-gran-green">Configurateur</button></li>
                <li><button onClick={() => setPage('mission')} className="text-sm text-gray-500 hover:text-gran-green">Notre Mission</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gran-green uppercase tracking-wider">Information</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gran-green">Ingrédients</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gran-green">Livraison</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gran-green">Mentions Légales</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gran-green uppercase tracking-wider">Newsletter</h3>
              <p className="mt-4 text-sm text-gray-500">Rejoignez le cercle des épicuriens conscients.</p>
              <form className="mt-4 flex">
                <input type="email" placeholder="Email" className="bg-gray-100 border-none rounded-l-md px-4 py-2 text-sm w-full focus:ring-1 focus:ring-gran-green" />
                <button type="submit" className="bg-gran-green text-white px-4 py-2 rounded-r-md hover:bg-gran-dark transition-colors">OK</button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
            © 2026 Gran d'Or. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}

function Home({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/granola1.jpeg" 
            alt="Granola artisanal Gran d'Or" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <span className="inline-block px-4 py-1 bg-gran-gold text-gran-dark text-xs font-bold rounded-full mb-6 tracking-widest uppercase">L'excellence artisanale</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg">L'Aventure Culinaire commence ici.</h1>
          <p className="text-xl text-white mb-10 drop-shadow-md max-w-2xl mx-auto">
            Découvrez l'harmonie parfaite entre la gourmandise et le bien-être avec nos mélanges de granola façonnés à la main.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={onStart} className="bg-gran-green text-white px-8 py-4 rounded-md font-bold hover:bg-gran-dark transition-all transform hover:scale-105 shadow-xl shadow-black/20">Create Your Mix</button>
          </div>
        </div>
      </section>

      {/* Nos Engagements */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gran-green mb-4">Nos Engagements</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Chaque grain est sélectionné avec soin pour vous offrir une expérience gustative authentique et nutritive.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-gran-light rounded-full flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gran-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-gran-green mb-4">L'Artisanat Français</h3>
             <p className="text-gray-500 text-sm leading-relaxed">Cuit à basse température dans nos ateliers, notre granola conserve tout son croquant et ses bienfaits nutritionnels. Une méthode traditionnelle pour un goût d'exception.</p>
          </div>
          <div className="bg-gran-green p-8 rounded-2xl text-white shadow-lg">
             <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 text-white">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
               </svg>
             </div>
             <h3 className="text-xl font-bold mb-4">Santé & Transparence</h3>
             <p className="text-white/80 text-sm leading-relaxed mb-6">Sans sucres raffinés, sans conservateurs. Juste le meilleur de la nature pour votre vitalité quotidienne.</p>
             <div className="flex gap-2">
               <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] uppercase font-bold">Vegan</span>
               <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] uppercase font-bold">Bio</span>
               <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] uppercase font-bold">Sans Gluten</span>
             </div>
          </div>
          <div className="bg-gran-gold p-8 rounded-2xl text-gran-dark shadow-sm">
             <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
               </svg>
             </div>
             <h3 className="text-xl font-bold mb-4">Sur Mesure</h3>
             <p className="text-gran-dark/70 text-sm leading-relaxed">Parce que chaque palais est unique, composez votre propre mélange selon vos envies et besoins nutritionnels.</p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gran-green mb-12">Comment ça marche ?</h2>
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 bg-gran-green text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-bold text-gran-green mb-2">Choisissez votre base</h3>
                  <p className="text-gray-500 text-sm">Avoine, sarrasin ou mélange sans gluten, définissez la structure de votre plaisir.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 bg-gran-green text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-bold text-gran-green mb-2">Ajoutez vos pépites</h3>
                  <p className="text-gray-500 text-sm">Fruits secs, oléagineux torréfiés ou éclats de chocolat noir : soyez créatif.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 bg-gran-green text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-bold text-gran-green mb-2">Recevez chez vous</h3>
                  <p className="text-gray-500 text-sm">Livraison sous 48h dans un emballage éco-conçu et réutilisable.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-80 h-80 md:w-96 md:h-96 bg-gran-light rounded-full absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="bg-white p-4 rounded-2xl shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500 overflow-hidden">
               <img 
                 src="/images/GRA3.jpeg" 
                 alt="Pack Granola Gran d'Or" 
                 className="aspect-square object-cover rounded-xl"
               />
               <div className="mt-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm absolute -right-8 top-1/2 -translate-y-1/2 max-w-[180px]">
                 <p className="text-[10px] text-gran-gold font-bold uppercase tracking-wider mb-2">Commande #4232</p>
                 <p className="text-xs font-medium italic text-gray-600">"Un mélange parfait pour mes matins sportifs."</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gran-light">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gran-green rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Prêt à créer votre propre Gran d'Or ?</h2>
              <p className="text-white/70 mb-10 max-w-xl mx-auto">Rejoignez notre communauté de passionnés et commencez votre aventure culinaire aujourd'hui.</p>
              <button onClick={onStart} className="bg-gran-gold text-gran-dark px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">C'est parti !</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Configurator({ onAddToCart }: { onAddToCart: (item: any) => void }) {
  const [ingredients, setIngredients] = useState([
    { id: 'dates', name: 'Dattes Medjool', price: 8.00, selected: false, icon: '🌴', kcal: 25 },
    { id: 'almonds', name: 'Amandes Grillées', price: 10.00, selected: false, icon: '🥜', kcal: 40 },
    { id: 'cashews', name: 'Noix de Cajou', price: 9.00, selected: false, icon: '🥥', kcal: 45 },
    { id: 'pumpkin', name: 'Graines de Courge', price: 5.00, selected: false, icon: '🎃', kcal: 20 },
    { id: 'raisins', name: 'Raisins Secs', price: 4.00, selected: false, icon: '🍇', kcal: 15 },
    { id: 'sunflower', name: 'Tournesol', price: 4.00, selected: false, icon: '🌻', kcal: 22 },
    { id: 'miel', name: 'Miel Pur du Terroir', price: 4.00, selected: false, icon: '🍯', kcal: 22 },
  ])

  const toggleIngredient = (id: string) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, selected: !ing.selected } : ing))
  }

  const selectedIngredients = ingredients.filter(ing => ing.selected)
  const basePrice = 13.00
  const totalPrice = basePrice + selectedIngredients.reduce((sum, ing) => sum + ing.price, 0)
  const totalKcal = 206 + selectedIngredients.reduce((sum, ing) => sum + ing.kcal, 0)

  const handleAddToCart = () => {
    onAddToCart({
      name: "Mélange Personnalisé",
      price: totalPrice,
      ingredients: selectedIngredients,
      kcal: totalKcal
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-16">
        <p className="text-gran-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">L'artisanat sur-mesure</p>
        <h2 className="text-4xl md:text-5xl font-bold text-gran-green mb-6">Mon Granola d'Or</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">Concevez votre mélange idéal à partir d'ingrédients biologiques rigoureusement sélectionnés. Chaque sachet est assemblé à la main dans notre atelier à Casablanca.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Base Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gran-light rounded-full flex items-center justify-center text-gran-green font-bold">1</div>
              <h3 className="text-xl font-bold text-gran-green">La Base Signature</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-gran-green shadow-sm flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">🥣</div>
              <div>
                <h4 className="font-bold text-gran-green mb-1">Avoine Grillée & Miel Pur du Terroir</h4>
                <p className="text-sm text-gray-500 mb-2">Une base craquante toastée à basse température pour préserver les nutriments. Incluse par défaut.</p>
                <span className="text-xs font-bold text-gran-green uppercase tracking-wider">SÉLECTIONNÉ (250g)</span>
              </div>
            </div>
          </section>

          {/* Ingredients Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gran-light rounded-full flex items-center justify-center text-gran-green font-bold">2</div>
                <h3 className="text-xl font-bold text-gran-green">Vos Ingrédients</h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">{selectedIngredients.length} sélectionnés</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ingredients.map(ing => (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${ing.selected ? 'border-gran-green bg-gran-green/5' : 'border-gray-100 bg-white hover:border-gran-green/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">{ing.icon}</div>
                    <div>
                      <p className="font-bold text-gran-green text-sm">{ing.name}</p>
                      <p className="text-xs text-gray-400">+{ing.price.toFixed(2)} DH</p>
                    </div>
                  </div>
                  {ing.selected ? (
                    <div className="w-6 h-6 bg-gran-green rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-100 rounded-full flex items-center justify-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Nutritional Values */}
          <section className="bg-gray-100/50 p-8 rounded-3xl">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Valeurs Nutritionnelles (pour 100g)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <p className="text-2xl font-bold text-gran-green">{totalKcal}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kcal</p>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <p className="text-2xl font-bold text-gran-green">12g</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Protéines</p>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <p className="text-2xl font-bold text-gran-green">8.5g</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fibres</p>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <p className="text-2xl font-bold text-gran-green">14g</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Glucides</p>
              </div>
            </div>
          </section>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-32">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-48 h-48 bg-gran-light rounded-full flex items-center justify-center text-6xl">
                  <img src="/images/GRA4.jpeg" alt="" className='w-full h-full object-cover rounded-full'/>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gran-gold text-gran-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">250g</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Base Avoine</span>
                <span className="font-bold text-gran-green">{basePrice.toFixed(2)} DH</span>
              </div>
              {selectedIngredients.map(ing => (
                <div key={ing.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">{ing.name}</span>
                  <span className="font-bold text-gran-green">+{ing.price.toFixed(2)} DH</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gran-green">Total estimé</span>
                <span className="text-3xl font-bold text-gran-green">{totalPrice.toFixed(2)} DH</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gran-green text-white py-4 rounded-xl font-bold hover:bg-gran-dark transition-colors shadow-lg shadow-gran-green/20"
              >
                Ajouter au Panier
              </button>
              <button className="w-full border border-gray-200 text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                Enregistrer la Recette
              </button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-[10px] text-gray-400 leading-tight">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gran-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Livraison estimée sous 24-48 heures au Maroc. Expédié avec amour de notre atelier casablancais.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Mission() {
  const founders = [
    { 
      name: 'Najat', 
      role: "Production", 
      bio: "Responsable de la fabrication et de la formulation du produit. J'ai conçu la recette originale et assuré la production artisanale de notre granola, garantissant ainsi la qualité, la traçabilité et le goût authentique qui font aujourd'hui la satisfaction de nos clients.", 
      image: '/images/najat.jpeg' 
    },
    { 
      name: 'Soukaina', 
      role: "Finance", 
      bio: "Responsable de la gestion financière du projet : élaboration du budget, suivi des coûts et optimisation des dépenses afin d’assurer la rentabilité et la viabilité du projet.", 
      image: '/images/SOUKAINA.jpeg' 
    },
    { 
      name: 'Mohamed', 
      role: "Commercial", 
      bio: "Mohamed apporte la vision stratégique pour amener l'artisanat local sur la scène internationale.", 
      image: '/images/MOHAMED.jpeg' 
    },
  ]

  return (
    <div className="animate-fade-in">
      {/* Story Hero */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gran-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">Notre Histoire</p>
        <h2 className="text-4xl md:text-5xl font-bold text-gran-green mb-12">Trois Passionnés, Une Mission</h2>
        <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed mb-16">
          Au cœur de Gran d'Or se trouve une conviction simple : l'excellence culinaire commence par le respect de la terre et du geste artisanal.
        </p>
        <div className="aspect-video bg-gray-200 rounded-[40px] overflow-hidden shadow-2xl relative group">
           <img 
             src="/images/granola2.jpeg" 
             alt="Atelier Gran d'Or" 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
           />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {founders.map(founder => (
                <div key={founder.name} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-gran-green transition-colors group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-gran-green mb-1">{founder.name}</h3>
                  <p className="text-xs font-bold text-gran-gold uppercase tracking-wider mb-4">{founder.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{founder.bio}</p>
                </div>
              ))}
              <div className="bg-gran-green p-8 rounded-3xl text-white flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Préserver le goût, nourrir le corps.</h3>
                <p className="text-white/70 text-sm mb-6">Nous croyons en une alimentation sans compromis entre plaisir et santé.</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">100% Naturel</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">Artisanal</span>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gran-light p-12 rounded-[40px]">
                <h3 className="text-3xl font-bold text-gran-green mb-6">Notre Atelier</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Basé à Lyon, notre atelier est le lieu où la magie opère. Chaque lot est préparé en petites quantités pour garantir une fraîcheur optimale. Nous travaillons directement avec des producteurs locaux pour le miel et les fruits de saison.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-2 rounded-2xl shadow-sm aspect-square overflow-hidden">
                     <img src="/images/GRA4.jpeg" className="w-full h-full object-cover rounded-xl" alt="Atelier de préparation" />
                   </div>
                   <div className="bg-white p-2 rounded-2xl shadow-sm aspect-square overflow-hidden">
                     <img src="/images/granola1.jpeg" className="w-full h-full object-cover rounded-xl" alt="Ingrédients frais" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Cart({ items, onRemove, onContinue, onCheckout, isLoggedIn }: { items: any[], onRemove: (id: number) => void, onContinue: () => void, onCheckout: () => void, isLoggedIn: boolean }) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const total = subtotal * 1.05

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <h2 className="text-3xl font-bold text-gran-green mb-2 font-serif">Votre Création Unique</h2>
      <p className="text-gray-500 mb-12">Le fruit de votre imagination, assemblé avec soin dans notre atelier artisanal.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] text-center border border-dashed border-gray-300">
              <p className="text-gray-500 mb-6">Votre panier est vide.</p>
              <button onClick={onContinue} className="bg-gran-green text-white px-8 py-3 rounded-xl font-bold">Commencer une création</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 relative">
                <div className="w-full md:w-48 aspect-square bg-gran-light rounded-3xl flex items-center justify-center text-5xl">🍯</div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gran-green mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-0.5 bg-gran-light text-gran-green text-[10px] font-bold rounded-md uppercase">Personnalisé</span>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Format Sachet • 250g</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-gran-green">{item.price.toFixed(2)} DH</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Composition Artisanale</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-gray-50 px-3 py-1 rounded-full text-gray-600">Base Avoine & Miel</span>
                      {item.ingredients.map((ing: any) => (
                        <span key={ing.id} className="text-xs bg-gray-50 px-3 py-1 rounded-full text-gray-600">{ing.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div className="bg-gray-50 p-2 rounded-xl text-center">
                      <p className="text-sm font-bold text-gran-green">{item.kcal}</p>
                      <p className="text-[8px] text-gray-400 uppercase">Kcal</p>
                    </div>
                    <div className="bg-gran-gold/10 p-2 rounded-xl text-center">
                      <p className="text-sm font-bold text-gran-green">12g</p>
                      <p className="text-[8px] text-gray-400 uppercase">Prot.</p>
                    </div>
                    <div className="bg-gran-green/5 p-2 rounded-xl text-center">
                      <p className="text-sm font-bold text-gran-green">8g</p>
                      <p className="text-[8px] text-gray-400 uppercase">Fibres</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl text-center">
                      <p className="text-sm font-bold text-gran-green">4g</p>
                      <p className="text-[8px] text-gray-400 uppercase">Sucre</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gran-green mb-8">Résumé de la commande</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span className="text-sm">Sous-total</span>
                <span className="font-bold">{subtotal.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="text-sm">Livraison (Casablanca)</span>
                <span className="text-gran-green font-bold uppercase text-xs">Offert</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="text-sm">Taxes (5%)</span>
                <span className="font-bold">{(subtotal * 0.05).toFixed(2)} DH</span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mb-8 flex justify-between items-center">
              <span className="text-xl font-bold text-gran-green">Total</span>
              <span className="text-3xl font-bold text-gran-green">{total.toFixed(2)} DH</span>
            </div>
            <div className="space-y-4">
              <button 
                onClick={onCheckout}
                className="w-full bg-gran-green text-white py-5 rounded-2xl font-bold hover:bg-gran-dark transition-all shadow-lg shadow-gran-green/20"
              >
                {isLoggedIn ? 'Passer la commande' : 'Se connecter pour commander'}
              </button>
              <button onClick={onContinue} className="w-full text-gray-400 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors">Continuer mes achats</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Login({ onLogin, onSwitch }: { onLogin: (credentials: any) => boolean, onSwitch: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = onLogin(formData)
    if (!success) {
      setError('Email ou mot de passe incorrect.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gran-light/30">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
        <div className="text-center">
          <span className="text-3xl font-bold text-gran-green font-serif">Gran d'Or</span>
          <h2 className="mt-6 text-3xl font-extrabold text-gran-green">Bon retour !</h2>
          <p className="mt-2 text-sm text-gray-500">Connectez-vous pour gérer vos commandes.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold text-center border border-red-100">{error}</div>}
          <div className="space-y-4">
            <div>
              <label htmlFor="email-login" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Adresse email</label>
              <input
                id="email-login"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-300 text-gray-900 rounded-2xl focus:outline-none focus:ring-gran-green focus:border-gran-green focus:z-10 sm:text-sm bg-gray-50"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password-login" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
              <input
                id="password-login"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-300 text-gray-900 rounded-2xl focus:outline-none focus:ring-gran-green focus:border-gran-green focus:z-10 sm:text-sm bg-gray-50"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-gran-green text-white py-4 rounded-2xl font-bold hover:bg-gran-dark transition-all shadow-lg shadow-gran-green/20">Se connecter</button>
        </form>
        <div className="text-center">
          <p className="text-xs text-gray-400">Pas encore de compte ? <button onClick={onSwitch} className="font-bold text-gran-gold hover:text-gran-dark transition-colors">S'inscrire</button></p>
        </div>
      </div>
    </div>
  )
}

function Profile({ user, orders, onLogout }: { user: any, orders: any[], onLogout: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* User Info Card */}
        <div className="lg:w-1/3">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gran-light rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner text-gran-green font-bold">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gran-green mb-2">{user.name}</h2>
            <p className="text-gray-400 text-sm mb-8">{user.email}</p>
            <div className="pt-8 border-t border-gray-50 flex flex-col gap-3">
              <button className="w-full py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Modifier mon profil</button>
              <button onClick={onLogout} className="w-full py-3 rounded-xl bg-red-50 text-red-500 text-sm font-bold hover:bg-red-100 transition-colors">Déconnexion</button>
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-bold text-gran-green mb-8 font-serif">Historique de mes commandes</h2>
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] text-center border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Vous n'avez pas encore passé de commande.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:border-gran-green/30 transition-colors">
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-50">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Commande</p>
                      <h3 className="font-bold text-gran-green">{order.id}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                      <p className="font-bold text-gran-green">{order.date}</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">{item.name} <span className="text-gray-300 text-xs ml-2">x 1</span></span>
                        <span className="font-bold text-gran-green">{item.price.toFixed(2)} DH</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Livré' ? 'bg-green-50 text-green-600' : 'bg-gran-gold/10 text-gran-dark'}`}>
                      {order.status}
                    </span>
                    <p className="text-xl font-bold text-gran-green">Total : {order.total.toFixed(2)} DH</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Signup({ onSignup, onSwitch }: { onSignup: (data: any) => void, onSwitch: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSignup(formData)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gran-light/30">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
        <div className="text-center">
          <span className="text-3xl font-bold text-gran-green font-serif">Gran d'Or</span>
          <h2 className="mt-6 text-3xl font-extrabold text-gran-green">Créez votre compte</h2>
          <p className="mt-2 text-sm text-gray-500">Rejoignez la communauté Gran d'Or.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name-signup" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom complet</label>
              <input
                id="name-signup"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-300 text-gray-900 rounded-2xl focus:outline-none focus:ring-gran-green focus:border-gran-green focus:z-10 sm:text-sm bg-gray-50"
                placeholder="Najat Bennani"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email-signup" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Adresse email</label>
              <input
                id="email-signup"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-300 text-gray-900 rounded-2xl focus:outline-none focus:ring-gran-green focus:border-gran-green focus:z-10 sm:text-sm bg-gray-50"
                placeholder="najat@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password-signup" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
              <input
                id="password-signup"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-300 text-gray-900 rounded-2xl focus:outline-none focus:ring-gran-green focus:border-gran-green focus:z-10 sm:text-sm bg-gray-50"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-gran-green text-white py-4 rounded-2xl font-bold hover:bg-gran-dark transition-all shadow-lg shadow-gran-green/20">S'inscrire</button>
        </form>
        <div className="text-center">
          <p className="text-xs text-gray-400">Déjà un compte ? <button onClick={onSwitch} className="font-bold text-gran-gold hover:text-gran-dark transition-colors">Se connecter</button></p>
        </div>
      </div>
    </div>
  )
}

export default App
