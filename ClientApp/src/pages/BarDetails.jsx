import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import HappyHour from '../images/HappyHour.jpg'
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
      <body>
        <section className="details">
          <img src={HappyHour} alt="" />
          <h1>{bar.name}</h1>
          <h3 className="bar-address">
            <p>{bar.address}</p>
            <p>{bar.city}</p>
            <p>{bar.state}</p>
            <p>{bar.zip}</p>
          </h3>
          <h4>Phone Number:</h4>
          <p>
            <Link>{bar.phoneNumber}</Link>
          </p>
          <section className="specials">
            <h4>Happy Hour specials</h4>
            <p>{bar.specials}</p>
          </section>
        </section>
      </body>
    </>
  )
}

export default BarDetails
