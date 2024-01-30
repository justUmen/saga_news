"use client";
import { useState } from "react";
import {
  SwipeableDrawer,
  IconButton,
  Avatar,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TerminalIcon from "@mui/icons-material/Terminal";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import CottageIcon from "@mui/icons-material/Cottage";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useGetUsernameValue, useSetUsernameValue } from "@/redux/hooks";
import { useSetCurrentSearchValue, useGetCurrentSearchValue } from "@/redux/hooks";
import SearchHistory from "./SearchHistory";

function LeftSideMenu() {
  const [open, setOpen] = useState(false);
  const router = usePathname();

  const getUsernameValue = useGetUsernameValue();
  const setUsernameValue = useSetUsernameValue();

  // Local state synchronized with the global username state
  const [localUsername, setLocalUsername] = useState(getUsernameValue);

  const handleInputChangeSyncReduxUsername = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalUsername(event.target.value);
  };

  const handleUsernameChange = (event: React.FormEvent) => {
    event.preventDefault();
    setUsernameValue(localUsername);
  };

  const toggleDrawer =
    (open: boolean | ((prevState: boolean) => boolean)) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(open);
    };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const closeSideMenu = () => {
    setOpen(false);
  };

  const links = [
    { name: "Home", href: "/", icon: <CottageIcon /> },
    // { name: "Linux", href: "/linux", icon: <TerminalIcon /> },
    // { name: "Interpol", href: "/interpol", icon: <LocalPoliceIcon /> },
  ];

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {links.map((link) => (
          // <Link href={link.href} key={link.name} passHref>
            <ListItem
              key={link.name} 
              style={{
                backgroundColor:
                  router === link.href ? "#e3f2fd" : "transparent",
                color: router === link.href ? "#1565c0" : "black",
                cursor: "pointer",
                padding: "10px 20px",
                borderRadius: "5px",
                margin: "5px 0",
                transition: "background-color 0.3s",
              }}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.name} />
            </ListItem>
          // </Link>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <IconButton
        onClick={handleToggle}
        style={{
          left: "20px",
          top: "10px",
          position: "fixed",
          zIndex: 1000,
          backgroundColor: "#1976d2",
          color: "white",
        }}
        edge="start"
        color="inherit"
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor={"left"}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div>
            {/* <SearchBar onSearch={closeSideMenu} /> */}

            {list()}
            <SearchHistory />
          </div>
          <div style={{ marginTop: "auto", padding: "10px" }}>
            {/* User section */}
            <Typography variant="h6">Redux :</Typography>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
              <Typography variant="body1">{getUsernameValue}</Typography>
            </div>
            <form onSubmit={handleUsernameChange}>
              <TextField
                label="Change Name"
                variant="outlined"
                size="small"
                value={localUsername}
                onChange={handleInputChangeSyncReduxUsername}
                style={{ marginTop: "10px", width: "100%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="submit"
                        onClick={handleUsernameChange}
                      >
                        <KeyboardReturnIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
}

export default LeftSideMenu;
