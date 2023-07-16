import express from "express";
import { createDraft, getStatus, joinDraft, pick } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.post("/api/create", createDraft);
app.post("/api/join", joinDraft);
app.post("/api/pick", pick);
app.post("/api/getStatus", getStatus);
app.listen(port, () => console.log(`Server listening on ${port}`));
