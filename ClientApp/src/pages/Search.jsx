import React from 'react'
import { Router, Link, Route, Switch } from 'react-router-dom'

const Search = () => {
  return (
    <div className="search-page">
      <h1 className="search-header">Find Happy Hour Specials</h1>
      <h3>Enter Distance You Would Like to Search</h3>
      <p>(miles)</p>
      <input type="search" />
      <p>
        <button>
          <Link to="/resultspage">Search</Link>
        </button>
      </p>
    </div>
  )
}

export default Search
