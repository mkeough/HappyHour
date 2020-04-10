import React, { useState } from 'react'
import { Router, Link, Route, Switch } from 'react-router-dom'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'

const Search = () => {
  const data = [
    { latitude: 27.7843, longitude: -82.3389, text: 'A' },
    { latitude: 27.4743, longitude: -82.8389, text: 'B' },
    { latitude: 27.5743, longitude: -82.7389, text: 'C' },
  ]
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 27.7743,
    longitude: -82.6389,
    zoom: 8,
  })
  const [showPopup, setShowPopup] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState({})

  const markerClicked = place => {
    console.log('marker clicked', place)
    setSelectedPlace(place)
    setShowPopup(true)
  }

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
      <button onClick={() => setShowPopup(true)}>show popup</button>
      <section className="map-container">
        <ReactMapGL
          {...viewport}
          onViewportChange={setViewport}
          mapboxApiAccessToken={
            'pk.eyJ1Ijoia2VvdWdobSIsImEiOiJjazhwNDQ4ZTAwMHdjM21wMWpmcmx6Znl5In0.8teYNnKkLBfla2ZsBUMEFQ'
          }
        >
          {showPopup && (
            <Popup
              latitude={selectedPlace.latitude}
              longitude={selectedPlace.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup(false)}
              anchor="top"
              offsetTop={-5}
            >
              <div>
                <Link to="/resultspage">{selectedPlace.text}</Link>
              </div>
            </Popup>
          )}
          <Marker
            latitude={27.7743}
            longitude={-82.6389}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div>🍻</div>
          </Marker>
          {data.map(place => {
            return (
              <Marker latitude={place.latitude} longitude={place.longitude}>
                <div onClick={() => markerClicked(place)}>{place.text}</div>
              </Marker>
            )
          })}
        </ReactMapGL>
      </section>
    </div>
  )
}

export default Search
