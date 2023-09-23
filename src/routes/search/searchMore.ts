import express from 'express';
import {moreResultsButton} from "../../controllers/search/searchMoreButton.js"


const router = express.Router();
// post is used to create initial query
export const searchMorePost = router.post('/', moreResultsButton

);
// patch is used to load more results
export const searchMorePatch = router.patch('/', moreResultsButton

);



