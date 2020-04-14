import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import HelloWorld from './pages/_template/HelloWorld'
import HeyWorld from './pages/_template/HeyWorld'
import NotFound from './pages/NotFound'
import Search from './pages/Search'
import BarDetails from './pages/BarDetails'
import AddPage from './pages/AddPage'
import Login from './pages/Login'
import './custom.scss'
export default class App extends Component {
  static displayName = App.name

  render() {
    return (
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
          <Route
            exact
            path="/addpage"
            render={() => {
              if (localStorage.getItem('token')) {
                return <AddPage />
              } else {
                return <Redirect to="/login" />
              }
            }}
          />
          <Route exact path="/bar/:barid" component={BarDetails} />
          <Route exact path="/login" component={Login} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Layout>
    )
  }
}
