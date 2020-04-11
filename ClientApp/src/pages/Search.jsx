import React, { useState, useEffect, Component } from 'react'
import { Router, Link, Route, Switch } from 'react-router-dom'
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl'
import axios from 'axios'
import { usePosition } from 'use-position'

const Search = () => {
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(
    true,
    { enableHighAccuracy: true }
  )
  const [viewport, setViewport] = useState(
    {
      width: 800,
      height: 800,
      latitude: latitude,
      longitude: longitude,
      zoom: 13,
    }
    // userLocation()
  )

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
  // const [userLocation, setUserLocation] = useState({})

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
          {' '}
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          >
            <Marker>you are here</Marker>
          </GeolocateControl>
          {showPopup && (
            <Popup
              latitude={bar.latitude}
              longitude={bar.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup(false)}
              anchor="top"
              offsetTop={-5}
            >
              <div>
                <Link to={`/bar/${bar.id}`}>{bar.name}</Link>
              </div>
            </Popup>
          )}
          {markers.map(bars => {
            return (
              <Marker latitude={bars.latitude} longitude={bars.longitude}>
                <div onClick={() => markerClicked(bars)}>🍻</div>
              </Marker>
            )
          })}
        </ReactMapGL>
      </section>
    </div>
  )
}

export default Search
