"use client";
import Button from "@mui/material/Button";
import { Box, Modal, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

const SearchBar: React.FC = () => {
    // @ts-ignore
    let token;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
    }
    const { genres, loading } = useSelector((state: any) => state);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filter, setFilter] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState<String>("");
    const [nnPopularity, setNnPopularity] = useState<String>("");
    const [director, setDirector] = useState<String>("");
    const [imdb, setImdb] = useState<number>();
    const [genre, setGenre] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState<String>("");
    const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
    const [trigger, setTrigger] = useState<boolean>(false);

    useEffect(() => {
        if (trigger) {
            handleSearch();
        }
    }, [filter, selectedGenre]);

    const handleSearch = () => {
        dispatch({ type: "SET_SEARCH_QUERY", payload: searchTerm });
        dispatch({ type: "SET_FILTER_QUERY", payload: filter });
        dispatch({ type: "SET_GENRE_FILTER", payload: selectedGenre });
        dispatch({ type: "TRIGGER_RELOAD" });
    };

    const handleEdit = () => {
        setNnPopularity("");
        setDirector("");
        setImdb(undefined);
        setGenre([]);
        setImageUrl("");
        setIsModalOpen(!isModalOpen);
    };
    const handleSave = async () => {
        dispatch({ type: "SET_LOADING", payload: true });
        if (
            !name.length ||
            !nnPopularity ||
            !director.length ||
            !imdb ||
            !genre.length
        ) {
            alert("Missing mandatory fields!");
            return;
        }
        const data = {
            name,
            "99popularity": nnPopularity,
            director,
            imdb_score: imdb,
            genre: genre,
            imageUrl,
        };
        let res: any = await fetch("/api/addMovie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // @ts-ignore
            body: JSON.stringify({ data, token }),
        });

        res = await res.json();
        // @ts-ignore
        if (res.body.message === "Success") {
            dispatch({ type: "TRIGGER_RELOAD" });
            handleEdit();
        } else {
            alert("There was an unexpected error while saving");
        }
    };
    const handleGenreChange = (item: string, operation: string) => {
        if (operation === "remove") {
            const filteredGenre = genre.filter((elem) => elem != item);
            setGenre(filteredGenre);
        } else {
            const set = new Set(genre);
            set.add(item);
            setGenre(Array.from(set));
        }
    };

    const handleSelectedGenre = (genre: any) => {
        setTrigger(true);
        if (!selectedGenre.includes(genre.name))
            setSelectedGenre([...selectedGenre, genre.name]);
        else {
            const newSelected = selectedGenre.filter(
                (elem) => elem != genre.name
            );
            setSelectedGenre(newSelected);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center mt-24 h-60 w-auto">
                <div className="relative flex items-center w-3/5">
                    <TextField
                        value={searchTerm}
                        InputProps={{ style: styles.input }}
                        InputLabelProps={{ style: styles.inputLabel }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" ? handleSearch() : ""
                        }
                        className="w-full rounded-full bg-white"
                        placeholder="search here 🍿"
                    />
                    <Button
                        className="h-auto ml-2 !absolute !rounded-full right-3 !bg-red-600"
                        onClick={handleSearch}
                        variant="contained"
                    >
                        <SearchIcon />
                    </Button>
                </div>

                <FormControl className="min-w-0 !ml-4 bg-white rounded-xl">
                    <InputLabel>{/* <FilterListIcon /> */}</InputLabel>
                    <Select
                        value={filter}
                        onChange={(e) => {
                            setTrigger(true);
                            setFilter(e.target.value);
                        }}
                    >
                        <MenuItem key="popularity" value="imdb_score">
                            Popularity
                        </MenuItem>
                        <MenuItem key="director" value="director">
                            Director
                        </MenuItem>
                        <MenuItem key="movie" value="name">
                            Movie
                        </MenuItem>
                    </Select>
                </FormControl>
                {token ? (
                    <div
                        onClick={handleEdit}
                        className="w-14 h-14 ml-4 text-2xl bg-white text-black flex justify-center items-center rounded-full"
                    >
                        <button>+</button>
                    </div>
                ) : (
                    ""
                )}
            </div>
            {genres.length ? (
                <div className="flex flex-wrap justify-center px-10 w-full h-10">
                    {genres.map((genre: any) => {
                        const isSelected = selectedGenre.includes(genre.name);
                        return (
                            <button
                                onClick={() => handleSelectedGenre(genre)}
                                className="hover:scale-125 transform transition-transform duration-700"
                            >
                                <div
                                    className={`flex justify-center items-center p-3 mr-3 text-${
                                        isSelected ? "white" : "black"
                                    } bg-${
                                        isSelected ? "red-600" : "white"
                                    } text-xs border border-black rounded-3xl p-1`}
                                >
                                    {genre.name}
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                ""
            )}
            <Modal
                open={isModalOpen}
                onClose={handleEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="w-full h-5/6 flex flex-col justify-evenly">
                        <TextField
                            label="Movie Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="!mb-3"
                        />
                        <TextField
                            label="99Popularity rating"
                            value={nnPopularity}
                            onChange={(e) => setNnPopularity(e.target.value)}
                            className="!mb-3"
                        />
                        <TextField
                            label="Director name"
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                            className="!mb-3"
                        />
                        <TextField
                            label="imdb_score rating"
                            value={imdb}
                            onChange={(e: any) => setImdb(e.target.value)}
                            className="!mb-3"
                        />
                        <TextField
                            label="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="!mb-3"
                        />
                        <FormControl className="w-full ml-3 bg-white rounded-3xl">
                            <InputLabel>Add Genre</InputLabel>
                            <Select
                                onChange={(e: any) => {
                                    handleGenreChange(e.target.value, "add");
                                }}
                            >
                                {genres.map((option: any) => (
                                    <MenuItem
                                        key={option.name}
                                        value={option.name}
                                    >
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="flex flex-wrap">
                            {genre.map((elem) => {
                                return (
                                    <div className="flex justify-center items-center m-1">
                                        <div className="text-black text-xs border border-black rounded-3xl p-1">
                                            <p>{elem}</p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleGenreChange(
                                                    elem,
                                                    "remove"
                                                )
                                            }
                                            disabled={loading}
                                        >
                                            <span className="text-black ml-1">
                                                x
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-10">
                        <Button
                            className="!mr-5"
                            variant="outlined"
                            color="error"
                            onClick={handleEdit}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            Save
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

const styles = {
    input: {
        border: "2px solid #ff0000",
        textColor: "#FFFFFF",
        borderRadius: "100px",
        "::placeholder": {
            color: "#FFFFFF",
        },
    },
    inputLabel: {
        color: "#FFFFFF",
    },
};
const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    minHeight: 550,
    bgcolor: "white",
    boxShadow: 55,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: "10px",
};

export default SearchBar;
