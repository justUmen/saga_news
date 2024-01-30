import * as React from "react";
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { NewsArticle } from "@/types/newsInterface";
import { useEffect, useState } from "react";

interface MyModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  selectedNews: NewsArticle | null;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// const MyModal = ({ prop1, prop2 }: MyModalProps) => {
const MyModal: React.FC<MyModalProps> = ({
  modalOpen,
  handleCloseModal,
  selectedNews,
}) => {
  // Create a state variable to store the current news article instead of using the selectedNews prop directly.
  // It fixes the issue of the modal not updating when the user clicks on a different article TOO FAST...
  // Bug caused by the animation on modal closing animation (500ms delay)
  const [currentNews, setCurrentNews] = useState<NewsArticle | null>(null);
  useEffect(() => {
    if (modalOpen && selectedNews) {
      setCurrentNews(selectedNews);
    }
  }, [modalOpen, selectedNews]);

  return (
    <Dialog
      open={modalOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseModal}
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      maxWidth="md" // Adjust the size of the modal
    >
      <DialogTitle
        sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
      >
        {currentNews?.title || "..."}
      </DialogTitle>
      <DialogContent dividers>
        {currentNews && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 3,
            }}
          >
            <CardMedia
              component="img"
              sx={{
                maxHeight: { xs: "200px", sm: "400px" },
                maxWidth: "100%",
                width: "auto",
                objectFit: "cover",
                borderRadius: "4px",
              }}
              src={currentNews.urlToImage || "404.png"}
              onError={(e) => {
                const imageElement = e.target as HTMLImageElement;
                imageElement.src = "404.png";
              }}
              alt={currentNews.title}
            />
            <Typography variant="subtitle1">
              By {currentNews.author || "Unknown"}
            </Typography>
            <DialogContentText>{currentNews.description}</DialogContentText>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.open(currentNews?.url, "_blank")}
        >
          Read Full Article
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyModal;
