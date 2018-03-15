import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../logo.jpg';
import '../styles/header.css';

const toggleMenu = () => {
    const collapse = document.getElementsByClassName('navbar-collapse')[0]
    collapse.classList.toggle('collapse');
    collapse.classList.toggle('in');
}

class Header extends Component {

    render = () => {
        return (
            <header>
                <nav className="navbar navbar-default navbar-fixed-top" id="home">
                    <div className="container-fluid">
                        <div className="navbar-header navbar-logo">
                            <button onClick={toggleMenu} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a href="/">
                                <img className="logo" src={logo} alt="logo" />
                            </a>
                        </div>

                        <div className="collapse navbar-collapse">
                            {!this.props.user.id ?
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <Link to="/" onClick={toggleMenu} >
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                Admin Login
                                        </button>
                                        </Link>
                                    </li>
                                </ul>
                                :
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <Link to="/admin" onClick={toggleMenu}>
                                            <button className="btn navbar-btn nav-link nav-link-grey">
                                                Admin Dashboard
                                        </button>
                                        </Link>
                                    </li>
                                </ul>
                            }
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        kitchen: state.kitchen
    }
}

Header = connect(
    mapStateToProps,
    null
)(Header)

export default Header;