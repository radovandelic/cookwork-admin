import React, { Component } from "react";
import { connect } from "react-redux";

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
        };
    }
    componentWillMount = () => {
        const { access_token } = this.props;
        const url = "http://0.0.0.0:9000/api/users?access_token=" + access_token;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        fetch(url, { method: "GET", headers: headers })
            .then(res => res.json())
            .then(data => this.setState({ users: data.rows }))
            .catch(err => this.setState({ overlay: "overlay on" }));

    }
    render() {
        const { users } = this.state;
        const Items = [];
        if (users && users[0]) {
            for (const user of users) {
                Items.push(
                    <tr key={user.id}>
                        <td>{user.firstName + " " + user.lastName}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.region}</td>
                        <td>{user.phone}</td>
                        <td>{user.activity}</td>
                        <td>{user.kitchenOwner ? "Kitchen owner" : "User"} </td>
                    </tr>
                );
            }

        }
        return (
            <div className="form-container user-table" key={users[0]}>
                <table>
                    <thead>
                        <tr>
                            <th width="200px"><h3>name</h3></th>
                            <th><h3>username</h3></th>
                            <th width="250px"><h3>email</h3></th>
                            <th><h3>region</h3></th>
                            <th><h3>phone</h3></th>
                            <th width="150px"><h3>activity</h3></th>
                            <th width="120px"><h3>role</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Items || "Loading..."}
                    </tbody>
                </table>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    access_token: state.user.access_token,
});

export default connect(mapStateToProps, null)(Users);