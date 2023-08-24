import express from 'express';
import { getSearchTwitterDatabase } from "../controllers/twitter/searchTwitterController.js";
import { moreResultsButton } from "../controllers/twitter/searchTwiterMoreButton.js";
const router = express.Router();
// post is used to create initial query
export const searchRoutePost = router.post('/', getSearchTwitterDatabase);
// patch is used to load more results
export const searchRouteGet = router.patch('/', moreResultsButton);
//# sourceMappingURL=searchDBRoute.js.map