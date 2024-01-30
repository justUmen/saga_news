"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useGetTotalSearchValue,
  useSetCurrentSearchValue,
} from "@/redux/hooks";
import { Alert, Grid } from "@mui/material";
import CardNews from "../components/CardNews";
import { NewsArticle } from "@/types/newsInterface";
import FilterForm from "../components/FilterForm";
import MyModal from "../components/MyModal";
import MySnackBar from "../components/MySnackBar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  fetchNewsStart,
  resetError,
  resetNewsData,
} from "@/redux/features/news/newsSlice";
import ScrollToTopButton from "../components/ScrollToTopButton";

const NewsPage = () => {
  // REDUX
  const dispatch = useAppDispatch();
  const { newsData, loading } = useAppSelector((state) => state.news);
  // newsData : represents the data related to news articles that is stored in the Redux store.
  // loading : is a boolean flag indicating whether the news data is currently being fetched or loaded.
  const errorNewsState = useSelector((state: RootState) => state.news.error); //Track the error state (changed by fetchNewsFail in sagas.ts)
  const totalSearchValue = useGetTotalSearchValue(); //Used to check if have fetching to do, or no more results
  const setCurrentSearchValue = useSetCurrentSearchValue();

  // GENERAL
  const [pageNumber, setPageNumber] = useState(1);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const language:string = localStorage.getItem("selectedLanguage") || "en";
    setSelectedLanguage(language);
  }, []);

  // 1 - MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  // onOpenModal causing unnecessary re-renders in CardNews components. use the useCallback hook.
  //  memoizes the function, preventing it from being recreated on every render of the NewsPage component.
  const handleOpenModal = useCallback((newsItem: NewsArticle) => {
    setSelectedNews(newsItem);
    setModalOpen(true);
  }, []); // it doesn't depend on any props or state

  const handleCloseModal = () => {
    setModalOpen(false);
    const timer = setTimeout(() => {
      setSelectedNews(null);
    }, 500); //Give time for the modal to slide down before resetting the modal content
    return () => clearTimeout(timer);
  };

  // 2 - LANGUAGE
  //ON language change, forget about the filter, the search and the local one
  useEffect(() => {
    setFilterValue("");
    setCurrentSearchValue("");
    setLocalSearchQuery(""); 
    // Check if the selectedLanguage is already stored
    const currentLanguage = localStorage.getItem("selectedLanguage");
    if (currentLanguage !== selectedLanguage) {
      // Store the selected language in localStorage only if it's different
      localStorage.setItem("selectedLanguage", selectedLanguage);
    }
  }, [selectedLanguage]);


  // 3 - FILTER / SEARCH (manual search)
  const handleFilterChange = (newFilterValue: string) => {
    setFilterValue(newFilterValue);
    setCurrentSearchValue(newFilterValue);
  };
  const handleSearch = (searchQuery: string) => {
    dispatch(resetError()); //Forget about the error on manual search
    console.log("FETCH !!! Manual search (handleSearch)");
    console.log("Search triggered with query:", searchQuery);
    //TODO : Maybe cleanup the filtered articles there ? get them out of redux ?
    setLocalSearchQuery(searchQuery);
    dispatch(
      fetchNewsStart({
        page: 1,
        query: searchQuery,
        language: selectedLanguage,
      })
    );
    setPageNumber(2); //Just fetched page 1, so next page is 2... Doh !
    //Update localStorage with an arry of searches :
    const searches = JSON.parse(localStorage.getItem("searches") || "[]");
    const updatedSearches = [...searches, searchQuery];
    localStorage.setItem("searches", JSON.stringify(updatedSearches));
  };

  //filteredArticles will recompute every time the page re-renders
  let filteredArticles: NewsArticle[] = [];
  if (newsData && Array.isArray(newsData.articles)) {
    filteredArticles = newsData.articles.filter((article) => {
      const filterLower = filterValue.toLowerCase();
      return (
        article.title.toLowerCase().includes(filterLower) ||
        article.description?.toLowerCase().includes(filterLower)
      );
    });
  }
  const renderNews = () => {
    const articleComponents = filteredArticles.map((article: NewsArticle) => (
      <CardNews
        key={article.url}
        news={article}
        onOpenModal={handleOpenModal}
      />
    ));
    let additionalContent = null;
    if (errorNewsState) {
      // Render an alert message if there is an error
      additionalContent = (
        <Grid item xs={12} sm={12} key={`error-${errorNewsState}`}>
          <Alert severity="error">
            {errorNewsState}, Try again <a href="./">Here</a>
          </Alert>
        </Grid>
      );
    }
    return (
      <>
        {articleComponents}
        {additionalContent}
      </>
    );
  };

  // 4 - FETCH WHEN LANGUAGE CHANGES, OR REFRESH
  useEffect(() => {
    console.log("useEffect 2 : [dispatch, selectedLanguage]");
    console.log("FETCH !!! useEffect [dispatch, selectedLanguage]");
    //At the start, or when language changes, reset the newsData
    dispatch(resetError()); //Forget about the error here if there is
    dispatch(resetNewsData());
    setFilterValue("");
    // Trigger the action when the component mounts or when selectedLanguage changes
    dispatch(
      fetchNewsStart({ page: 1, query: "", language: selectedLanguage })
    );
    setPageNumber(2); // Set to 2 because we're fetching the first page
  }, [dispatch, selectedLanguage]); // Add selectedLanguage as a dependency

  // 5 - SCROLLING
  // checks if the user has scrolled to the bottom of the page.
  const handleScroll = useCallback(() => {
    const buffer = 500;
    if (
      window.innerHeight + document.documentElement.scrollTop + buffer >=
        document.documentElement.offsetHeight &&
      !hasReachedBottom
    ) {
      console.log("handleScroll / useCallback => setHasReachedBottom(true)");
      setHasReachedBottom(true);
    }
  }, [hasReachedBottom]);
  useEffect(() => {
    // console.log("useEffect 1 : [handleScroll]");
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); //avoid memory leaks
  }, [handleScroll]);

  // 6 - FETCH MOAR WHEN REACHING BIKINI BOTTOM
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (hasReachedBottom && !loading && !errorNewsState) {
      // CHECK IF THERE IS MORE TO FETCH
      const RESULTS_PER_PAGE = 20; // Adjust this based on your API's results per page (shoudl match const NB_ITEMS = 20; OFC)
      const totalPages = Math.ceil(totalSearchValue / RESULTS_PER_PAGE);
      // console.log("totalSearchValue : " + totalSearchValue);
      // console.log("totalPages : " + totalPages);
      if (pageNumber <= totalPages || totalSearchValue === 0) {
        //totalSearchValue=0 is not fetching anything yet
        // !!! DO NOT TRY TO FETCH MORE ON ERROR ON REDUX STATE !!!
        // Delay the fetching logic to be safe
        timeoutId = setTimeout(() => {
          console.log("Delayed FETCH triggered [hasReachedBottom, loading]");
          dispatch(
            fetchNewsStart({
              page: pageNumber,
              query: localSearchQuery,
              language: selectedLanguage,
            })
          );
          setPageNumber((prev) => prev + 1);
          setHasReachedBottom(false);
        }, 300); // 300ms delay
      }
    }

    // Cleanup function to clear the timeout if the component unmounts
    // or if the dependencies change before the timeout completes
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasReachedBottom, loading, dispatch, errorNewsState]);

  // Render news items and handle loading state
  return (
    <>
      <Grid container justifyContent="center" style={{ marginTop: "40px" }}>
        <Grid
          item
          xs={12}
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <FilterForm
            onFilter={handleFilterChange}
            onSearch={handleSearch}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </Grid>
        <Grid container spacing={2}>
          {renderNews()}
        </Grid>
      </Grid>
      <MyModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        selectedNews={selectedNews}
      />
      <MySnackBar />
      <ScrollToTopButton />
    </>
  );
};

export default NewsPage;
