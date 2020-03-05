import { createStore, combineReducers } from 'redux';
import JwtReducer from './reducer/JwtReducer';
import DataReducer from './reducer/DataReducer'

const rootReducer = combineReducers({
    JwtReducer: JwtReducer,
    DataReducer: DataReducer
})

const configureStore = () => createStore(rootReducer);

export default configureStore;