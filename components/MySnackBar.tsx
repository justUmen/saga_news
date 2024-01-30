import { Alert, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { RootState } from "@/redux/store";
import { memo } from "react";

const MySnackBar = () => {
    const error = useSelector((state: RootState) => state.news.error);
    const [open, setOpen] = useState(Boolean(error));

    useEffect(() => {
        setOpen(Boolean(error));
    }, [error]);


    if (!error) {
        return null;
    }

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            onClose={(event, reason) => {
                setOpen(false);
              }}
            autoHideDuration={6000}
        >
            <Alert severity="error" variant="filled">{error}</Alert>
        </Snackbar>
    );
};

export default memo(MySnackBar);
