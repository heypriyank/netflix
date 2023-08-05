import "dotenv/config";

const config = {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    getMovies: "get-movies",
    addMovies: "add-movie",
    editMovies: "edit-movie",
    deleteMovies: "delete-movies",
    login: "auth/login",
    signup: "auth/signup",
    addGenre: "add-genre",
};

export default config;
