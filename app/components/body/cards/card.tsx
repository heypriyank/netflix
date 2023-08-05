import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
} from "@mui/material";
import { MovieData } from "../body";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

type CardData = {
    data: MovieData;
    isAdmin: boolean;
};

const Card = (props: CardData) => {
    let token: any;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
    }
    const {genres, loading} = useSelector((state: any) => state);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nnPopularity, setNnPopularity] = useState<String>("");
    const [director, setDirector] = useState<String>("");
    const [imdb, setImdb] = useState<number>();
    const [genre, setGenre] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState<String>("");

    const handleEdit = () => {
        if (isModalOpen) {
            setNnPopularity("");
            setDirector("");
            setImdb(undefined);
            setGenre([]);
            setImageUrl("");
            setIsModalOpen(!isModalOpen);
        } else {
            setNnPopularity(props.data["99popularity"]);
            setDirector(props.data.director);
            setImdb(props.data.imdb_score);
            setGenre(props.data.genre);
            setImageUrl(props.data.imageUrl);
            setIsModalOpen(!isModalOpen);
        }
    };
    const handleSave = async (isDelete:Boolean) => {
        dispatch({ type: "SET_LOADING", payload: true });
        let data;
        if (isDelete) {
            data = {
                _id: props.data._id,
                updates: {
                    isDeleted: true,
                },
            };
        } else {
            data = {
                _id: props.data._id,
                updates: {
                    ...(nnPopularity.length && {
                        "99popularity": nnPopularity,
                    }),
                    ...(director.length && { director }),
                    ...(imdb && { imdb_score: imdb }),
                    ...(genre.length && { genre: genre }),
                    ...(imageUrl && imageUrl.length && { imageUrl }),
                },
            };
        }
        let res = await fetch("/api/editMovie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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

    const handleAddGenre = async () => {
        const data = prompt("Enter Genre Name");
        if (data) {
            dispatch({ type: "SET_LOADING", payload: true });
            let body = { name: data };
            debugger;
            let res = await fetch("/api/addGenre", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ body, token }),
            });

            res = await res.json();
            // @ts-ignore
            if (res.body.message === "Success") {
                dispatch({ type: "ADD_GENRE", payload: { name: data } });
                alert("Genre Added!");
            } else {
                alert("There was an unexpected error while saving");
            }
        }
    };
    return (
        <>
            <div className="hover:scale-125 transform transition-transform duration-700 m-10 h-64 w-72 rounded-3xl bg-transparent border-4 border-white border-opacity-10 m-1 ">
                {props.isAdmin ? (
                    <div className="absolute">
                        <Button onClick={handleEdit}>
                            <BorderColorOutlinedIcon className="text-teal-300" />
                        </Button>
                    </div>
                ) : (
                    ""
                )}
                <div className="h-3/5 bg-slate-500 rounded-t-3xl">
                    {props.data.imageUrl ? (
                        <img
                            className="w-full h-full rounded-t-3xl object-fill"
                            // @ts-ignore
                            src={props.data.imageUrl}
                        />
                    ) : (
                        ""
                    )}
                </div>
                <p className="text-center mt-3">{props.data.name}</p>
                <div className="flex justify-between items-center ml-3 mt-5">
                    <div className="flex justify-around items-center">
                        <img
                            className="mr-3"
                            width={30}
                            height={20}
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/IMDb_Logo_Square.svg/2048px-IMDb_Logo_Square.svg.png"
                        />
                        <p>{props.data.imdb_score}</p>
                    </div>
                    <div className="mr-3 text-xs">
                        <h1>{props.data.director}</h1>
                    </div>
                </div>
            </div>
            <Modal
                open={isModalOpen}
                onClose={handleEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="w-full h-96 flex flex-col justify-evenly">
                        <TextField
                            label="99Popularity rating edit"
                            value={nnPopularity}
                            onChange={(e) => setNnPopularity(e.target.value)}
                        />
                        <TextField
                            label="Director name edit"
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                        />
                        <TextField
                            label="Imdb rating edit"
                            value={imdb}
                            onChange={(e:any) => setImdb(e.target.value)}
                        />
                        <TextField
                            label="Image URL edit"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <div className="flex items-center">
                            <FormControl className="w-full ml-3 bg-white rounded-3xl">
                                <InputLabel>Edit Genre</InputLabel>
                                <Select
                                    onChange={(e: any) => {
                                        handleGenreChange(
                                            e.target.value,
                                            "add"
                                        );
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
                            <button onClick={handleAddGenre} className="ml-6">
                                <span>➕</span>
                            </button>
                        </div>
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
                    <div className="mt-5 flex justify-between">
                        <Button
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
                            onClick={() => handleSave(false)}
                            disabled={loading}
                        >
                            Save
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleSave(true)}
                            disabled={loading}
                        >
                            DELETE
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    minHeight: 500,
    bgcolor: "white",
    boxShadow: 55,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: "10px",
};

export default Card;
