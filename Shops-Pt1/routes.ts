import { Router, Request, Response } from 'express';
import { isNumberObject } from 'util/types';
import { Shop } from './shops';

//hard coded data
let shops:Shop[] = [
    {id: 111, name: "Pepper's Pizza", rating: 4.5 },
    {id: 222, name: "Clive's Chives", rating: 3.4 },
    {id: 333, name: "Betty's Brews", rating: 4.3 },
    {id: 444, name: "Sylvester's Shoes", rating: 3.8 },
    {id: 555, name: "Teddy's Tunes", rating: 4.7 },
]

//create a router
export const shopsRouter = Router();

/////// GET ////////

shopsRouter.get("/:id", async (req:Request, res:Response) : Promise<Response> => {
    let findItemById = shops.find((x) => x.id === Number(req.params.id));

    if(findItemById === undefined){
        return res.status(404).send(`"error": "Shop not found: "`);
    }else{
        return res.status(200).json(findItemById);
    }
})

shopsRouter.get("/", async (req:Request, res:Response) : Promise<Response> => {
   
    //http://localhost:3000/shops?minRating=3
    if(req.query.minRating !== undefined){  
        let rating = shops.filter((x) => x.rating >= Number(req.query.minRating));
        return res.status(200).json(rating)
    }
    //name is the parameter
    // http://localhost:3000/shops?name=e
    else if(req.query.name !== undefined){
        let startWithArray= shops.filter((x) => x.name.startsWith(String(req.query.name)));
         return res.status(200).json(startWithArray);
    }else {
         return res.status(200).json(shops);  
         //if they did not give me a parameter, give all the items unfiltered
     }
});

/////// POST ////////

shopsRouter.post("/", async (req:Request, res:Response) : Promise<Response> => {
    let newShops:Shop = {
        id: GetNextId(),
        name: String(req.body.name),
        rating: Number(req.body.rating),
    };
    shops.push(newShops);
    return res.status(201).json(newShops);
});

function GetNextId(){
    //spread operator ... - spreads out an existing Array
    return Math.max(...shops.map((x) => x.id)) + 111;
 }

/////// PUT ////////

shopsRouter.put("/:id", async (req:Request, res:Response) : Promise<Response> => {
    //find the item by the id
let itemFound = shops.find((x) => x.id === Number(req.params.id));
    //update the properties of the item based on what is sent in the body of the request
if(itemFound !== undefined){
    itemFound.name = String(req.body.name);
    itemFound.rating = Number(req.body.rating);

    return res.status(200).json(itemFound);
}
else{
    return res.status(400).send("Not Found");
}
});

/////// DELETE ////////

// https://localhost:3000/shops/1
shopsRouter.delete("/:id", async (req:Request, res:Response) : Promise<Response> => {
    let deleteItemById = shops.find((x) => x.id === Number(req.params.id));
    
    if(deleteItemById === undefined){
        return res.status(404).send("This does not exist.");
    }
    else{
    shops = shops.filter((x) => x.id !== Number(req.params.id));
    console.log(shops);
      return res.status(204).send("Deleted");
    }
     })