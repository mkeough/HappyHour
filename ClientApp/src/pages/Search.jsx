import React, { useState, useEffect, Component } from 'react'
import { Router, Link, Route, Switch } from 'react-router-dom'
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl'
import axios from 'axios'
import { usePosition } from 'use-position'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons'

const Search = () => {
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(
    true,
    { enableHighAccuracy: true }
  )
  const [viewport, setViewport] = useState({
    latitude: latitude,
    longitude: longitude,
    zoom: 12,
    interactive: true,
  })

  useEffect(() => {
    setViewport(prev => {
      return {
        ...prev,
        latitude: latitude,
        longitude: longitude,
      }
    })
  }, [latitude, longitude])

  const [showPopup, setShowPopup] = useState(false)
  const [bar, setBar] = useState({})
  const [markers, setMarkers] = useState([])

  const loadAllBars = async () => {
    const resp = await axios.get('api/bar')
    setMarkers(resp.data)
  }

  useEffect(() => {
    loadAllBars()
  }, [])

  const markerClicked = bars => {
    console.log('marker clicked', bars)
    setBar(bars)
    setShowPopup(true)
  }
  const [searchCity, setSearchCity] = useState('')

  const userSearch = async () => {
    const resp = await axios.get(`api/search/city/${searchCity}`)
    console.log(resp.data)
    const result = resp.data
    setViewport({ ...viewport, latitude: result.lat, longitude: result.lng })
  }

  return (
    <div className="search-page">
      <main>
        <h2 className="search-header">Find Happy Hour Specials Near You</h2>
        <h3>
          Click the <FontAwesomeIcon icon={faCrosshairs} /> icon below to see
          your current location{' '}
        </h3>

        <h3> Or Search by City</h3>
        <input
          className="search"
          type="text"
          value={searchCity}
          onChange={e => setSearchCity(e.target.value)}
        />
        <button className="search-button" onClick={userSearch}>
          Search
        </button>

        <section className="map-container">
          <ReactMapGL
            className="map"
            height="50vh"
            width="100vw"
            {...viewport}
            onViewportChange={setViewport}
            mapboxApiAccessToken={
              'pk.eyJ1Ijoia2VvdWdobSIsImEiOiJjazhwNDQ4ZTAwMHdjM21wMWpmcmx6Znl5In0.8teYNnKkLBfla2ZsBUMEFQ'
            }
          >
            {' '}
            <GeolocateControl
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
            ></GeolocateControl>
            {showPopup && (
              <Popup
                latitude={bar.latitude}
                longitude={bar.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup(false)}
                anchor="top"
                offsetTop={20}
                offsetLeft={10}
              >
                <div>
                  <Link to={`/bar/${bar.id}`}>{bar.name}</Link>
                </div>
              </Popup>
            )}
            {markers.map(bars => {
              return (
                <Marker
                  key={bars.id}
                  latitude={bars.latitude}
                  longitude={bars.longitude}
                >
                  <div onClick={() => markerClicked(bars)}>🍻</div>
                </Marker>
              )
            })}
          </ReactMapGL>
        </section>

        <section>
          <h3 className="cant-find-your-bar">
            Do you own a bar and dont see it on the map?
          </h3>
          <button>
            <Link to="/addpage">Add it here</Link>
          </button>
        </section>
      </main>
    </div>
  )
}

export default Search
