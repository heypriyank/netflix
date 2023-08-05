"use client";
import Header from "./components/header/header";
import Body from "./components/body/body";
import SearchBar from "./components/search/searchBar";
import { Provider } from "react-redux";
import store from "./redux/store";
import { useRouter } from "next/navigation";

function Home() {
    const history = useRouter();
    let token;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
    }

    if (token) {
        history.replace("/admin");
    }
    return (
        <>
            <Provider store={store}>
                <Header />
                <SearchBar />
                <Body />
            </Provider>
        </>
    );
}

export default Home;
