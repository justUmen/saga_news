import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NewsArticle } from "@/types/newsInterface";
import { memo, useRef } from "react";
import useElementVisibility from "../hooks/useElementVisibility";

import { Grid, Grow } from "@mui/material";

export interface Prop {
  news: NewsArticle;
  onOpenModal: (newsItem: NewsArticle) => void;
}

function CardNews({ news, onOpenModal }: Prop) {
  const cardRef = useRef(null);
  const isVisible = useElementVisibility(cardRef);
  // BUG 1 : Sometimes the image link is bad or the image is not available (Or the website is sending a redirection to an html instead of an image)
  // Solution : Use the onError event on CardMedia to change the src to a default image (404.png)
  // Same fallback image for no image or error
  console.log(
    "CardNews" +
      " : " +
      (typeof window !== "undefined" ? "[Client]" : "[Server]")
  );
  return (
    <Grid item xs={12} sm={3}>
      <Grow in={isVisible} style={{ transformOrigin: "0 0 0" }} timeout={1000}>
        <Card
          ref={cardRef}
          sx={{ height: "290px", display: "flex", flexDirection: "column" }}
        >
          <CardMedia
            onClick={() => onOpenModal(news)}
            component="img"
            sx={{ height: "160px", objectFit: "cover" }}
            // image={news.urlToImage || "404.png"}
            src={news.urlToImage || "404.png"}
            onError={(e) => {
              const imageElement = e.target as HTMLImageElement;
              imageElement.src = "404.png";
            }}
            alt={news.title}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              onClick={() => onOpenModal(news)}
              style={{
                maxHeight: "calc(1.4em * 3)",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {news.title}
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    </Grid>
  );
}

export default memo(CardNews); //Skip rerendering if props haven't changed
// export default CardNews;
