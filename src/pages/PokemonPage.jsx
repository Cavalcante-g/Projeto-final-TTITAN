"use client"

import { useLocation, useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Undo2 } from "lucide-react"

function PokemonPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [evolutionChain, setEvolutionChain] = useState([])
  const [evolutionChainPicture, setEvolutionChainPicture] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEvolutions, setShowEvolutions] = useState([])
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  const pokemonFromState = location.state?.pokemon
  const pokemonName = pokemonFromState?.name || params.pokemonName

  const fetchPokemonData = async (name) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

      if (!response.ok) {
        throw new Error(`Pokémon "${name}" não encontrado`)
      }

      const data = await response.json()

      const typesImages = await Promise.all(
        data.types.map(async (typeInfo) => {
          const typeName = typeInfo.type.name
          const typeResponse = await fetch(
            `https://pokeapi.co/api/v2/type/${typeName}/`
          )
          const typeData = await typeResponse.json()
          const typeImage =
            typeData.sprites["generation-vi"]["x-y"]["name_icon"]
          return { type: typeName, image: typeImage }
        })
      )

      const speciesUrl = data.species.url
      const speciesResponse = await fetch(speciesUrl)
      const speciesData = await speciesResponse.json()
      const flavorTextEntries = speciesData.flavor_text_entries
      let description = ""
      const englishEntry = flavorTextEntries.find(
        (entry) => entry.language.name === "en"
      )
      if (englishEntry) {
        description = englishEntry.flavor_text
      }

      return {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
        typesImages: typesImages,
        description: description || "Descrição não disponível",
      }
    } catch (error) {
      console.error("Erro ao buscar pokemon:", error)
      throw error
    }
  }

  const getEvolutionChainPictures = async (evolutions) => {
    const evolutionsPictures = []
    for (const evolution of evolutions) {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${evolution}`
        )
        const data = await response.json()
        evolutionsPictures.push(data.sprites.front_default)
      } catch (error) {
        console.error(`Erro ao buscar imagem de ${evolution}:`, error)
        evolutionsPictures.push(null)
      }
    }
    setEvolutionChainPicture(evolutionsPictures)
  }

  const fetchEvolutionChain = async (pokemonName) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      )
      const data = await response.json()

      const speciesUrl = data.species.url
      const speciesResponse = await fetch(speciesUrl)
      const speciesData = await speciesResponse.json()

      const evolutionChainUrl = speciesData.evolution_chain.url
      const evolutionChainResponse = await fetch(evolutionChainUrl)
      const evolutionChainData = await evolutionChainResponse.json()

      const evolutionDetails = evolutionChainData.chain

      const evolutions = []
      let current = evolutionDetails

      while (current) {
        evolutions.push(current.species.name)
        current = current.evolves_to[0]
      }

      setEvolutionChain(evolutions)
      await getEvolutionChainPictures(evolutions)
    } catch (error) {
      console.error("Erro ao buscar cadeia evolutiva:", error)
    }
  }

  const animateEvolutions = () => {
    setShowEvolutions([])
    evolutionChain.forEach((_, index) => {
      setTimeout(() => {
        setShowEvolutions((prev) => [...prev, index])
      }, index * 500)
    })
  }

  useEffect(() => {
    const loadPokemonData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (pokemonName) {
          const pokemonData = await fetchPokemonData(pokemonName)
          if (pokemonData) {
            setPokemon(pokemonData)
            await fetchEvolutionChain(pokemonName)
          }
        }
      } catch (error) {
        setError(error.message || "Erro ao carregar dados do pokémon")
      } finally {
        setLoading(false)
      }
    }

    loadPokemonData()
  }, [pokemonName])

  useEffect(() => {
    if (evolutionChain.length > 0 && evolutionChainPicture.length > 0) {
      animateEvolutions()
    }
  }, [evolutionChain, evolutionChainPicture])

  if (loading) {
    return (
      <div
        className={`min-h-screen p-2 sm:p-4 md:p-8 ${
          theme === "light"
            ? "bg-gradient-to-b from-purple-500 to-purple-300"
            : "bg-gray-900"
        }`}
      >
        <div className="flex justify-center items-center min-h-screen">
          <div
            className={`w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg ${
              theme === "light" ? "bg-red-400" : "bg-gray-800"
            }`}
          >
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 border-b-2 border-blue-500"></div>
              <span
                className={`ml-3 text-xs sm:text-sm md:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Carregando...
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-2 sm:p-4 md:p-8 ${
          theme === "light"
            ? "bg-gradient-to-b from-purple-500 to-purple-300"
            : "bg-gray-900"
        }`}
      >
        <div className="flex justify-center items-center min-h-screen">
          <div
            className={`w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg ${
              theme === "light" ? "bg-red-400" : "bg-gray-800"
            }`}
          >
            <button
              className={`mb-4 p-2 rounded flex items-center ${
                theme === "light"
                  ? "bg-blue-800 text-yellow-400"
                  : "bg-gray-600 text-gray-200"
              }`}
              onClick={() => navigate(`/`)}
            >
              <Undo2 size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
              <span className="text-xs sm:text-sm">Voltar</span>
            </button>
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-xs sm:text-sm">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div
        className={`min-h-screen p-2 sm:p-4 md:p-8 ${
          theme === "light"
            ? "bg-gradient-to-b from-purple-500 to-purple-300"
            : "bg-gray-900"
        }`}
      >
        <div className="flex justify-center items-center min-h-screen">
          <div
            className={`w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg ${
              theme === "light" ? "bg-red-400" : "bg-gray-800"
            }`}
          >
            <button
              className={`mb-4 p-2 rounded flex items-center ${
                theme === "light"
                  ? "bg-blue-800 text-yellow-400"
                  : "bg-gray-600 text-gray-200"
              }`}
              onClick={() => navigate(`/`)}
            >
              <Undo2 size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
              <span className="text-xs sm:text-sm">Voltar</span>
            </button>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-xs sm:text-sm">
              <p>Pokémon não encontrado!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-2 sm:p-4 md:p-8 ${
        theme === "light"
          ? "bg-gradient-to-b from-purple-500 to-purple-300"
          : "bg-gray-900"
      }`}
    >
      <div className="flex justify-center items-start min-h-screen">
        <div
          className={`w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg ${
            theme === "light" ? "bg-red-400" : "bg-gray-800"
          }`}
        >
          <button
            className={`mb-3 sm:mb-4 p-2 rounded flex items-center ${
              theme === "light"
                ? "bg-blue-800 text-yellow-400 hover:bg-blue-700"
                : "bg-gray-600 text-gray-200 hover:bg-gray-500"
            }`}
            onClick={() => navigate(`/`)}
          >
            <Undo2 size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
            <span className="text-xs sm:text-sm">Voltar</span>
          </button>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-4 sm:mb-6">
            <div className="flex flex-col justify-center items-center">
              <h3
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 capitalize ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                {pokemon.name}
              </h3>
              <img
                src={pokemon.image || "/placeholder.svg"}
                alt={pokemon.name}
                className="mb-2 sm:mb-3 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
              />

              <div className="flex justify-center gap-1 mb-3 sm:mb-4">
                {pokemon.typesImages.map((typeImage) => (
                  <img
                    key={typeImage.type}
                    src={typeImage.image || "/placeholder.svg"}
                    alt={typeImage.type}
                    className="h-4 w-auto sm:h-5 md:h-6 object-contain"
                  />
                ))}
              </div>
            </div>

            <textarea
              className={`w-full h-24 sm:h-32 md:h-40 p-2 sm:p-3 rounded resize-none text-xs sm:text-sm md:text-base ${
                theme === "light"
                  ? "bg-blue-50 text-gray-800"
                  : "bg-gray-700 text-gray-200"
              }`}
              defaultValue={pokemon.description}
              readOnly
            />
          </div>

          <h2
            className={`font-bold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg ${
              theme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
          >
            Cadeia Evolutiva:
          </h2>

          <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 p-2 overflow-x-auto">
            {evolutionChain.map((evolution, index) => {
              const isVisible = showEvolutions.includes(index)
              return (
                <div
                  key={index}
                  className={`flex flex-col justify-center items-center transition-all duration-500 transform hover:scale-110 flex-shrink-0 ${
                    isVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-4 scale-95"
                  }`}
                >
                  <h1
                    className={`capitalize font-semibold mb-1 sm:mb-2 text-xs sm:text-sm md:text-base text-center ${
                      theme === "light" ? "text-gray-800" : "text-gray-200"
                    }`}
                  >
                    {evolution}
                  </h1>
                  {evolutionChainPicture[index] && (
                    <img
                      src={evolutionChainPicture[index] || "/placeholder.svg"}
                      alt={evolution}
                      className="transition-transform duration-300 hover:scale-110 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonPage
