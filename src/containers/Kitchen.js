import React, { Component } from 'react';
import { Popup } from '../components'
import '../styles/kitchen.css';

var errorTitle = "Error"
var errorMessageConnect = "There has been an error connecting to the server. Please try again later."

class Kitchen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kitchen: {
                images: []
            },
            gallery: [],
            overlay: "overlay off",
            popup: {
                message: errorMessageConnect
            }
        };
    }

    componentDidMount = () => {
        const { id } = this.props.match.params;
        let url = 'http://0.0.0.0:9000/api/kitchens/' + id;

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                let gallery = [];
                if (data.images && data.images[0]) {
                    gallery = [];
                    for (let image of data.images) {
                        gallery.push(
                            <div key={image.id} data-p="170.00">
                                <img alt={data.name} data-u="image" src={image.large} />
                                <img alt={data.name} data-u="thumb" src={image.thumbnail} />
                            </div>
                        )
                    }
                } else {
                    gallery = (
                        <div data-p="170.00">
                            <img alt={data.name} data-u="image" src="/static/media/no-image.jpg" />
                            <img alt={data.name} data-u="thumb" src="/static/media/no-image.jpg" />
                        </div>
                    )
                }
                this.setState({ kitchen: data, gallery }, () => {

                    //load carousel scripts here so we don't slow down the rest of the app
                    if (!document.getElementById("jssor")) { //check if scripts are already loaded
                        let script = document.createElement("script");
                        script.id = "jssor";
                        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jssor-slider/27.1.0/jssor.slider.min.js";
                        script.async = true;
                        //script.integrity = "sha256-I6cF3fG3SkCsFWISv0FVllzVmZmDDLuiUcw60+n1Q3I=";
                        //script.crossorigin = "anonymous";
                        document.body.appendChild(script);

                        script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = "/static/js/carousel.js";
                        script.async = true;
                        document.body.appendChild(script);
                    } else {
                        window.jssor_1_slider_init();
                    }
                });
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" })
            });
    }

    render = () => {
        let { kitchen } = this.state;
        return (
            <div className="listing-container">
                <div className="carousel" >
                    <div id="jssor_1" style={{ position: "relative", margin: "0 auto", top: "0px", left: "0px", width: "980px", height: "480px", overflow: "hidden", visibility: "hidden" }}>
                        {/* <!-- Loading Screen --> */}
                        <div data-u="loading" className="jssorl-009-spin" style={{ position: "absolute", top: "0px", left: "0px", width: "100%", height: "100%", textAlign: "center", backgroundColor: "rgba(0,0,0,0.7)" }}>
                            <img alt="kitchen" style={{ marginTop: "-19px", position: "relative", top: "50%", width: "38px", height: "38px" }} src="/static/img/spin.svg" />
                        </div>
                        <div data-u="slides" style={{ cursor: "default", position: "relative", top: "0px", left: "0px", width: "980px", height: "380px", overflow: "hidden" }}>
                            {this.state.gallery}
                        </div>
                        {/* <!-- Thumbnail Navigator --> */}
                        <div data-u="thumbnavigator" className="jssort101" style={{ position: "absolute", left: "0px", bottom: "0px", width: "980px", height: "100px", backgroundColor: "#000" }} data-autocenter="1" data-scale-bottom="0.75">
                            <div data-u="slides">
                                <div data-u="prototype" className="p" style={{ width: "190px", height: "90px" }}>
                                    <div data-u="thumbnailtemplate" className="t"></div>
                                    <svg viewBox="0 0 16000 16000" className="cv">
                                        <circle className="a" cx="8000" cy="8000" r="3238.1"></circle>
                                        <line className="a" x1="6190.5" y1="8000" x2="9809.5" y2="8000"></line>
                                        <line className="a" x1="8000" y1="9809.5" x2="8000" y2="6190.5"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* <!-- Arrow Navigator --> */}
                        <div data-u="arrowleft" className="jssora106" style={{ width: "55px", height: "55px", top: "162px", left: "30px" }} data-scale="0.75">
                            <svg viewBox="0 0 16000 16000" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
                                <circle className="c" cx="8000" cy="8000" r="6260.9"></circle>
                                <polyline className="a" points="7930.4,5495.7 5426.1,8000 7930.4,10504.3 "></polyline>
                                <line className="a" x1="10573.9" y1="8000" x2="5426.1" y2="8000"></line>
                            </svg>
                        </div>
                        <div data-u="arrowright" className="jssora106" style={{ width: "55px", height: "55px", top: "162px", right: "30px" }} data-scale="0.75">
                            <svg viewBox="0 0 16000 16000" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
                                <circle className="c" cx="8000" cy="8000" r="6260.9"></circle>
                                <polyline className="a" points="8069.6,5495.7 10573.9,8000 8069.6,10504.3 "></polyline>
                                <line className="a" x1="5426.1" y1="8000" x2="10573.9" y2="8000"></line>
                            </svg>
                        </div>
                    </div >
                </div>
                <div>
                    <h2>
                        {kitchen.name}
                    </h2>
                    {kitchen.address} <br />
                    {kitchen.region || "Bruxelles"} <br />
                    <button className="btn btn-orange" >Contact</button>
                </div>
                <Popup overlay={this.state.overlay} title={errorTitle}
                    message={this.state.popup.message} btn="ok" close={this.closePopup} />
            </div>
        )
    }

    closePopup = () => {
        this.setState({ overlay: "overlay off" });
    }
}

export default Kitchen;