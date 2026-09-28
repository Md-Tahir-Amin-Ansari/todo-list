import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
// creates express application
const app: Express = express();
app.use(cors());
app.use(express.json()); 
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

// post request
app.post('/todos',(req:Request,res:Response)=>{
    try{
        if(typeof req.body.name === 'string' && req.body.name.trim()){
            const newTask  = {
            id : todoList.length+1,
            name: req.body.name,
            completed: false
        };
        todoList.push(newTask)
        res.status(201).json(newTask);}
        else{
            res.status(400).send("Empty Name")
        }
        }
        
    catch(error){
        res.status(500).send("Failed to create todo");
    }
})

// patch route

app.patch('/todos/:id',(req:Request,res:Response)=>{
    try{
        const todo = todoList.find(todo => todo.id === Number(req.params.id));
        if(todo){
            if ( typeof req.body.completed === "boolean"){
                todo.completed = req.body.completed
                res.status(200).json(todo)
            }else{
                res.status(400).send("Completed is not boolean")
            }
        }else{
            res.status(404).send("Todo not found")
        }
    }catch(error){
        res.status(500).send("Failed to update todo");
    }
    
})

// Delete route
app.delete("/todos/:id",(req:Request,res:Response)=>{
    try{
        const index = todoList.findIndex(item => item.id === Number(req.params.id))
        if(index === -1){
            res.status(404).send("Task Not Found")
        }else{
            todoList.splice(index,1)
            res.status(200).send("Task Deleted Sucessfully")
        }
    }catch(error){
        res.status(500).send("Failed to delete tasks")
    }
})

//  server start
app.listen(3000, ()=>{
    console.log("server running at http://localhost:3000")
});