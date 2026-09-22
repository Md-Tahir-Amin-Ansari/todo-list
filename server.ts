import express, { type Express, type Request, type Response } from 'express';
// creates express application
const app: Express = express();

type todo = {
    id : number,
    name : string,
    completed : boolean
}


const TodoList : todo[] = [
    {
        id:1,
        name:"Morning Grindset",
        completed: true
    },
    {
        id:2,
        name : "Share 5 patrick bateman quotes (which he never actually said)",
        completed : false
    },
    {
        id:3,
        name : "say woman ☕ to some random woman to assert dominance (then wonder why woman avoids you)",
        completed: false
    }
]

//routes
// get request handler at default home route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
// get request handler at todos route
app.get('/todos',(req: Request, res: Response)=> {
    res.json(TodoList)
})


//  server start
app.listen(3000, ()=>{
    console.log("server running at http://localhost:3000")
});