import React from 'react'
import { Router, Link, Route, Switch } from 'react-router-dom'

export function Home() {
  return (
    <>
      <main className="home-page">
        <section className="banner">
          <h1>Welcome To Happy Hour</h1>
          <h2>Find Your Happy Place</h2>
        </section>
        <button className="home-button">
          <Link to="/search">Enter</Link>
        </button>
      </main>
    </>
  )
}
