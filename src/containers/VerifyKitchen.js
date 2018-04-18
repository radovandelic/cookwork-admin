import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Popup } from "../components";
import "../styles/forms.css";

const capacityOptions = [];
const hourOptions = [];
for (let index = 1; index < 21; index++) {
    capacityOptions.push(<option value={String(index)}>{index}</option>);
}
for (let index = 0; index < 25; index++) {
    hourOptions.push(<option value={String(index)}>{index}</option>);
}

/* const equipment = [
    "parking", "toilets", "fridge", "bainMarie", "mixer", "electronicCashier", "coolingCell", "nColdRoom",
    "pColdRoom", "etuve", "extraction", "oven", "pizzaOven", "fryer", "grill", "juicer", "pastaMachine",
    "mixMachine", "sauceMachine", "vacuumMachine", "microwave", "piano", "workplan", "griddle", "ceramicHob", "induction",
    "dishwasher", "sink", "threePhase", "cleaningProducts", "baker", "sauteuse", "freezer", "tableware", "vmc",
    "displays", "slicer", "dryStorage", "smallEquipment", "furniture", "ownEquipment"
]

const staff = [
    "cookstaff", "roomstaff", "dishwashers", "cleaning", "storage", "refrigeratorVehicle", "reception"
] */

const successMessage = "The kitchen has been verified and published.";
const errorMessageConnect = "There has been an error connecting to the server. Please try again later.";
var errorMessageUnauthorized = "Unauthorized access.";

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kitchen: {},
            user: {},
            overlay: "overlay",
            redirect: false,
            popup: {
                message: errorMessageConnect,
                btn: "ok",
                title: "Error",
            },
        };
    }
    componentWillMount = () => {
        const { access_token } = this.props.user;
        const { id } = this.props.match.params;
        let url = `http://0.0.0.0:9000/api/kitchens/${id}/?access_token=${access_token}`;

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        fetch(url, {
            method: "GET",
            headers: headers,
        })
            .then(response => response.json())
            .then(kitchen => {
                this.setState({ kitchen: this.formatDefaultValues(kitchen) });
                url = `http://0.0.0.0:9000/api/users/${kitchen.user.id}/?access_token=${access_token}`;
                return fetch(url, {
                    method: "GET",
                    headers: headers,
                });
            })
            .then(response => response.json())
            .then(user => {
                this.setState({ user });
            })
            .catch(err => {
                this.setState({
                    overlay: "overlay on",
                    popup: {
                        message: "There has been an error connecting to the server. Please try again later.",
                        title: "Error",
                        btn: "ok",
                    },
                });
            });

    }

    formatData = (submittedValues) => {
        const oldValues = this.state.kitchen;
        submittedValues.type = submittedValues.type || oldValues.type;
        submittedValues.events = Boolean(submittedValues.events) || undefined;
        submittedValues.size = Number(submittedValues.size) || undefined;
        submittedValues.price = Number(submittedValues.price) || undefined;
        submittedValues.rent = Number(submittedValues.rent) || undefined;
        submittedValues.capacity = Number(submittedValues.capacity) || undefined;
        submittedValues.standingCapacity = Number(submittedValues.standingCapacity) || undefined;
        submittedValues.sittingCapacity = Number(submittedValues.sittingCapacity) || undefined;
        submittedValues.hours = {
            hoursFrom: Number(submittedValues.hoursFrom) || 0,
            hoursTo: Number(submittedValues.hoursTo) || 24,
        };
        submittedValues.equipment = undefined;
        submittedValues.staff = undefined;
        for (const key in submittedValues) {
            submittedValues[key] = (submittedValues[key] && key !== "user") ? submittedValues[key] : oldValues[key];
        }

        // place equipment booleans inside equipment object
        /* for (let e of equipment) {
            if (submittedValues[e]) {
                submittedValues.equipment[e] = submittedValues[e];
                submittedValues[e] = undefined;
            }
        }

        //place staff booleans inside staff object
        for (let s of staff) {
            if (submittedValues[s]) {
                submittedValues.staff[s] = submittedValues[s];
                submittedValues[s] = undefined;
            }
        }*/
        return submittedValues;
    }

    submit = (e) => {
        e.preventDefault();
        const { user } = this.props;
        const { id } = this.props.match.params;
        let submittedValues = {};
        for (const ref in this.refs) {
            submittedValues[ref] = this.refs[ref].value ? this.refs[ref].value : undefined;
        }
        submittedValues = this.formatData(submittedValues);
        submittedValues.verified = true;
        submittedValues.access_token = user.access_token;
        const url = `http://0.0.0.0:9000/api/kitchens/${id}/`;
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(submittedValues),
        };
        fetch(url, query)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    popup: {
                        message: successMessage,
                        title: "Success",
                        btn: "ok",
                    },
                    overlay: "overlay on",
                });
            })
            .catch(err => {
                this.setState({
                    popup: {
                        message: errorMessageConnect,
                        title: "Error",
                        btn: "ok",
                    },
                    overlay: "overlay on",
                });
            });
    }

    formatDefaultValues = (kitchen) => {
        if (!kitchen.id) {
            return this.setState({ redirect: "/admin" });
        }
        if (kitchen.events) {
            kitchen.events = "true";
        }
        for (const id in kitchen.equipment) {
            kitchen[id] = kitchen.equipment[id]; // format object so it's readable by the form
        }

        for (const id in kitchen.staff) {
            kitchen[id] = kitchen.staff[id]; // format object so it's readable by the form
        }
        if (kitchen.hours) {
            kitchen.hoursTo = String(kitchen.hours.hoursTo);
            kitchen.hoursFrom = String(kitchen.hours.hoursFrom);
        }
        kitchen.capacity = String(kitchen.capacity);
        return kitchen;
    }

    render = () => {
        const { user, kitchen } = this.state;
        const verified = this.props.match.url === `/admin/edit/kitchens/${kitchen.id}`;
        const equipment = [];
        const staff = [];
        for (const e in kitchen.equipment) {
            equipment.push(
                <li key={e}> {e} </li>
            );
        }
        for (const s in kitchen.staff) {
            staff.push(
                <li key={s}> {s} </li>
            );
        }

        return (
            this.state.redirect
                ? <Redirect push to={this.state.redirect} />
                :
                <div>
                    <form onSubmit={this.submit} id="form2" className="form-container" key={kitchen.id}>
                        <h4> {verified ? kitchen.name : "Kitchen Verification"}</h4>
                        {kitchen.user ? (
                            <p style={{ textAlign: "justify" }}>
                                User: {user ? user.name : ""} <br />
                                Name: {user ? user.firstName + " " + user.lastName : ""} <br />
                                email: <a href={"mailto:" + user.email}>{user.email} </a>

                            </p>)
                            :
                            null}
                        <div className="input-div" >
                            <label htmlFor="name">Nom du bien</label>
                            <input type="text" ref="name" id="name" defaultValue={kitchen.name} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="phone">Votre numéro de téléphone</label>
                            <input type="text" ref="phone" id="phone" defaultValue={kitchen.phone} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="description">Descriptif du bien </label>
                            <textarea style={{ width: "100%" }} rows="4" ref="description" id="description" defaultValue={kitchen.description} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="type">Type de bien: </label>
                            <input type="text" ref="type" id="type" readOnly value={kitchen.type} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="address">Adresse du bien</label>
                            <input type="text" ref="address" id="address" defaultValue={kitchen.address} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="postalcode">Code postal</label>
                            <input type="number" ref="postalCode" id="postalcode" min="1000" max="9999" readOnly defaultValue={kitchen.postalCode} />
                        </div>
                        <label htmlFor="region">Ville/Region</label>
                        <div className="input-div" >
                            <select type="text" ref="region" id="region"
                                defaultValue={kitchen.region} >
                                <option value={kitchen.region}>{kitchen.region}</option>
                            </select>
                        </div>
                        <div className="input-div" >
                            <label htmlFor="size">Superficie du bien (en m2)</label>
                            <input type="number" ref="size" id="size" min="1" max="5000" defaultValue={kitchen.size} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="AFSCA">Numéro d'unité d'établissement (AFSCA)</label>
                            <input type="text" ref="AFSCA" id="AFSCA" defaultValue={kitchen.AFSCA} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="VAT">Numéro de TVA</label>
                            <input type="text" ref="VAT" id="VAT" defaultValue={kitchen.VAT} />
                        </div>
                        <label htmlFor="hours">Heures de disponibilité</label>
                        <div className="input-div-hours" >
                            <select ref="hoursFrom" id="hoursFrom" defaultValue={kitchen.hoursFrom} >
                                <option value={kitchen.hoursFrom}>{kitchen.hoursFrom}</option>
                            </select>
                            &nbsp;&nbsp;-&nbsp;&nbsp;
                            <select ref="hoursTo" id="hoursTo" defaultValue={kitchen.hoursTo} >
                                <option value={kitchen.hoursTo}>{kitchen.hoursTo}</option>
                            </select>
                        </div>
                        <label htmlFor="capacity">Nombre de personnes pouvant travailler en cuisine</label>
                        <div className="input-div" >
                            <select ref="capacity" id="capacity" defaultValue={kitchen.capacity} >
                                <option value={kitchen.capacity}>{kitchen.capacity}</option>
                            </select>
                        </div>
                        <div className="input-div" >
                            <label htmlFor="price">Prix à l'heure (HTVA)</label>
                            <input type="number" ref="price" id="price" min="15" max="500" readOnly defaultValue={kitchen.price} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="rent">Prix au mois pour un entrepreneur (une équipe de 2 personnes max) (HTVA)</label>
                            <input type="number" ref="rent" id="rent" min="100" max="50000" readOnly defaultValue={kitchen.rent} />
                        </div>
                        <label htmlFor="equipment">Equipements disponibles:</label>
                        <div className="input-div-checkbox" >
                            <ul className="checkbox-grid">
                                {equipment}
                            </ul>
                        </div>

                        <label htmlFor="staff">Services disponibles:</label>
                        <div className="input-div" >
                            <ul className="checkbox-grid">
                                {staff}
                            </ul>
                        </div> <br />
                        {/* <div className="input-div-checkbox" >
                                    <ul className="checkbox-grid">
                                        <li>  <StyledCheckbox ref="parking" id="parking" label="Parking" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="toilets" id="toilets" label="Toilettes" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="fridge" id="fridge" label="Frigo" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="bainMarie" id="bain-marie" label="Bain marie" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="mixer" id="mixer" label="Batteur" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="electronicCashier" id="electronic-cashier" label="Caisse électronique" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="coolingCell" id="cooling-cell" label="Cellule de refroidissement" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="nColdRoom" id="n-cold-room" label="Chambre froide négative" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="pColdRoom" id="p-cold-room" label="Chambre froide positive" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="etuve" id="etuve" label="Etuve" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="extraction" id="extraction" label="Extraction" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="oven" id="oven" label="Four" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="pizzaOven" id="pizza-oven" label="Four a pizza" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="fryer" id="fryer" label="Friteuse" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="grill" id="grill" label="Grill" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="juicer" id="juicer" label="Machine a jus" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="pastaMachine" id="pasta-machine" label="Machine à pates" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="mixMachine" id="mix-machine" label="Machine à pétrin" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="sauceMachine" id="sauce-machin" label="Machine à sauce" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="vacuumMachine" id="vacuum-machine" label="Machine sous-vide" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="microwave" id="microwave" label="Micro-onde" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="piano" id="piano" label="Piano" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="workplan" id="workplan" label="Plan de travail" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="griddle" id="griddle" label="Plancha" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="ceramicHob" id="ceramic-hob" label="Plaque vitrocéramique" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="induction" id="induction" label="Plaques à induction" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="dishwasher" id="dishwasher" label="Lave vaisselle" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="sink" id="sink" label="Plonge manuelle" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="threePhase" id="three-phase" label="Prises électriques triphasées" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="cleaningProducts" id="cleaning-products" label="Produits d’entretien" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="baker" id="baker" label="Robot patissier" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="sauteuse" id="sauteuse" label="Sauteuse" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="freezer" id="freezer" label="Surgelateur" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="tableware" id="tableware" label="Vaisselle de salle" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="vmc" id="vmc" label="VMC" className="d-inline-block" /></li>
                                        <li>  <StyledCheckbox ref="displays" id="displays" label="Présentoirs" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="slicer" id="slicer" label="Trancheuse" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="dryStorage" id="dry-storage" label="Stockage sec (étagères)" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="furniture" id="furniture" label="Mobilier de salle (tables, chaises...)" className="d-inline-block" /> </li>
                                        <li>  <StyledCheckbox ref="smallEquipment" id="small-equipment" label="Petit matériel (cul de poule, ustensiles...)" className="d-inline-block" /> </li>
                        
                                        <li>  <StyledCheckbox ref="ownEquipment" id="own-equipment" label="Possibilité d’apporter son matériel (sous conditions)" className="d-inline-block" /> </li>
                                    </ul>
                                </div>
                                <label htmlFor="staff">Services disponibles (en option payante pour le locataire):</label>
                                <div className="input-div" style={{ height: '80px' }}>
                                    <ul className="checkbox-grid">
                                        <li> <StyledCheckbox ref="cookstaff" id="cookstaff" label="Personnel de cuisine" className="d-inline-block" /></li>
                                        <li> <StyledCheckbox ref="roomstaff" id="roomstaff" label="Personnel de salle" className="d-inline-block" /> </li>
                                        <li> <StyledCheckbox ref="dishwashers" id="dishwashers" label="Commis/ plongeur" className="d-inline-block" /> </li>
                                        <li> <StyledCheckbox ref="cleaning" id="cleaning" label="Service de nettoyage" className="d-inline-block" /></li>
                                        <li> <StyledCheckbox ref="storage" id="storage" label="Service de stockage" className="d-inline-block" /> </li>
                                        <li> <StyledCheckbox ref="refrigeratorVehicle" id="refrigerator-vehicle" label="Véhicule réfrigéré" className="d-inline-block" /> </li>
                                        <li> <StyledCheckbox ref="reception" id="reception" label="Réception de marchandises" className="d-inline-block" /> </li>
                                    </ul>
                                </div>
                                <div htmlFor="cancellation" className="input-div" style={{ height: '140px' }}>
                                    <label>Vos conditions d'annulation:</label>
                                    <StyledRadioGroup ref="cancellation" >
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="flexible" id="fexible" label="Flexible: remboursement à hauteur de 50% jusqu'à 48h avant la réservation" className="d-inline-block cancellation-item" /> </li>
                                                <li> <StyledRadio group={group} value="moderate" id="moderate" label="Modérée: Remboursement à hauteur de 50% jusqu'à 7 jours avant la réservation" className="d-inline-block cancellation-item" /> </li>
                                                <li> <StyledRadio group={group} value="strict" id="strict" label="Stricte: Remboursement à hauteur de 50% jusqu'à 30 jours avant la réservation" className="d-inline-block cancellation-item" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div>
                                <div htmlFor="events" className="input-div">
                                    <label>Espace disponible pour évènement?</label>
                                    <StyledRadioGroup onChange={(e) => { kitchen.events = e }} ref="events">
                                        {group => (
                                            <ul className="radio-grid" >
                                                <li> <StyledRadio group={group} value="true" id="true" label="Oui" className="d-inline-block" /> </li>
                                                <li> <StyledRadio group={group} value="" id="false" label="Non" className="d-inline-block" /> </li>
                                            </ul>
                                        )}
                                    </StyledRadioGroup>
                                </div> */}

                        <div className="input-div" >
                            <label htmlFor="cancellation">Conditions d'annulation: </label>
                            <input type="text" /* ref="cancellation"*/ readOnly="true" id="cancellation" value={kitchen.cancellation} />
                        </div>
                        <div className="input-div" >
                            <label htmlFor="event-capacity1">Capacité debout pour évènement:</label>
                            <input type="number" ref="standingCapacity" id="standing-capacity1" defaultValue={kitchen.standingCapacity} />
                            <label htmlFor="event-capacity2">Capacité assis pour évènement:</label>
                            <input type="number" ref="sittingCapacity" id="sitting-capacity" defaultValue={kitchen.sittingCapacity} />
                        </div>
                        {/* ) : null} */}
                        <div className="inline">
                            <div className="input-div" >
                                <button id="submit" type="submit" className="btn btn-orange">{verified ? "Save changes" : "Verify & publish Kitchen"}</button>
                            </div>
                            <div className="input-div" >
                                <button id="delete" type="button" onClick={verified ? this.unpublish : () => {
                                    this.setState({
                                        popup: {
                                            message: "Are you sure you want to reject and delete this listing?",
                                            title: "Confirm",
                                            btn: "yesno",
                                        },
                                        overlay: "overlay on",
                                    });
                                }}
                                className="btn btn-danger">{verified ? "Unpublish listing" : "Reject and delete listing"}</button>
                            </div>
                        </div>
                        <div id="header_spacing"></div>
                    </form>
                    <Popup message={this.state.popup.message}
                        btn={this.state.popup.btn}
                        title={this.state.popup.title}
                        overlay={this.state.overlay}
                        close={this.closePopup}
                        yes="delete" no="false" />
                </div>
        );
    }

    unpublish = () => {
        const { user } = this.props;
        const { id } = this.props.match.params;
        let submittedValues = {};
        for (const ref in this.refs) {
            submittedValues[ref] = this.refs[ref].value ? this.refs[ref].value : undefined;
        }
        submittedValues = this.formatData(submittedValues);
        submittedValues.verified = false;
        submittedValues.access_token = user.access_token;
        const url = `http://0.0.0.0:9000/api/kitchens/${id}/`;
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(submittedValues),
        };
        fetch(url, query)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    popup: {
                        message: "The kitchen has been unpublished.",
                        title: "Success",
                        btn: "ok",
                    },
                    overlay: "overlay on",
                });
            })
            .catch(err => {
                this.setState({
                    popup: {
                        message: errorMessageConnect,
                        title: "Error",
                        btn: "ok",
                    },
                    overlay: "overlay on",
                });
            });
    }

    delete = () => {
        const { user } = this.props;
        const { id } = this.props.match.params;
        const url = `http://0.0.0.0:9000/api/kitchens/${id}/`;
        const query = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({ access_token: user.access_token }),
        };
        fetch(url, query)
            .then(res => {
                switch (res.status) {
                    case 401:
                        this.setState({ popup: { message: errorMessageUnauthorized, title: "Error", btn: "ok" } });
                        throw new Error(errorMessageUnauthorized);
                    case 204:
                        this.setState({ popup: { message: "Listing deleted.", title: "Deleted", btn: "ok" } });
                        return res.text();
                    default:
                        this.setState({ popup: { message: errorMessageConnect, title: "Error", btn: "ok" } });
                        throw new Error(errorMessageConnect);
                }
            })
            .then(data => {
                this.setState({ overlay: "overlay on" });
            })
            .catch(err => {
                this.setState({ overlay: "overlay on" });
            });
    }

    closePopup = (e) => {
        if (e.target.value === "delete") {
            this.delete();
        }
        const redirect = this.state.popup.title === "Success" || this.state.popup.title === "Deleted" ? "/admin" : false;
        this.setState({ overlay: "overlay off", redirect: redirect });
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

Form = connect(
    mapStateToProps,
    null
)(Form);

export default Form;