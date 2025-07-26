"use client"

import { Search, Moon, Sun } from "lucide-react"

function PokeForm({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <div className="mb-3 sm:mb-4">
      <h3
        className={`mb-2 sm:mb-3 font-bold text-sm sm:text-base md:text-lg ${
          theme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
      >
        Pesquise um pokemon:
      </h3>

      <div className="flex items-center gap-2">
        <input
          className={`form-input flex-1 p-2 sm:p-3 border-none rounded text-sm sm:text-base ${
            theme === "light"
              ? "bg-blue-50 text-gray-800 placeholder-gray-500"
              : "bg-gray-700 text-gray-200 placeholder-gray-400"
          }`}
          type="text"
          placeholder="Digite o nome do pokemon"
        />

        <button
          type="button"
          className={`form-search p-2 sm:p-3 border-none rounded min-w-[40px] cursor-pointer flex items-center justify-center ${
            theme === "light"
              ? "bg-blue-800 text-yellow-400 hover:bg-blue-700"
              : "bg-gray-600 text-gray-200 hover:bg-gray-500"
          }`}
        >
          <Search size={16} className="sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          className={`p-2 sm:p-3 border-none rounded min-w-[40px] cursor-pointer flex items-center justify-center ${
            theme === "light"
              ? "bg-blue-800 text-yellow-400 hover:bg-blue-700"
              : "bg-gray-600 text-gray-200 hover:bg-gray-500"
          }`}
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon size={16} className="sm:w-5 sm:h-5" />
          ) : (
            <Sun size={16} className="sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  )
}

export default PokeForm
