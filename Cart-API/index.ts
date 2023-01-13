import express, { Application, Request, Response } from 'express';
import { itemRouter } from './routes';

const app:Application = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//if in url you type in /items, go to item router and itemRouter will know what to do (GET, POST, PUT, etc.)
app.use("/items", itemRouter);

//listen takes 2 parameters ; what port to run on and 2) whenit starts successful, what should it do? We want it to console.log "listening on port __.""
app.listen(port, ():void => {
    console.log(`Listening on port ${port}`);
});
