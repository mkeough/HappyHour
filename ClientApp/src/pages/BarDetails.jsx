import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const BarDetails = props => {
  console.log(props)
  const barId = props.match.params.barid
  const [bar, setBar] = useState({})

  const getBarData = async () => {
    const resp = await axios.get('/api/bar/' + barId)
    console.log(resp.data)
    setBar(resp.data)
  }
  useEffect(() => {
    getBarData()
  }, [])

  return (
    <>
      <section>
        <h1>{bar.name}</h1>
        <h3 className="bar-address">
          <p>{bar.address}</p>
          <p>{bar.city}</p>
          <p>{bar.state}</p>
          <p>{bar.zip}</p>
        </h3>
        <p>
          <Link>{bar.phoneNumber}</Link>
        </p>
        <p>{bar.specials}</p>
      </section>
    </>
  )
}

export default BarDetails
