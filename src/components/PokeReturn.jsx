"use client"

import { NotebookTabs } from "lucide-react"
import { useNavigate } from "react-router-dom"

function PokeReturn({ pokemonData, theme }) {
  const limitedPokemonData = pokemonData.slice(0, 7)
  const navigate = useNavigate()

  return (
    <div className="space-y-1 sm:space-y-2">
      {limitedPokemonData.map((pokemon) => (
        <div
          key={pokemon.id}
          className={`p-2 sm:p-3 rounded flex items-center justify-between ${
            theme === "light" ? "bg-blue-50" : "bg-gray-700"
          }`}
        >
          <div className="flex items-center flex-1 min-w-0">
            <h1
              className={`pokemon-name capitalize text-sm sm:text-base font-medium truncate mr-2 ${
                theme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              {pokemon.name}
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <img
              src={pokemon.image || "/placeholder.svg"}
              alt={pokemon.name}
              className="w-8 h-8 sm:w-8 sm:h-8 md:w-12 md:h-12 object-contain"
            />

            <div className="flex">
              {pokemon.typesImages.map((typeImage) => (
                <img
                  key={typeImage.type}
                  src={typeImage.image || "/placeholder.svg"}
                  alt={typeImage.type}
                  className="w-8 h-8 sm:w-10 sm:10-8 md:w-11 md:h-6 object-contain"
                />
              ))}
            </div>

            <button
              className={`flex justify-center items-center p-1 sm:p-1.5 md:p-2 rounded cursor-pointer ${
                theme === "light"
                  ? "text-blue-800 hover:bg-blue-100"
                  : "text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => {
                navigate(`/pokemon/${pokemon.name}`, {
                  state: {
                    pokemon: pokemon,
                  },
                })
              }}
            >
              <NotebookTabs size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PokeReturn
