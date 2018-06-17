import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Popup } from "../components";
import "../styles/browse.css";

var errorMessageConnect = "There has been an error connecting to the server. Please try again later.";

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kitchens: [],
            count: -1,
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect,
            },
        };
    }
    componentWillMount = () => {
        const verified = this.props.match.url === "/admin/edit/kitchens";
        const url = `http://0.0.0.0:9000/api/kitchens?verified=${verified}`;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        fetch(url, {
            method: "GET",
            headers: headers,
        })
            .then(response => {
                this.setState({ status: response.status });
                return response.json();
            })
            .then(data => {
                this.setState({ kitchens: data.rows, count: data.count });
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" });
            });
    }

    render = () => {
        const verified = this.props.match.url === "/admin/edit/kitchens";
        const { kitchens, count } = this.state;
        const listings = [];
        for (const kitchen of kitchens) {
            listings.push(
                <div className="thumb-listing-container" key={kitchen.id}>
                    <div className="inline-flex" >
                        <div className="listing-info">
                            <Link to={verified ? `/admin/edit/kitchens/${kitchen.id}` : `/admin/verify/kitchens/${kitchen.id}`}>
                                <img src={kitchen.images.length !== 0 ? kitchen.images[0].thumbnail : "/static/media/no-image.jpg"}
                                    alt={kitchen.name} className="img-thumbnail" />
                            </Link>
                        </div>
                        <div className="listing-info">
                            <Link to={verified ? `/admin/edit/kitchens/${kitchen.id}` : `/admin/verify/kitchens/${kitchen.id}`}>
                                <h4>{kitchen.name}</h4>
                                <h6>{kitchen.type}</h6>
                                <h4>{kitchen.size} m<sup>2</sup> </h4>
                                <h3 className="price-m">€{kitchen.price} / h</h3>
                            </Link>
                            <Link className="address" to={verified ? `/admin/edit/kitchens/${kitchen.id}` : `/admin/verify/kitchens/${kitchen.id}`} >
                                {kitchen.address}
                            </Link>
                        </div>
                        <div className="listing-info price">
                            <h3>€{kitchen.price} / h</h3>
                        </div>
                    </div>
                    <div className="listing-info">
                        <Link to={verified ? `/admin/edit/kitchens/${kitchen.id}` : `/admin/verify/kitchens/${kitchen.id}`}  >
                            <button className="btn btn-orange btn-verify">{verified ? "View / Edit" : "Verify"}</button>
                        </Link>
                    </div>
                </div>
            );
        }
        return (<div className="home-container">
            {count ? listings : <div className="dashoard-container"><h4>No results</h4></div>}
            <Popup overlay={this.state.overlay} title="Error"
                message={this.state.popup.message} btn="ok" close={this.closePopup} />
        </div>
        );
    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}
