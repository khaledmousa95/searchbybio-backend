// create a connection the rds mysql database
import express from 'express';
import * as dotenv from 'dotenv';
// import { PrismaClient } from '@prisma/client';
import { channel } from 'diagnostics_channel';
import { searchRouteGet, searchRoutePost} from './routes/searchDBRoute.js';
import {errorHandler} from "./middleware/errorMiddleware.js"
import * as cors from "cors"
// const prisma = new PrismaClient();
const app = express();
const port = 5000;

//open cors for all origins
app.use(cors.default());
dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/search', searchRouteGet,searchRoutePost);
// console.log("index.ts: app.use('/api/search', searchRoute);");
// app.use(errorHandler)
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
