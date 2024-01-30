import { call, put, takeLatest, delay } from "redux-saga/effects";
import { NewsData, NewsError } from "@/types/newsInterface";
import {
  fetchNewsStart,
  fetchNewsSuccess,
  fetchNewsFail,
} from "@/redux/features/news/newsSlice";
import { ServerActionfetchNews } from "@/services/ServerActionfetchNews";
import { setValueTotalSearch } from "@/redux/features/news/totalSearchSlice";

// LIST OF ERRORS FROM API ?
// 1 - REACH MAXIMUM RESULTS / DAY ON API
// EXAMPLE : {"status":"error","code":"maximumResultsReached","message":"You have requested too many results. Developer accounts are limited to a max of 100 results. You are trying to request results 160 to 180. Please upgrade to a paid plan if you need more results."}

function* fetchNewsSaga(action: any) {
  const { page, query, language } = action.payload;

  // 1 - Check for no internet connection
  if (!navigator.onLine) {
    console.log("No internet : ");
    yield put(fetchNewsFail("No internet connection available."));
    return;
  }

  try {
    const result: NewsData | NewsError = yield call(
      ServerActionfetchNews,
      page,
      query,
      language
    );

    // If the result is an error
    if ("error" in result) {
      // Handle "please wait" error specifically with retries
      if (result.error === "please wait") {
        yield* handlePleaseWaitError(action, result.error);
      } else if (result.error === "network error") { //This but not only this
        // yield put(fetchNewsFail(`${result.name} : ${result.error}`));
        yield put(fetchNewsFail(`${result.name} : ${result.error}`));
        return;
      } else {
        // Handle other errors
        yield put(fetchNewsFail(`${result.name} : ${result.error}`)); //UNKNOWN
        return;
      }
    } else {
      // If result is not an error, it should be NewsData
      const data: NewsData = result;
      yield put(setValueTotalSearch(data.totalResults));
      yield put(fetchNewsSuccess(data));
      return; // Exit on success
    }
  } catch (error: any) {
    console.log("error:" + error);
    console.log("error.code : " + error.code);
    // Handle thrown errors...
  }
}

// Separate generator function to handle "please wait" error with X retries before failing for real :p
function* handlePleaseWaitError(action: any, errorMessage: string) {
  let attempts = 0;
  const maxAttempts = 6; //6 seconds, API limit is 5 seconds
  while (attempts < maxAttempts) {
    attempts++;
    console.log(
      `Attempt ${attempts} failed with '${errorMessage}', retrying...`
    );
    yield delay(1000); // Wait for 1 second before retrying

    try {
      const result: NewsData | NewsError = yield call(
        ServerActionfetchNews,
        action.payload.page,
        action.payload.query,
        action.payload.language
      );

      if ("error" in result && result.error === "please wait") {
        continue; // Continue retrying if "please wait" error persists
      } else if ("error" in result) {
        yield put(fetchNewsFail(`UNKNOWN ${result.name} : ${result.error}`));
        return; // Exit on other errors
      } else {
        // If result is not an error, it should be NewsData
        const data: NewsData = result;
        yield put(setValueTotalSearch(data.totalResults));
        yield put(fetchNewsSuccess(data));
        return; // Exit on success
      }
    } catch (error: any) {
      console.log("Retry error:" + error);
      // Handle errors that might occur during retry
    }
  }

  // If max attempts reached without success, just give up...
  yield put(fetchNewsFail("Failed to fetch news after multiple attempts."));
}

export default function* rootSaga() {
  console.log("rootSaga");
  yield takeLatest(fetchNewsStart.type, fetchNewsSaga);
}
