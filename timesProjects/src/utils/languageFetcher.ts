import { defaultOption, serverFetcher } from '../utils/fetcher';

export const languageFetcher = async (req: any) => {
  let inCommingURL = new URL(req.url, `http://${req.headers.host}`)
  console.log("getInitialProps", inCommingURL.searchParams.get("language"));
  let language = inCommingURL.searchParams.get("language") ? inCommingURL.searchParams.get("language") : "";
  let translationData = await serverFetcher('/translation?locale='+language, {
    ...defaultOption
  })
  return {
    translationData,
    language,
  };
}
