import { useNavigate } from "react-router-dom";
import { Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { Home as HomeIcon, Logout as LogoutIcon } from "@mui/icons-material";
import useLogout from "../Hooks/useLogout";

const MenuBar = ({ open, toggleDrawer }) => {
    const logout = useLogout();
    const navigate = useNavigate();

    const routes = ["/"];

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            <List>
                {["Home"].map((text, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton href={routes[index]}>
                            <ListItemIcon>
                                {index === 0 ? <HomeIcon /> : ''}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItemButton onClick={async () => {
                    await logout();
                    navigate("/login");
                }}>
                    <ListItemIcon>
                        <LogoutIcon></LogoutIcon>
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={toggleDrawer(false)}
        >
            {list()}
        </Drawer>
    );
}

export default MenuBar;