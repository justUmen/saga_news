// actions.js
const FETCH_NEWS_START = 'FETCH_NEWS_START';
const FETCH_NEWS_SUCCESS = 'FETCH_NEWS_SUCCESS';
const FETCH_NEWS_FAIL = 'FETCH_NEWS_FAIL';

export const fetchNewsStart = () => ({ type: FETCH_NEWS_START });
export const fetchNewsSuccess = (newsItems: any) => ({ type: FETCH_NEWS_SUCCESS, payload: newsItems });
export const fetchNewsFail = (error: any) => ({ type: FETCH_NEWS_FAIL, payload: error });
// fetchNewsStart