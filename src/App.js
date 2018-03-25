import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Footer, NotFound } from './components';
import { Login, Dashboard, Browse, VerifyKitchen, Translate } from './containers';
import './styles/App.css';

const ScrollToTop = () => {
  if (window.location.href.indexOf("#") === -1) {
    window.scrollTo(0, 0);
  }
  return null;
}

class App extends Component {

  render = () => {
    const { user } = this.props
    return (
      <Router>
        <div className="App text-center">
          <Header />
          <main>
            <div id="header_spacing"></div>
            <Route component={ScrollToTop} />
            {!user.id ?
              <Switch>
                <Route component={Login} />
              </Switch >
              :
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/admin" component={Dashboard} />
                <Route exact path="/admin/translate" component={Translate} />
                <Route exact path="/admin/verify/kitchens" component={Browse} />
                <Route exact path="/admin/verify/kitchens/:id" component={VerifyKitchen} />
                <Route component={NotFound} />
              </Switch >
            }
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

App = connect(
  mapStateToProps,
  null
)(App)


export default App;
