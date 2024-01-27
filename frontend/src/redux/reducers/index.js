import { persistCombineReducers } from "redux-persist";
import constants from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./authReducers";
const config = {
  key: constants.asyncStorageKey,
  storage: AsyncStorage,
  blacklist: [],
};

const appReducer = persistCombineReducers(config, {
    auth:authReducer
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
