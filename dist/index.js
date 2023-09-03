// create a connection the rds mysql database
import express from 'express';
import * as dotenv from 'dotenv';
import { searchRouteGet, searchRoutePost } from './routes/searchDBRoute.js';
import { searchMorePost } from './routes/searchMore.js';
import * as cors from "cors";
// const prisma = new PrismaClient();
const app = express();
const port = 5000;
//open cors for all origins
app.use(cors.default());
dotenv.config();
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use('/api/search', searchRouteGet, searchRoutePost);
app.use('/api/search/more', searchMorePost);
// console.log("index.ts: app.use('/api/search', searchRoute);");
// app.use(errorHandler)
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=index.js.map