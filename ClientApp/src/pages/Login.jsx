import React, { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router'

const Login = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const sendNewUserToApi = async () => {
    // add extra validation logic here
    const resp = await axios.post('/auth/signup', {
      fullName: fullName,
      email: email,
      password: password,
    })
    console.log(resp.data)
    if (resp.status === 200) {
      //store the token in session or local storage
      localStorage.setItem('token', resp.data.token)
      setShouldRedirect(true)
    }
  }
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const logUserIntoApi = async () => {
    const resp = await axios.post('/auth/login', {
      email: loginEmail,
      password: loginPassword,
    })
    console.log(resp.data)
    if (resp.status === 200) {
      localStorage.setItem('token', resp.data)
      setShouldRedirect(true)
    }
  }
  if (shouldRedirect) {
    return <Redirect to="/search" />
  }
  return (
    <>
      <section className="login">
        <h3>Login</h3>
        <p>Email</p>
        <input
          type="text"
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
        />
        <p>Password</p>
        <input
          type="text"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
        />
        <p>
          <button onClick={logUserIntoApi}>Login</button>
        </p>
      </section>
      <section className="sign-up">
        <h3>Sign Up</h3>
        <p>Full Name</p>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <p>Email</p>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <p>Password</p>
        <input
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <p>
          <button onClick={sendNewUserToApi}>Sign Up</button>
        </p>
      </section>
    </>
  )
}

export default Login
