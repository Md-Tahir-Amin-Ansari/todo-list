/**
 * @file todoRoutes.ts
 * @brief CRUD routes for todos
 * @details Contain GET, GET with id, POST, PATCH and DELETE Routes for todos.
 */

import { Router, type Request, type Response } from 'express';
import { unauthorized, internalServerError, notFoundError, invalidInputError } from "../error/error.ts";
import { authenticate } from "../middleware/middleware.ts";
import { getAllTodos, getTodo, postTodo, patchTodo, deleteTodo } from "../repositories/todoRepository.ts";
import { createTodoSchema, updateTodoSchema } from "../schema/schema.ts";

export const todosRouter = Router();
todosRouter.use(authenticate);


/**
 * @brief get all todos
 * @details get all the todos from the database for the current user
 * @param req Incoming Express request
 * @param res Outgoing Express response containing all the todos of the user
 * @returns void
 * @throws 401 Unauthorized if user_id is missing.
 * @throws 500 Internal Server Error if DB query fails.
 */
todosRouter.get('/', (req: Request, res: Response): void => {
    try {
        if (req.user_id) {
            const result = getAllTodos(req.user_id)
            res.json(result)
            return;
        } else {
            res.status(401).json(unauthorized)
            return;
        }
    } catch (error) {
        res.status(500).json(internalServerError)
    }

})

/**
 * @brief get a single todos by its id.
 * @details get a single todos by its id for the current user
 * @param req Incoming Express request containing the user's session ID in req.user_id and todo's id in req.params.id.
 * @param res Outgoing Express response containing the todo of that id of the user
 * @returns void
 * @throws 401 Unauthorized if user_id is missing.
 * @throws 500 Internal Server Error if DB query fails.
 * @throws 404 If todo not found
 * @throws 400 If todos id is not valid ex. string like abc
 */

todosRouter.get('/:id', (req: Request, res: Response): void => {
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
                res.status(401).json(unauthorized)
                return;
            }

        } else {
            res.status(400).json(invalidInputError)
        }

    } catch (error) {
        res.status(500).json(internalServerError)
    }


})

/**
 * @brief post a single todos by its id.
 * @details post a single todos for the current user
 * @param req Incoming Express request containing the user's session ID in req.user_id and todo's body in req.body (validated by createTodoSchema).
 * @param res  Outgoing Express response returning status 201 with the created todo.
 * @returns void
 * @throws 401 Unauthorized if user_id is missing.
 * @throws 500 Internal Server Error if DB query fails.
 * @throws 404 If todo not found
 * @throws 400 If todos id is not valid ex. string like abc
 */

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

/**
 * @brief patch a single todos by its id.
 * @details patch a single todos by its id for the current user
 * @param req Incoming Express request containing the user's session ID in req.user_id and todo's id in req.params.id.
 * @param res Outgoing Express response containing the todo of that id of the user
 * @returns void
 * @throws 401 Unauthorized if user_id is missing.
 * @throws 500 Internal Server Error if DB query fails.
 * @throws 404 If todo not found
 * @throws 400 If todos id is not valid ex. string like abc
 */
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

/**
 * @brief delete a single todos by its id.
 * @details delete a single todos by its id for the current user
 * @param req Incoming Express request containing the user's session ID in req.user_id and todo's id in req.params.id.
 * @param res Outgoing Express response returning status 200 with a success message.
 * @returns void
 * @throws 401 Unauthorized if user_id is missing.
 * @throws 500 Internal Server Error if DB query fails.
 * @throws 404 If todo not found
 * @throws 400 If todos id is not valid ex. string like abc
 */
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