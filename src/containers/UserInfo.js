import React, { Component } from "react";
import { connect } from "react-redux";
import { weekDays } from "../data/text";

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            infos: [],
        };
    }
    componentWillMount = () => {
        const { access_token } = this.props;
        const url = "http://0.0.0.0:9000/api/infos??sort=-createdAt&access_token=" + access_token;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        fetch(url, { method: "GET", headers: headers })
            .then(res => res.json())
            .then(data => this.setState({ infos: data.rows }))
            .catch(err => this.setState({ overlay: "overlay on" }));

    }
    render() {
        const { infos } = this.state;
        const Items = [];
        if (infos && infos[0]) {
            for (const info of infos) {
                Items.push(
                    <tr key={info.id}>
                        <td>{info.user.firstName + " " + info.user.lastName}</td>
                        <td>{info.user.email}</td>
                        <td>{info.phone || info.user.phone}</td>
                        <td>{info.region || info.user.region}</td>
                        <td>{info.activity}</td>
                        <td>{info.purpose} </td>
                        <td>{info.type} </td>
                        {
                            info.type && info.type !== "recurring" && info.dateFrom && info.dateFrom ?
                                <td>
                                    {new Date(info.dateFrom).toLocaleDateString("fr-BE")
                                        + " - " +
                                        new Date(info.dateTo).toLocaleDateString("fr-BE")}
                                </td>
                                : info.type === "recurring" && info.daysFrom && info.daysTo ?
                                    <td>
                                        {weekDays.map[info.daysFrom]
                                            + " - " +
                                            weekDays.map[info.daysTo]}
                                    </td>
                                    :
                                    <td>
                                    </td>
                        }
                    </tr>
                );
            }

        }
        return (
            <div className="form-container user-table" key={infos[0]}>
                <table>
                    <thead>
                        <tr>
                            <th width="200px"><h3>name</h3></th>
                            <th width="250px"><h3>email</h3></th>
                            <th width="160px"><h3>phone</h3></th>
                            <th><h3>region</h3></th>
                            <th width="150px"><h3>activity</h3></th>
                            <th width="120px"><h3>purpose</h3></th>
                            <th width="120px"><h3>type</h3></th>
                            <th width="220px"><h3>dates/days</h3></th>
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