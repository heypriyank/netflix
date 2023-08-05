import { useEffect } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function LinearIndeterminate() {
    useEffect(() => {
        const handleScroll = (event: any) => {
            event.preventDefault();
        };
        window.addEventListener("scroll", handleScroll, { passive: false });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div className="w-full h-full inset-0 bg-opacity-50 backdrop-blur top-0 left-0 fixed z-50 flex justify-center items-center">
            <Box sx={{ width: "60%" }}>
                <LinearProgress color="error" />
            </Box>
        </div>
    );
}
