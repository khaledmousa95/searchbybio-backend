import express from 'express';
import {getSearchTwitterDatabase} from "../controllers/twitter/searchTwitterController.js"
import {moreResultsButton} from "../controllers/twitter/searchTwiterMoreButton.js"


const router = express.Router();
// post is used to create initial query
export const searchMorePost = router.post('/', moreResultsButton

);
// patch is used to load more results
export const searchMorePatch = router.patch('/', moreResultsButton

);



