import { Router, Request, Response } from 'express';
import { arrayBuffer } from 'stream/consumers';
import { Item } from "./item";

//hard coded data
let itemArray:Item[] = [
    {id: 1, quantity:20, price:10, product:"Eggs", isActive:true},
    {id: 2, quantity:15, price:2.50, product:"Avocado", isActive:false},
    {id: 3, quantity:4, price:35, product:"Steak", isActive:true},
    {id: 4, quantity:300, price:25, product:"Chicken", isActive:true},
];

//we created a router 
export const itemRouter = Router();

//Promise - i promise to return an object for the type response. the <> expects a type inside of it
itemRouter.get("/", async (req:Request, res:Response) : Promise<Response> => {

    //if maxPrice exists, i want to filter my item array have it equal maxprice of item.
    //http://localhost:3000/items?maxPrice=10
    if(req.query.maxPrice!==undefined){
        let underArray = itemArray.filter((x) => x.price <= Number(req.query.maxPrice) && x.isActive);
        return res.status(200).json(underArray);
    }
    //prefix is the parameter
    // http://localhost:3000/cart-items?prefix=e 
    else if(req.query.prefix !== undefined){
       let startWithArray= itemArray.filter((x) => x.product.startsWith(String(req.query.prefix)) && x.isActive);
        return res.status(200).json(startWithArray);
    } else if(req.query.pageSize !== undefined){
         //http://localhost:3000/cart-items?pageSize=3
        return res.status(200).json(itemArray.filter((x) => x.isActive).slice(0, Number(req.query.pageSize)));
    }
    else {
        return res.status(200).json(itemArray.filter((x) => x.isActive));  
        //if they did not give me a parameter, give all the items unfiltered
    }
});

////////GET

//URI parameter - used when you want to get one thing -> req.params.__
//find is used to find the first instance of what you're looking for or undefined if it doesn't find the item you're looking for.
itemRouter.get("/:id", async (req:Request, res:Response) : Promise<Response> => {
    let itemIWantToFind = itemArray.find((x) => x.id === Number(req.params.id));
    
    if(itemIWantToFind === undefined){
        return res.status(404).send("ID Not Found");
        //send just shows the message in ()
    }
    else {
        return res.status(200).json(itemIWantToFind);
    }
});

/////////POST

itemRouter.post("/", async (req:Request, res:Response) : Promise<Response> => {
    let newItem:Item = {
        id: GetNextId(),
        product: String(req.body.product),
        price: Number(req.body.price),
        quantity: Number(req.body.quantity)
        isActive: Boolean(req.body.isActive)
    };
    itemArray.push(newItem);
    return res.status(201).json(newItem);
});

////////PUT

itemRouter.put("/:id", async (req:Request, res:Response) : Promise<Response> => {
    //find the item by the id
let itemFound = itemArray.find((x) => x.id === Number(req.params.id));
    //update the properties of the item based on what is sent in the body of the request
if(itemFound !== undefined){
    itemFound.price = Number(req.body.price);
    itemFound.product = String(req.body.product);
    itemFound.quantity = Number(req.body.quantity);

    return res.status(200).json(itemFound);
}
else{
    return res.status(400).send("Not Found");
}
});


function GetNextId(){
    //spread operator ... - spreads out an existing Array
    return Math.max(...itemArray.map((x) => x.id)) + 1;
 }

///////DELETE

// https://localhost:3000/items/1
 itemRouter.delete("/:id", async (req:Request, res:Response) : Promise<Response> => {
let deleteItemById = itemArray.find((x) => x.id === Number(req.params.id));

if(deleteItemById === undefined){
    return res.status(404).send("This does not exist.");
}
else{
  itemArray = itemArray.filter((x) => x.id !== Number(req.params.id));
//can use splice too instead of filter
deleteItemById.isActive = false;
console.log(itemArray);
  return res.status(204).send("Deleted");
  //delete was successful but you won't see the content
}
 })