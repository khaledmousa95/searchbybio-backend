import express from 'express';
import {SearchPlatform} from "../controllers/search/searchController.js"
import {moreResultsButton} from "../controllers/search/searchMoreButton.js"
import { authenticateJWT } from '../middleware/Auth.js';


const router = express.Router();
// post is used to create initial query
router.post('/', SearchPlatform);
// patch is used to load more results
router.patch('/more',authenticateJWT ,moreResultsButton);

export default router;


