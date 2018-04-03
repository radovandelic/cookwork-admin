import { combineReducers } from "redux";

const kitchenReducer = (state = {}, action) => {
    switch (action.type) {
        case "UPDATE_KITCHEN":
            return action.kitchen;
        default:
            return state;
    }
};

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case "UPDATE_USER":
            return action.user;
        default:
            return state;
    }
};
const rootReducer = combineReducers({
    user: userReducer,
    kitchen: kitchenReducer,
});

export default rootReducer;