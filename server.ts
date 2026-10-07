import express, { type Express, type Request, type Response } from 'express';
import { deleteTodo, getAllTodos, getTodo, patchTodo, postTodo } from './todoRepository.ts';
import cors from 'cors';
import { createUser , DuplicateUserError, findUserByName } from './userRepository.ts';
import argon2 from 'argon2';
// creates express application
const app: Express = express();
app.use(cors());
app.use(express.json()); 

const notFoundError = {"error":"Not Found"}
const invalidInputError = {"error":"Invalid input"}
const internalServerError = {"error" : "Something went wrong"}
const invalidCredential = {"error" : "Username or Password is incorrect"}

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
                res.status(404).json(notFoundError)
            }
    } else{
        res.status(400).json(invalidInputError)
    }

    
})

// post request
app.post('/todos',(req:Request,res:Response)=>{
    try{
        
        if(typeof req.body.name === 'string' && req.body.name.trim()){
        const resultRow = postTodo(req.body.name)
        res.status(201).json(resultRow);}
        else{
            res.status(400).json(invalidInputError)
        }
        }
        
    catch(error){
        res.status(500).json(internalServerError);
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
            res.status(404).json(notFoundError)
        }            
        }else{
            res.status(400).json(invalidInputError)
        }

    }catch(error){
        res.status(500).json(internalServerError);
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
                res.status(404).json(notFoundError)
            }
        }else{
            res.status(400).json(invalidInputError)
        }
        
    }catch(error){
        res.status(500).json(internalServerError)
    }
})

// registartion route
app.post('/auth/register',async (req:Request,res:Response)=>{
    try {
        const name = req.body.name
        const password = req.body.password
        if(typeof name !== 'string' || typeof password !== 'string' || (name.trim() ==='' || password.length <8)){
            res.status(400).json(invalidInputError)
        }else{
            const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id
            });
            const result= createUser(name,passwordHash)
            res.status(201).json(result)
        }

    } catch (error) {
        if (error instanceof DuplicateUserError) {
        return res.status(409).json({ "error": error.message }); 
    }
    res.status(500).json(internalServerError);
    }
})

// login route
app.post('/auth/login', async (req: Request , res : Response)=>{
    try {
        const name = req.body.name
        const password = req.body.password        
        if(typeof name !== 'string' || typeof password !== 'string' || (name.trim() ==='' || password.length <8)){
            res.status(400).json(invalidInputError)
        }else{
            const user = findUserByName(name)
            if (!user){
                res.status(401).json(invalidCredential)
            }else{
            const password_hash = user.password_hash
            const isPasswordValid = await argon2.verify(password_hash,password)
            if(isPasswordValid){
                res.status(200).json({
                    id: user.id,
                    name: user.name
                })

            }else{
                res.status(401).json(invalidCredential)
            }
            }
        }        
    } catch (error) {
        if (error instanceof DuplicateUserError) {
        return res.status(409).json({ "error": error.message }); 
    }        
        res.status(500).json(internalServerError);
    }
})

//  server start
app.listen(3000, ()=>{
    console.log("server running at http://localhost:3000")
});