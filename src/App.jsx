import React, { useEffect, useState } from 'react'
import {
  createHashRouter,
  RouterProvider,
  Link,
  Outlet,
  useParams,
  useNavigate
} from 'react-router-dom'

function Layout() {
  return (
      <div className="container">
        <nav className="nav">
          <Link to="/">Pokédex</Link>
          <Link to="/about">About</Link>
        </nav>
        <Outlet />
      </div>
  )
}

function Home() {
  const [pokemon, setPokemon] = useState([])
  const [page, setPage] = useState(0)

  const limit = 12

  useEffect(() => {
    fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${
            page * limit
        }`
    )
        .then((res) => res.json())
        .then((data) => setPokemon(data.results))
  }, [page])

  return (
      <>
        <h1>Pokédex</h1>

        <div className="grid">
          {pokemon.map((poke) => {
            const id = poke.url.split('/').filter(Boolean).pop()

            return (
                <Link key={poke.name} to={`/pokemon/${id}`} className="card">
                  <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  />
                  <h3>{poke.name}</h3>
                  <p>#{id}</p>
                </Link>
            )
          })}
        </div>

        <div className="buttons">
          <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
          >
            Previous
          </button>

          <button onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </>
  )
}

function Details() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((res) => res.json())
        .then((data) => setPokemon(data))
  }, [id])

  if (!pokemon) return <h2>Loading...</h2>

  return (
      <div className="detail">
        <button onClick={() => navigate(-1)}>Back</button>

        <h1>{pokemon.name}</h1>

        <img src={pokemon.sprites.front_default} />

        <p>Height: {pokemon.height}</p>
        <p>Weight: {pokemon.weight}</p>

        <p>
          Types:{' '}
          {pokemon.types.map((t) => t.type.name).join(', ')}
        </p>

        <p>
          Abilities:{' '}
          {pokemon.abilities
              .map((a) => a.ability.name)
              .join(', ')}
        </p>

        <h3>Stats</h3>

        {pokemon.stats.map((stat) => (
            <p key={stat.stat.name}>
              {stat.stat.name}: {stat.base_stat}
            </p>
        ))}
      </div>
  )
}

function About() {
  return (
      <>
        <h1>About</h1>
        <p>
          This Pokédex was built using React, Vite and PokéAPI.
        </p>
      </>
  )
}

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'pokemon/:id', element: <Details /> }
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}