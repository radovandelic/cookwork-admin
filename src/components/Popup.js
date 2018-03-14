import React from 'react';
import '../styles/popup.css'

export default (props) => {
    return (

        <div id="popup" className={props.overlay}>
            <div className="popup">
                <h2>{props.title}</h2>
                <a className="close" onClick={props.close} >&times;</a>
                <br />
                <div className="content">
                    {props.message}
                </div>
                {props.btn === "ok"
                    ?
                    <button className="btn btn-orange" onClick={props.close}>Ok</button>
                    : props.btn === "yesno" ?
                        <div className="inline" >
                            <button value={props.yes} className="btn btn-orange inline" onClick={props.close}>Yes</button>
                            <button value={props.no} className="btn btn-orange inline" onClick={props.close}>No</button>
                        </div>
                        :
                        null
                }
            </div>
        </div>
    )
}