import React, { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router'

const AddPage = () => {
  const [bar, setBar] = useState({})
  const [successfullyAdded, setSuccessfullyAdded] = useState({
    shouldRedirect: false,
    newBarInfo: {},
  })
  const updateBarData = e => {
    const key = e.target.name
    const value = e.target.value
    setBar(prevBar => {
      prevBar[key] = value
      return prevBar
    })
  }
  const addBarToApi = async () => {
    console.log('adding bar', bar)
    const resp = await axios.post('api/bar', bar)
    if (resp.status === 201) {
      setSuccessfullyAdded({ shouldRedirect: true, newBarInfo: resp.data })
    } else {
      return console.log('error')
    }
  }
  if (successfullyAdded.shouldRedirect) {
    return (
      <Redirect
        to={{
          pathname: `/bar/${successfullyAdded.newBarInfo.id}`,
          state: { bar: successfullyAdded.newBarInfo },
        }}
      />
    )
  } else {
    return (
      <>
        <main className="add-page">
          <h1>Add Your Bar</h1>
          <h4>Name</h4>
          <input type="text" name="name" onChange={updateBarData} />
          <h4>Address</h4>
          <input type="text" name="address" onChange={updateBarData} />
          <h4>City</h4>
          <input type="text" name="city" onChange={updateBarData} />
          <h4>State (abbreviation)</h4>
          <input type="text" name="state" onChange={updateBarData} />
          <h4>Zip</h4>
          <input type="text" name="zip" onChange={updateBarData} />
          <h4>Phone Number</h4>
          <input type="text" name="phoneNumber" onChange={updateBarData} />
          <h4>Happy Hour Specials</h4>
          <textarea
            name=""
            id=""
            cols="50"
            rows="5"
            placeholder="Put Specials Here"
            name="specials"
            onChange={updateBarData}
          ></textarea>
          <p>
            <button onClick={addBarToApi}>Add</button>
          </p>
        </main>
      </>
    )
  }
}

export default AddPage
