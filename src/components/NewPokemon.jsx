"use client"

import { NotebookTabs } from "lucide-react"
import { useNavigate } from "react-router-dom"

function NewPokemon({ newPokemon, theme }) {
  const navigate = useNavigate()

  if (!newPokemon) {
    return null
  }

  return (
    <div className="mt-2 sm:mt-3">
      <div
        className={`p-2 sm:p-3 rounded flex items-center justify-between ${
          theme === "light" ? "bg-blue-50" : "bg-gray-700"
        }`}
        key={newPokemon.id}
      >
        <div className="flex items-center flex-1 min-w-0">
          <h1
            className={`pokemon-name capitalize text-sm sm:text-base font-medium truncate mr-2 ${
              theme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
          >
            {newPokemon.name}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <img
            src={newPokemon.image || "/placeholder.svg"}
            alt={newPokemon.name}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
          />

          <div className="flex">
            {newPokemon.typesImages.map((typeImage) => (
              <img
                key={typeImage.type}
                src={typeImage.image || "/placeholder.svg"}
                alt={typeImage.type}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-contain"
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
              navigate(`/pokemon/${newPokemon.name}`, {
                state: {
                  pokemon: newPokemon,
                },
              })
            }}
          >
            <NotebookTabs size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewPokemon
