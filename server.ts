import express, { type Express, type Request, type Response } from 'express';
// creates express application
const app: Express = express();

type Todo = {
    id : number,
    name : string,
    completed : boolean
}


const todoList : Todo[] = [
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
    res.json(todoList)
})
// get request handler at todos route with an id
app.get('/todos/:id',(req: Request, res: Response)=> {
    const result = todoList.find(todo => todo.id === Number(req.params.id));
    if(result){
        res.json(result)
    }else{
        res.status(404).send("No such task")
    }
    
})

//  server start
app.listen(3000, ()=>{
    console.log("server running at http://localhost:3000")
});