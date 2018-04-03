import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import base64 from "base-64";
import { Popup } from "../components";
import { updateUser } from "../actions";
import "../styles/forms.css";

var errorMessageConnect = "There has been an error connecting to the server. Please try again later.";
var errorMessageNotFound = "E-mail or password not found.";
var errorMessageUnauthorized = "Unauthorized access.";

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect,
            },
        };
    }

    submit = (e) => {
        e.preventDefault();
        const { updateUser } = this.props;
        const url = "http://0.0.0.0:9000/api/auth";
        const username = this.refs.email.value;
        const password = this.refs.password.value;

        const headers = new Headers();
        headers.append("Authorization", "Basic " + base64.encode(username + ":" + password));
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                role: "admin",
            }),
        })
            .then(response => {
                switch (response.status) {
                    case 401:
                        this.setState({ popup: { message: errorMessageUnauthorized } });
                        throw new Error(errorMessageNotFound);
                    case 400:
                        this.setState({ popup: { message: errorMessageNotFound } });
                        throw new Error(errorMessageNotFound);
                    case 201:
                        return response.json();
                    default:
                        this.setState({ popup: { message: errorMessageConnect } });
                        throw new Error(errorMessageConnect);
                }
            })
            .then(data => {
                data.user.access_token = data.token;
                updateUser(data.user);
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" });
            });
    }
    render = () => {
        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <form onSubmit={this.submit} id="form2" className="form-container">
                        <div className="input-div" >
                            <label htmlFor="email">Email</label>
                            <input type="email" ref="email" id="email" />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="password">Password</label>
                            <input type="password" ref="password" id="password" />
                        </div>
                        <div className="input-div" >
                            <button id="submit" type="submit" className="btn btn-orange">Login</button>
                        </div>
                    </form>
                    )}
                    <Popup overlay={this.state.overlay} title="Error"
                        message={this.state.popup.message} btn="ok" close={this.closePopup} />
                </div>

        );
    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => {
            dispatch(updateUser(user));
        },
    };
};

Form = connect(
    mapStateToProps,
    mapDispatchToProps
)(Form);

export default Form;