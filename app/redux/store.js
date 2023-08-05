import { createStore } from "redux";

// Action types
const STORE_MOVIES_DATA = "STORE_MOVIES_DATA";
const STORE_AUTH_DATA = "STORE_AUTH_DATA";
const STORE_GENRE_DATA = "STORE_GENRE_DATA";
const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
const SET_FILTER_QUERY = "SET_FILTER_QUERY";
const TRIGGER_RELOAD = "TRIGGER_RELOAD";
const ADD_MODAL_SWITCH = "ADD_MODAL_SWITCH";
const SET_GENRE_FILTER = "SET_GENRE_FILTER";
const ADD_GENRE = "ADD_GENRE"
const SET_LOADING = "SET_LOADING"

const stateObj = {
    movies: [],
    genres: [],
    auth: "",
    triggerReload: false,
    searchAndFilter: {
        searchTerm: "",
        filters: "",
    },
    addModalOpen: false,
    selectedGenre: [],
    loading: true
};

// Reducer function
const rootReducer = (state = stateObj, action) => {
    switch (action.type) {
        case STORE_MOVIES_DATA:
            return { ...state, movies: action.payload };
        case STORE_GENRE_DATA:
            return { ...state, genres: action.payload };
        case SET_SEARCH_QUERY:
            return {
                ...state,
                searchAndFilter: {
                    ...state.searchAndFilter,
                    searchTerm: action.payload,
                },
            };
        case SET_FILTER_QUERY:
            return {
                ...state,
                searchAndFilter: {
                    ...state.searchAndFilter,
                    filters: action.payload,
                },
            };
        case TRIGGER_RELOAD:
            return { ...state, triggerReload: !state.triggerReload };
        case ADD_MODAL_SWITCH:
          return { ...state, addModalOpen: !state.addModalOpen }
        case SET_GENRE_FILTER:
          return { ...state, selectedGenre: [...action.payload] }
        case ADD_GENRE:
            return { ...state, genres: [ ...state.genres, action.payload ] }
        case SET_LOADING:
            return { ...state, loading: action.payload }
        default:
            return state;
    }
};

const store = createStore(rootReducer);

export default store;
