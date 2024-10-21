import React from 'react'
import { Dumbbell, ShirtIcon, Trophy, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const SportsApparelMRP = () => {
  const plans = [
    { 
      name: "Básico", 
      price: "29.99", 
      icon: ShirtIcon, 
      features: [
        "2 camisetas", 
        "1 pantalón corto", 
        "Acceso a catálogo básico", 
        "Envío estándar", 
        "Soporte básico por email", 
        "Acceso a ofertas especiales"
      ]
    },
    { 
      name: "Pro", 
      price: "59.99", 
      icon: Dumbbell, 
      features: [
        "4 camisetas", 
        "2 pantalones cortos", 
        "1 chaqueta", 
        "Acceso a catálogo completo", 
        "Envío gratis", 
        "Soporte prioritario por email", 
        "Acceso anticipado a promociones", 
        "Descuento del 10% en futuras compras"
      ]
    },
    { 
      name: "Élite", 
      price: "99.99", 
      icon: Trophy, 
      features: [
        "6 camisetas", 
        "3 pantalones cortos", 
        "2 chaquetas", 
        "Acceso a ediciones limitadas", 
        "Envío express gratis", 
        "Personalización gratuita", 
        "Soporte VIP 24/7", 
        "Descuento del 20% en futuras compras", 
        "Acceso exclusivo a eventos deportivos"
      ]
    },
  ]

  const testimonials = [
    {
      name: "María G.",
      role: "Corredora de maratón",
      content: "La calidad de la ropa es excepcional. He corrido mis mejores tiempos con estos productos.",
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      name: "Carlos R.",
      role: "Entrenador personal",
      content: "Mis clientes siempre preguntan por mi ropa. La comodidad y el estilo son inigualables.",
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      name: "Laura M.",
      role: "Yogui profesional",
      content: "La flexibilidad y transpirabilidad de los tejidos son perfectas para mi práctica diaria.",
      image: "/placeholder.svg?height=100&width=100"
    }
  ]

  return (
    <div style={{ backgroundColor: '#1a1a1a', color: '#f0f0f0' }}>
      {/* Pricing Section */}
      <section className="w-full py-12" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight" style={{ color: '#f0f0f0' }}>
            Nuestros Planes de Suscripción
          </h2>
          <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-1">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  index === 1 ? 'border-2 border-orange-500' : 'border border-gray-600'
                }`}
                style={{ backgroundColor: '#2a2a2a', borderColor: index === 1 ? '#ff6700' : '#3c3c3c' }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 flex items-center justify-center rounded-bl-xl" style={{ backgroundColor: '#333' }}>
                  <plan.icon className="w-8 h-8" style={{ color: '#f0f0f0' }} />
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: '#f0f0f0' }}>{plan.name}</h3>
                <p className="text-5xl font-bold mb-6" style={{ color: '#ff6700' }}>
                  ${plan.price}
                  <span className="text-xl" style={{ color: '#d1d1d1' }}>/mes</span>
                </p>
                <ul className="mb-8 space-y-2" style={{ color: '#d1d1d1' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: '#ff6700' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-auto py-3 px-6 font-semibold rounded-full text-lg hover:bg-orange-600 transition-all duration-300 focus:outline-none" style={{ backgroundColor: '#ff6700', color: '#fff' }}>
                  Suscribirse
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#f0f0f0' }}>Lo que Dicen Nuestros Atletas</h2>
          <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-1">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="p-6 rounded-lg shadow-md transform transition-all duration-500 hover:shadow-xl" style={{ backgroundColor: '#2a2a2a' }}>
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4"/>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#f0f0f0' }}>{testimonial.name}</h3>
                    <p className="text-orange-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic" style={{ color: '#d1d1d1' }}>"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1a1a1a', color: '#d1d1d1' }}>
        <div className="container px-4 py-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-1 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f0' }}>Sobre Nosotros</h3>
              <p className="mb-4">Somos una marca líder en ropa deportiva, comprometida con la calidad y la innovación para atletas de todos los niveles.</p>
              <div className="flex space-x-4">
                <a href="/" style={{ color: '#d1d1d1' }} className="hover:text-gray-200"><Facebook /></a>
                <a href="/" style={{ color: '#d1d1d1' }} className="hover:text-gray-200"><Twitter /></a>
                <a href="/" style={{ color: '#d1d1d1' }} className="hover:text-gray-200"><Instagram /></a>
                <a href="/" style={{ color: '#d1d1d1' }} className="hover:text-gray-200"><Youtube /></a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f0' }}>Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-orange-500">Inicio</a></li>
                <li><a href="/" className="hover:text-orange-500">Productos</a></li>
                <li><a href="/" className="hover:text-orange-500">Sobre Nosotros</a></li>
                <li><a href="/" className="hover:text-orange-500">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f0' }}>Soporte</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-orange-500">FAQ</a></li>
                <li><a href="/" className="hover:text-orange-500">Envíos</a></li>
                <li><a href="/" className="hover:text-orange-500">Devoluciones</a></li>
                <li><a href="/" className="hover:text-orange-500">Tallas</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#f0f0f0' }}>Boletín</h3>
              <p className="mb-4">Suscríbete para recibir las últimas noticias y ofertas exclusivas.</p>
              <form className="flex flex-col space-y-2">
                <input type="email" placeholder="Tu email" className="px-4 py-2 rounded" style={{ backgroundColor: '#333', color: '#f0f0f0' }} />
                <button type="submit" className="px-4 py-2 text-white rounded hover:bg-orange-600 transition-colors" style={{ backgroundColor: '#ff6700' }}>Suscribirse</button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2024 TuMarcaDeportiva. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SportsApparelMRP
