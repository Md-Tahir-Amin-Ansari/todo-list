import express, { type Express, type Request, type Response } from 'express';
import { db } from './database.ts';
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

//routes
// get request handler at default home route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
// get request handler at todos route
app.get('/todos',(req: Request, res: Response)=> {
    const result = db.prepare(`SELECT * FROM todos`).all()
    res.json(result)
})
// get request handler at todos route with an id
app.get('/todos/:id',(req: Request, res: Response)=> {
    const result = db.prepare(`SELECT * FROM todos WHERE id = ?`).get(Number(req.params.id))
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
        const statement = db.prepare(`INSERT INTO todos (name) VALUES (?)`)
        const result = statement.run(req.body.name.trim())
        const responseStatement = db.prepare(`SELECT * FROM todos WHERE id = ?`)
        const resultRow = responseStatement.get(result.lastInsertRowid)
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
        if  ( typeof req.body.completed === "boolean"){
        const result = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`).run(req.body.completed , Number(req.params.id))

        if(result.changes){
            const resultRow = db.prepare(`SELECT * FROM todos WHERE id = ?`).get(Number(req.params.id))
            res.status(200).json(resultRow)
        }else{
            res.status(404).send("Todo not found")
        }            
        }else{
            res.status(400).send("Completed is not boolean")
        }

    }catch(error){
        res.status(500).send("Failed to update todo");
    }
    
})

// Delete route
app.delete("/todos/:id",(req:Request,res:Response)=>{
    try{
        const result = db.prepare(`DELETE FROM todos WHERE id = ?`).run(Number(req.params.id))
        if(result.changes){
            res.status(200).send("Task Deleted Sucessfully")
        }else{
            res.status(404).send("Task Not Found")
        }
    }catch(error){
        res.status(500).send("Failed to delete tasks")
    }
})

//  server start
app.listen(3000, ()=>{
    console.log("server running at http://localhost:3000")
});