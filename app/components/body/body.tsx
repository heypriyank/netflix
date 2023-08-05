"use client";
import { useEffect, useState } from "react";
import Card from "./cards/card";
import { motion, Variants } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../loader/loader";

export type MovieData = {
    _id: String;
    "99popularity": String;
    addedBy: String;
    createdAt: String;
    director: String;
    genre: string[];
    imdb_score: number;
    name: String;
    imageUrl: String;
};

const Body: React.FC = () => {
    let token: any;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
    }
    const state = useSelector((state: any) => state);
    const dispatch = useDispatch();
    const [movies, setMovies] = useState<MovieData[]>([]);

    useEffect(() => {
        async function fetchItems() {
            dispatch({ type: "SET_LOADING", payload: true });
            const { searchTerm, filters } = state.searchAndFilter;
            let url = `/api/getMovies?search=${
                searchTerm ? searchTerm : ""
            }&genre=${state.selectedGenre ? state.selectedGenre : ""}&sort=${
                filters ? filters : ""
            }`;
            const response = await fetch(url);
            const data = await response.json();
            dispatch({ type: "STORE_MOVIES_DATA", payload: data.body.movies });
            dispatch({ type: "STORE_GENRE_DATA", payload: data.body.genres });
            setMovies(data.body.movies);
            dispatch({ type: "SET_LOADING", payload: false });
        }

        fetchItems();
    }, [state.triggerReload]);

    const staggerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
    };

    return (
        <>
            <div className="h-auto m-24 -mt-10 pt-10 flex flex-wrap justify-start">
                {movies.map((element: MovieData, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={staggerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card data={element} isAdmin={!!token} />
                    </motion.div>
                ))}
            </div>
            {state.loading ? <Loader /> : ""}
        </>
    );
};

export default Body;
