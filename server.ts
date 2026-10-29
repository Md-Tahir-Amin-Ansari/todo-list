import express, { type Express, type Request, type Response } from 'express';
import { deleteTodo, getAllTodos, getTodo, patchTodo, postTodo } from './todoRepository.ts';
import cors from 'cors';
import { createUser, DuplicateUserError, findUserById, findUserByName } from './userRepository.ts';
import { createSession, logout } from './sessionRepository.ts';
import argon2 from 'argon2';
import cookieParser from 'cookie-parser';
import { authenticate } from './middleware.ts';
import { updateTodoSchema, createTodoSchema } from './schema.ts';


// creates express application
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())

const notFoundError = { "error": "Not Found" }
const invalidInputError = { "error": "Invalid input" }
const internalServerError = { "error": "Something went wrong" }
const invalidCredential = { "error": "Username or Password is incorrect" }
const unauthorized = { "error": "Unauthorized" }

//routes
// get request handler at default home route
app.get('/', authenticate, (req: Request, res: Response) => {
    res.send('Hello World!');
});
// get request handler at todos route
app.get('/todos', authenticate, (req: Request, res: Response) => {
    try {
        if (req.user_id) {
            const result = getAllTodos(req.user_id)
            res.json(result)
        } else {
            return res.status(401).json(unauthorized)
        }
    } catch (error) {
        res.status(500).json(internalServerError)
    }

})
// get request handler at todos route with an id
app.get('/todos/:id', authenticate, (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (Number.isInteger(id) && id > 0) {
            if (req.user_id) {
                const result = getTodo(id, req.user_id)
                if (result) {
                    res.json(result)
                } else {
                    res.status(404).json(notFoundError)
                }
            } else {
                return res.status(401).json(unauthorized)
            }

        } else {
            res.status(400).json(invalidInputError)
        }

    } catch (error) {
        res.status(500).json(internalServerError)
    }


})

// post request
app.post('/todos', authenticate, (req: Request, res: Response) => {
    try {
        const todos = req.body
        const parsed = createTodoSchema.safeParse(todos);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }

        if (!req.user_id) {
            return res.status(401).json(unauthorized);
        }

        const resultRow = postTodo(req.user_id, parsed.data);
        res.status(201).json(resultRow);
    }

    catch (error) {
        res.status(500).json(internalServerError);
    }
})

// patch route

app.patch('/todos/:id', authenticate, (req: Request, res: Response) => {
    try {
        const todos = req.body
        const todosId = Number(req.params.id);
        if (!Number.isInteger(todosId) || todosId <= 0) {
            return res.status(400).json(invalidInputError);
        }

        if (!req.user_id) {
            return res.status(401).json(unauthorized);
        }

        const parsed = updateTodoSchema.safeParse(todos);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }

        const result = patchTodo(todosId, req.user_id, parsed.data);
        if (result) {
            const updated = getTodo(todosId, req.user_id);
            res.status(200).json(updated);
        } else {
            res.status(404).json(notFoundError);
        }

    } catch (error) {
        res.status(500).json(internalServerError);
    }

})

// Delete route
app.delete("/todos/:id", authenticate, (req: Request, res: Response) => {
    try {
        if (req.user_id) {
            const id = Number(req.params.id)
            if (Number.isInteger(id) && id > 0) {
                const result = deleteTodo(id, req.user_id)
                if (result) {
                    res.status(200).json({ message: "Task deleted successfully" })
                } else {
                    res.status(404).json(notFoundError)
                }
            } else {
                res.status(400).json(invalidInputError)
            }
        } else {
            return res.status(401).json(unauthorized)
        }


    } catch (error) {
        res.status(500).json(internalServerError)
    }
})

// registartion route
app.post('/auth/register', async (req: Request, res: Response) => {
    try {
        const name = req.body.name
        const password = req.body.password
        if (typeof name !== 'string' || typeof password !== 'string' || (name.trim() === '' || password.length < 8)) {
            return res.status(400).json(invalidInputError)
        } else {
            const passwordHash = await argon2.hash(password, {
                type: argon2.argon2id
            });
            const user = createUser(name, passwordHash)
            const sessionResult = createSession(user.id)
            if (sessionResult) {
                const [sessionID, expire_at] = sessionResult
                // return cookie
                res.cookie("sessionID", sessionID, {
                    httpOnly: true,
                    sameSite: "lax",
                    expires: new Date(expire_at * 1000)
                })
                res.status(201).json({
                    id: user.id,
                    name: user.name,
                })
            } else {
                return res.status(500).json(internalServerError);
            }


        }

    } catch (error) {
        if (error instanceof DuplicateUserError) {
            return res.status(409).json({ "error": error.message });
        }
        res.status(500).json(internalServerError);
    }
})

// login route
app.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const name = req.body.name
        const password = req.body.password
        // check in db if the name exists
        if (typeof name !== 'string' || typeof password !== 'string' || (name.trim() === '' || password.length < 8)) {
            return res.status(400).json(invalidInputError)
        } else {
            const user = findUserByName(name)
            // if it doesnt exist return invalid credential
            if (!user) {
                return res.status(401).json(invalidCredential)
            } else {
                // if user exist check if password amtches with input password via hash
                const password_hash = user.password_hash
                const isPasswordValid = await argon2.verify(password_hash, password)

                if (isPasswordValid) {
                    const sessionResult = createSession(user.id)
                    // if password correct create a new session with expire set
                    if (sessionResult) {
                        const [sessionID, expire_at] = sessionResult
                        // return cookie
                        res.cookie("sessionID", sessionID, {
                            httpOnly: true,
                            sameSite: "lax",
                            expires: new Date(expire_at * 1000)
                        })
                        res.status(200).json({
                            id: user.id,
                            name: user.name,
                        })
                    } else {
                        return res.status(500).json(internalServerError);
                    }


                } else {
                    return res.status(401).json(invalidCredential)
                }
            }
        }
    } catch (error) {
        res.status(500).json(internalServerError);
    }
})

// logout route
app.post('/auth/logout', authenticate, (req: Request, res: Response) => {
    try {
        const sessionID = req.cookies.sessionID
        const result = logout(sessionID)
        res.clearCookie("sessionID", {
            path: "/",
            httpOnly: true,
            sameSite: "lax"
        })
        if (result) {
            return res.status(200).json({ message: "Logout successful" })
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        res.status(500).json(internalServerError);
    }
})

app.get('/auth/me', authenticate, (req: Request, res: Response) => {
    try {
        if (!req.user_id) return res.status(401).json(unauthorized);
        const user = findUserById(req.user_id);
        if (!user) return res.status(401).json(unauthorized);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(internalServerError);
    }
})

//  server start
app.listen(3000, () => {
    console.log("server running at http://localhost:3000")
});