import React, { Component } from "react";
import { connect } from "react-redux";
import { weekDays } from "../data/text";

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orders: [],
        };
    }
    componentWillMount = () => {
        const { access_token } = this.props;
        const url = "http://0.0.0.0:9000/api/orders?sort=-createdAt&access_token=" + access_token;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        fetch(url, { method: "GET", headers: headers })
            .then(res => res.json())
            .then(data => this.setState({ orders: data.rows }))
            .catch(err => this.setState({ overlay: "overlay on" }));

    }
    render() {
        const { orders } = this.state;
        const Items = [];
        if (orders && orders[0]) {
            for (const order of orders) {
                Items.push(
                    <tr key={order.id}>
                        <td>{order.user.firstName + " " + order.user.lastName}</td>
                        <td>{order.user.email}</td>
                        <td>{order.phone || order.user.phone}</td>
                        <td>{order.kitchen.name}</td>
                        <td>{order.type} </td>
                        {
                            order.type && order.type !== "recurring" && order.dateFrom && order.dateFrom ?
                                <td>
                                    {new Date(order.dateFrom).toLocaleDateString("fr-BE")
                                        + " - " +
                                        new Date(order.dateTo).toLocaleDateString("fr-BE")}
                                </td>
                                : order.type === "recurring" && order.daysFrom && order.daysTo ?
                                    <td>
                                        {weekDays.map[order.daysFrom]
                                            + " - " +
                                            weekDays.map[order.daysTo]}
                                    </td>
                                    :
                                    <td>
                                    </td>
                        }
                        <td>{order.totalPrice ? "€" + (order.totalPrice * 1.21).toFixed(2) : ""} </td>
                    </tr>
                );
            }

        }
        return (
            <div className="form-container user-table" key={orders[0]}>
                <table>
                    <thead>
                        <tr>
                            <th width="200px"><h3>name</h3></th>
                            <th width="250px"><h3>email</h3></th>
                            <th width="160px"><h3>phone</h3></th>
                            <th width="150px"><h3>kitchen</h3></th>
                            <th width="120px"><h3>type</h3></th>
                            <th width="220px"><h3>dates/days</h3></th>
                            <th width="120px"><h3>est. price</h3></th>
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