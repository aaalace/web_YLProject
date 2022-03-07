import {createStore, combineReducers, applyMiddleware} from 'redux';
import { userReducer } from './user/reducer';
import { postsReducer } from './profilePosts/reducer';
import { currentPostReduser } from './currentPost/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
// import storage from 'redux-persist/lib/storage';
// import persistReducer from "redux-persist/es/persistReducer";
// import persistStore from "redux-persist/es/persistStore";

// const persistConfig = {
//     key: 'root',
//     storage,
//     whitelist: ['user']
// }

const rootReducer = combineReducers({
    user: userReducer,
    profilePosts: postsReducer,
    current_post: currentPostReduser
})

// const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
)

// export const persistedStore = persistStore(store)