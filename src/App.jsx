"use client"

import "./App.css"
import { useState, useEffect } from "react"
import { gsap } from "gsap"
import PokeForm from "./components/pokeForm"
import PokeReturn from "./components/PokeReturn"
import NewPokemon from "./components/NewPokemon"

function App() {
  const [dataPokemon, setDataPokemon] = useState([])
  const [newPokemon, setNewPokemon] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  const fetchPokemonDetails = async (url) => {
    const response = await fetch(url)
    const data = await response.json()

    const pokemonImage = data.sprites.front_default

    const typesImages = await Promise.all(
      data.types.map(async (typeInfo) => {
        const typeName = typeInfo.type.name
        const typeResponse = await fetch(
          `https://pokeapi.co/api/v2/type/${typeName}/`
        )
        const typeData = await typeResponse.json()
        const typeImage = typeData.sprites["generation-vi"]["x-y"]["name_icon"]
        return { type: typeName, image: typeImage }
      })
    )

    const pokemon = {
      id: data.id,
      name: data.name,
      image: pokemonImage,
      typesImages: typesImages,
      speciesUrl: data.species.url,
    }
    return pokemon
  }

  useEffect(() => {
    const formInput = document.querySelector(".form-input")
    const btnForm = document.querySelector(".form-search")

    const getPokemonData = async (pokemon) => {
      const apiURL = `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      const response = await fetch(apiURL)

      if (!response.ok) {
        throw new Error(`Pokémon não encontrado: ${pokemon}`)
      }

      const data = await response.json()
      return data
    }

    const initialList = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/")

        if (!response.ok) {
          throw new Error("Falha ao carregar a lista de pokémons")
        }

        const data = await response.json()

        const pokemonsList = await Promise.all(
          data.results.map(async (pokemon) => {
            const details = await fetchPokemonDetails(pokemon.url)
            return details
          })
        )
        setDataPokemon(pokemonsList)
      } catch (error) {
        console.error("Erro ao carregar pokémons:", error)
        setError("Erro ao carregar a lista de pokémons. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    initialList()

    const verifyPokemon = async (pokemon) => {
      const pokemonNames = document.querySelectorAll(".pokemon-name")
      pokemonNames.forEach((e) => {
        const parentDiv = e.parentElement
        if (pokemon === "") {
          parentDiv.classList.remove("hide")
        } else if (e.innerText.toLowerCase() !== pokemon.toLowerCase()) {
          parentDiv.classList.add("hide")
        } else {
          parentDiv.classList.remove("hide")
        }
      })
    }

    const showPokemon = async (pokemonName) => {
      if (!pokemonName.trim()) {
        setNewPokemon(null)
        setError(null)
        return
      }

      try {
        setError(null)
        const data = await getPokemonData(pokemonName)

        const newPokemonName = data.name
        const newPokemonImage = data.sprites.front_default
        const newTypesImages = await Promise.all(
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

        const newPokemon = {
          id: data.id,
          name: newPokemonName,
          image: newPokemonImage,
          typesImages: newTypesImages,
          speciesUrl: data.species.url,
        }
        setNewPokemon(newPokemon)
      } catch (error) {
        console.error("Erro ao buscar pokémon:", error)
        setError(
          `Pokémon "${pokemonName}" não encontrado. Verifique o nome e tente novamente.`
        )
        setNewPokemon(null)
      }
    }

    if (btnForm && formInput) {
      btnForm.addEventListener("click", (event) => {
        event.preventDefault()
        const pokemon = formInput.value
        verifyPokemon(pokemon)
        showPokemon(pokemon)
      })

      formInput.addEventListener("keyup", () => {
        const pokemon = formInput.value
        verifyPokemon(pokemon)
        showPokemon(pokemon)
      })
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const isMobile = window.innerWidth < 640

      gsap.to(".pokeBolaCima", {
        y: isMobile ? "-15vh" : "-42vh",
        duration: 3,
      })
      gsap.to(".pokeBolaBaixo", {
        y: isMobile ? "15vh" : "45vh",
        duration: 3,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
          className={`w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg relative ${
            theme === "light" ? "bg-red-400" : "bg-gray-800"
          }`}
        >
          <div className="text-center mb-3 sm:mb-4 md:mb-6">
            <h1 className="tittle text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Pokedex!
            </h1>
          </div>

          <PokeForm theme={theme} setTheme={setTheme} />
          <PokeReturn pokemonData={dataPokemon} theme={theme} />
          <NewPokemon newPokemon={newPokemon} theme={theme} />

          {error && (
            <div className="error-message bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mt-3 sm:mt-4 text-xs sm:text-sm">
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="loading-message bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 sm:px-4 sm:py-3 rounded mt-3 sm:mt-4 text-xs sm:text-sm">
              <p>Carregando pokémons...</p>
            </div>
          )}

          <div className="pokeBola">
            <div className="pokeBolaCima"></div>
            <div className="pokeBolaBaixo"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
