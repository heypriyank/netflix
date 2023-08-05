"use client";
import Header from "../components/header/header";
import SearchBar from "../components/search/searchBar";
import Body from "../components/body/body";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function Home() {
    const history = useRouter();
    let token:any = 1;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token") ? localStorage.getItem("token") : ""
        if (token === 1 || !token.length) {
            history.replace("/register");
        }
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
