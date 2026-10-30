import { Router, type Request, type Response } from 'express';
import { unauthorized, internalServerError, notFoundError, invalidInputError } from "../error/error.ts";
import { authenticate } from "../middleware/middleware.ts";
import { getAllTodos, getTodo, postTodo, patchTodo, deleteTodo } from "../repositories/todoRepository.ts";
import { createTodoSchema, updateTodoSchema } from "../schema/schema.ts";

export const todosRouter = Router();
todosRouter.use(authenticate);

// get request handler at todos route
todosRouter.get('/', (req: Request, res: Response) => {
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
todosRouter.get('/:id', (req: Request, res: Response) => {
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
todosRouter.post('/', (req: Request, res: Response) => {
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

todosRouter.patch('/:id', (req: Request, res: Response) => {
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
todosRouter.delete("/:id", (req: Request, res: Response) => {
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