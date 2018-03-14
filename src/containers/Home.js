import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/home.css';

export default () => {
    return (<div className="home-container">
        <div className="home-block-1" id="top">
            <div className="home-title">
                <h1>Louez une cuisine près de chez vous, facilement</h1>
            </div>
            <div className="home-description">
                <h4>CookWork vous permet de louer un atelier pro</h4>
                <h4>aux normes AFSCA en toute flexibilité</h4>
            </div>
            <div className="select left">
                <select>
                    <option>Ville/Region</option>
                    <option value="antwerpen">Antwerpen</option>
                    <option value="brabant">Brabant</option>
                    <option value="bruxelles">Bruxelles</option>
                </select>
                <div className="select_arrow">
                </div>
            </div>
            <div className="select">
                <select defaultValue="kitchen" >
                    <option disabled>Espace de cuisine</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="cook">Cook</option>
                    <option value="consultant">Consultant</option>
                </select>
                <div className="select_arrow">
                </div>
            </div>
            <Link to="/browse">
                <button className="btn btn-grey" id="go">Trouver une cuisine</button>
            </Link>
        </div>
        <div className="home-block-2">
            <div className="home-title">
                <h1>Choisissez votre atelier</h1>
            </div>
            <div className="home-description">
                <h4>Vous lancez votre projet alimentaire ?</h4>
                <h4>Une grosse production en vue ? </h4>
                <br />
                <h4>Les cuisines CookWork sont équipées pour la production professionnelle</h4>
            </div>
        </div>
        <div className="home-block-3">
            <div className="home-title">
                <h1>Comment ça fonctionne?</h1>
                <h6>Etapes par étapes, nous vous guidons pour assurer votre booking</h6>
            </div>
            <div className="home-inline" >
                <div className="inline-element" >
                    <h1>01</h1>
                    <p><b>Vous remplissez le formulaire</b></p>
                    <p>Avec vos besoins spécifiques</p>
                </div>
                <div className="inline-element">
                    <h1>02</h1>
                    <p><b>Vous réservez</b></p>
                    <p>Une cuisine seléctionnée pour vous</p>
                </div>
                <div className="inline-element">
                    <h1>03</h1>
                    <p><b>Vous cuisinez</b></p>
                    <p>Vous réalisez votre production dans des conditions optimales</p>
                </div>
            </div>
        </div>
    </div>
    );
}