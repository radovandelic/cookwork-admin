import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateUser } from '../actions';
import '../styles/dashboard.css';

let Dashboard = (props) => {

    const logout = () => {
        props.updateUser({});
    }

    const { user } = props;

    return (
        <div className="dashoard-container">
            <h4>Welcome back, admin </h4>
            <div>
                <img src={user.picture} alt={user.name} />
            </div> <br />
            <Link to="/admin/verify/kitchens">
                <button className="mb-4 btn btn-orange dashboard-btn">Verify & edit kitchen listings</button>
            </Link>
            <Link to="/admin/translate">
                <button className="mb-4 btn btn-orange dashboard-btn">Edit translations</button>
            </Link>
            <button id="logout" type="submit" onClick={logout} className="mb-4 btn btn-danger dashboard-btn">Logout</button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (user) => {
            dispatch(updateUser(user));
        }
    }
}

Dashboard = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard)

export default Dashboard;