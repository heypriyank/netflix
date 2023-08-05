import { Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    const history = useRouter();
    let token;
    if(typeof window !== "undefined") {
        token = localStorage.getItem("token");
    }
    const handleLogout = () => {
        localStorage.clear()
        history.replace("/register")
    }
    return (
        <div
            className="w-screen h-3/10 p-6 fixed top-0 z-50 bg-gradient-to-t from-transparent to-black"
            style={{ backdropFilter: "blur(30px)" }}
        >
            <div className="flex justify-center items-center">
                <Image
                    width={60}
                    height={40}
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Netflix_2015_N_logo.svg/1200px-Netflix_2015_N_logo.svg.png"
                    alt="netflix icon"
                />
                {token ? <Button className="left-96" variant="outlined" color="error" onClick={handleLogout}>Logout</Button> : ""}
                
            </div>
        </div>
    );
};
export default Header;
