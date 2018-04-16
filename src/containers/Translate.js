import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
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
            id: "0",
            translations: { id: "0" },
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect,
            },
        };
    }

    componentWillMount = () => {
        const url = "http://0.0.0.0:9000/api/translations?sort=-createdAt&limit=1";

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        fetch(url, { method: "GET", headers: headers })
            .then(res => res.json())
            .then(data => this.setState({ translations: data.rows[0].translations, id: data.rows[0].id }))
            .catch(err => this.setState({ overlay: "overlay on" }));
    }

    submit = (e) => {
        e.preventDefault();
        const { user } = this.props;
        const { translations } = this.state;
        const url = "http://0.0.0.0:9000/api/translations";
        for (const ref in this.refs) {
            const props = ref.split(";");
            translations[props[0]][props[1]][props[2]] = this.refs[ref].value;
        }
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                access_token: user.access_token,
                translations,
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
                this.setState({ redirect: "/" });
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" });
            });
    }
    render = () => {
        const { translations, id } = this.state;
        const Items = [];
        if (translations) {
            for (const group in translations) {
                Items.push(<tr key={group}><th colSpan="4"><h2>{group + " group"}</h2></th></tr>);
                if (group !== "faq") {
                    for (const prop in translations[group].fr) {
                        const translation = translations[group];
                        const len = translation["en"][prop].length;
                        Items.push(
                            <tr key={group + prop}>
                                <td >
                                    <h3>{prop}</h3>
                                </td>
                                <td height={len < 30 ? "50px" : "300px"} >
                                    {len < 30 ?
                                        <input type="text" ref={group + ";fr;" + prop} id={prop} defaultValue={translation["fr"][prop]} />
                                        :
                                        <textarea ref={group + ";fr;" + prop} id={prop} defaultValue={translation["fr"][prop]} rows="10" />
                                    }
                                </td>
                                <td height={len < 30 ? "50px" : "300px"} >
                                    {len < 30 ?
                                        <input type="text" ref={group + ";nl;" + prop} id={prop} defaultValue={translation["nl"][prop]} />
                                        :
                                        <textarea ref={group + ";nl;" + prop} id={prop} defaultValue={translation["nl"][prop]} rows="10" />
                                    }
                                </td>
                                <td height={len < 30 ? "50px" : "300px"} >
                                    {len < 30 ?
                                        <input type="text" ref={group + ";en;" + prop} id={prop} defaultValue={translation["en"][prop]} />
                                        :
                                        <textarea ref={group + ";en;" + prop} id={prop} defaultValue={translation["en"][prop]} rows="10" />
                                    }
                                </td>
                            </tr>);
                    }
                }
            }
        }
        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <form onSubmit={this.submit} id="form2" className="form-container" key={id}>
                        <table>
                            <thead>
                                <tr>
                                    <th width='25%'  >
                                        <h3>propName</h3>
                                    </th>
                                    <th width='25%'  >
                                        <h3>French</h3>
                                    </th>
                                    <th width='25%'  >
                                        <h3>Dutch/Flemish</h3>
                                    </th>
                                    <th width='25%'  >
                                        <h3>English</h3>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Items || "Loading..."}
                            </tbody>
                        </table>
                        <div className="input-div" >
                            <button id="submit" type="submit" className="btn btn-orange">Submit</button>
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