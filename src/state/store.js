import {configureStore, createSlice} from '@reduxjs/toolkit';
import localforage from 'localforage';
import {STORE_KEY, USE_MOCK} from '../SETTINGS.js';
import healJson from '../utils/healJson.js';
import STATE_SCHEMA from './STATE_SCHEMA.js';

// =====================================================================================================================
//  S E T U P
// =====================================================================================================================
const slice = createSlice({
    name: 'app',
    initialState: healJson(
        {}, // target
        STATE_SCHEMA, // schema
        {verbose: false}, // options
    ),
    reducers: {
        setState: (state, action) => action.payload(state),
    },
});

const store = configureStore({
    reducer: slice.reducer,
    // https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActionPaths: ['payload'],
            },
        });
    },
});

const setState = (manipulator) => {
    dispatch(slice.actions.setState(manipulator));
};

store.subscribe(() => {
    const state = getState();
    // console.log('Persisting', state);
    if (!USE_MOCK) {
        const safeState = {...state};
        safeState.volatile = {};
        localforage.setItem(STORE_KEY, safeState);
    }
});

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export const {dispatch, getState} = store;
export {setState};
export default store;
