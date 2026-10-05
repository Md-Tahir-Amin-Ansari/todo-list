import express, { type Express, type Request, type Response } from 'express';
import { deleteTodo, getAllTodos, getTodo, patchTodo, postTodo } from './todoRepository.ts';
import cors from 'cors';
// creates express application
const app: Express = express();
app.use(cors());
app.use(express.json()); 


//routes
// get request handler at default home route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
// get request handler at todos route
app.get('/todos',(req: Request, res: Response)=> {
    const result = getAllTodos()
    res.json(result)
})
// get request handler at todos route with an id
app.get('/todos/:id',(req: Request, res: Response)=> {
    const id = Number(req.params.id)
    if(Number.isInteger(id) && id>0){
            const result = getTodo(id)
            if(result){
                res.json(result)
            }else{
                res.status(404).send("No such task")
            }
    } else{
        res.status(400).send("Invalid Input")
    }

    
})

// post request
app.post('/todos',(req:Request,res:Response)=>{
    try{
        
        if(typeof req.body.name === 'string' && req.body.name.trim()){
        const resultRow = postTodo(req.body.name)
        res.status(201).json(resultRow);}
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
        const completed = req.body.completed
        const id = Number(req.params.id)
        if  ( typeof completed === "boolean" && Number.isInteger(id) && id>0){
        const result = patchTodo(id,completed )

        if(result){
            const resultRow =getTodo(id)
            res.status(200).json(resultRow)
        }else{
            res.status(404).send("Todo not found")
        }            
        }else{
            res.status(400).send("Input not valid")
        }

    }catch(error){
        res.status(500).send("Failed to update todo");
    }
    
})

// Delete route
app.delete("/todos/:id",(req:Request,res:Response)=>{
    try{
        const id = Number(req.params.id)
        if(Number.isInteger(id) && id>0){
            const result = deleteTodo(id)
            if(result){
                res.status(200).send("Task Deleted Sucessfully")
            }else{
                res.status(404).send("Task Not Found")
            }
        }else{
            res.status(400).send("Invalid Input")
        }
        
    }catch(error){
        res.status(500).send("Failed to delete tasks")
    }
})

//  server start
app.listen(3000, ()=>{
    console.log("server running at http://localhost:3000")
});