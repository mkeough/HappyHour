import React from 'react'

const AddPage = () => {
  return (
    <>
      <main className="add-page">
        <h1>Add Your Bar</h1>
        <h4>Name</h4>
        <input type="text" />
        <h4>Address</h4>
        <input type="text" />
        <h4>City</h4>
        <input type="text" />
        <h4>State (abbreviation)</h4>
        <input type="text" />
        <h4>Zip</h4>
        <input type="text" />
        <h4>Happy Hour Specials</h4>
        <textarea
          name=""
          id=""
          cols="70"
          rows="5"
          placeholder="Put Specials Here"
        ></textarea>
        <button>Add</button>
      </main>
    </>
  )
}

export default AddPage
