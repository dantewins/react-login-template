import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Box, CssBaseline, Toolbar, Typography, IconButton, useTheme, useMediaQuery, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBar from "./MenuBar";
import useLogout from "../Hooks/useLogout";

const Header = () => {
    const logout = useLogout();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const routes = ["/", ""];
    const titles = ["Home", "Logout"];

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>

            <Box sx={{ flexGrow: 1 }}>
                {
                    isMobile ? <MenuBar open={open} toggleDrawer={toggleDrawer}></MenuBar> : ""
                }
                <CssBaseline></CssBaseline>
                <AppBar position="relative" color="primary">
                    <Toolbar>
                        {
                            isMobile ? <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton> : ""
                        }

                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Speed
                        </Typography>
                        {
                            !isMobile ? <div>{titles.map((text, index) => (
                                <Button color="inherit" href={routes[index]} key={index} onClick={async () => {
                                    if (text === "Logout") {
                                        await logout();
                                        navigate("/login");
                                    }
                                }}>{text}</Button>
                            ))}</div> : ""
                        }
                    </Toolbar>
                </AppBar>
            </Box>
            <Outlet></Outlet>
        </>
    )
}

export default Header;