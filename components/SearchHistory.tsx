import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

const SearchHistory = () => {
  // Retrieve the search history from localStorage and display it in a List/ListItem
  const searches = JSON.parse(localStorage.getItem("searches") || "[]");
  return (
    <div>
      <Typography
        variant="h6"
        style={{ marginBottom: "10px", marginLeft: "10px" }}
      >
        Search History
      </Typography>
      {searches.length === 0 ? (
        <Typography>No search history found.</Typography>
      ) : (
        <List>
          {searches.map((search: String, index: number) => (
            <ListItem key={index}>
              <Typography>{search}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default SearchHistory;
