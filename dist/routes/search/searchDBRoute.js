import express from 'express';
import { SearchPlatform } from "../../controllers/search/searchController.js";
import { moreResultsButton } from "../../controllers/search/searchMoreButton.js";
const router = express.Router();
// post is used to create initial query
export const searchRoutePost = router.post('/', SearchPlatform);
// patch is used to load more results
export const searchRouteGet = router.patch('/', moreResultsButton);
//# sourceMappingURL=searchDBRoute.js.map