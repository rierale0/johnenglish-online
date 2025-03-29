import React from 'react'
import Image from 'next/image'

export default function Header() {
  return (
    <nav className="flex justify-between items-center px-8 md:px-12 lg:px-16 py-6">
      <a href="/" className="text-m text-white font-regular flex items-center">🍎 English with John</a>
      
      <div className="flex items-center gap-4">
        {/* <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors">
          Iniciar sesión
        </button> */}
        
        <div className="relative w-10 h-10 md:w-8 md:h-8 rounded-full overflow-hidden cursor-pointer">
        </div>
      </div>
    </nav>
  )
}
