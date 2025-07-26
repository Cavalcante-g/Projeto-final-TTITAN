import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import PokemonPage from "./pages/PokemonPage.jsx"
import './App.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/pokemon/:pokemonName",
    element: <PokemonPage />,
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
