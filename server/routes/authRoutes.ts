/**
 * @file authRoutes.ts
 * @brief authentication routes
 * @details Contain resiter, login, logout and me Routes for user mangement.
 */

import { Router, type Request, type Response } from 'express';
import argon2 from 'argon2';
import { createUser, findUserByName, findUserById, DuplicateUserError } from '../repositories/userRepository.ts';
import { createSession, logout } from '../repositories/sessionRepository.ts';
import { authenticate } from '../middleware/middleware.ts';
import { registerSchema, loginSchema } from '../schema/schema.ts';
import { invalidInputError, internalServerError, invalidCredential, unauthorized } from '../error/error.ts';

export const authRouter = Router();

// registartion route
/**
 * @brief Registers a new user.
 * @details Hashes password with Argon2id, persists user to SQLite, initiates a session,
 *          and attaches an HTTP-only session cookie.
 * @param req Incoming Express request containing `{ name, email, password }` in req.body.
 * @param res Outgoing Express response returning status 201 with the created user object.
 * @returns void
 * @throws 400 Bad Request if validation schema fails.
 * @throws 409 Conflict if the username or email already exists.
 * @throws 500 Internal Server Error if hashing or database insertion fails.
 * @note Sets an HTTP-only secure cookie `sessionID` on the client.
 */
authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const user = req.body
        const parsed = registerSchema.safeParse(user)
        if (!parsed.success) {
            return res.status(400).json(invalidInputError)
        } else {
            const { name, email, password } = parsed.data;
            const passwordHash = await argon2.hash(password, {
                type: argon2.argon2id
            });
            const user = createUser(name, email, passwordHash)
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
                    email: user.email
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
/**
 * @brief login user
 * @details login a user by validating their user name and password
 * @param req Incoming Express request containing user name and password
 * @param res Outgoing Express response containing cookie along with user id  and name, 200 Success on logging the user.
 * @returns void
 * @throws 500 Internal Server Error if DB query fails.
 * @throws 400 Internal on invalid input.
 */
authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const userInput = req.body
        const parsed = loginSchema.safeParse(userInput)
        // check in db if the name exists
        if (!parsed.success) {
            return res.status(400).json(invalidInputError)
        } else {
            const { name, password } = parsed.data;
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
/**
 * @brief Logs out the currently authenticated user.
 * @details Removes the active session from the database and clears the `sessionID` cookie.
 * @param req Incoming Express request with `sessionID` cookie.
 * @param res Outgoing Express response returning status 200 with confirmation message.
 * @returns void
 * @throws 401 Unauthorized if the session is invalid or user is unauthenticated.
 * @throws 500 Internal Server Error if DB operation fails.
 * @note Clears the `sessionID` cookie from the client.
 */
authRouter.post('/logout', authenticate, (req: Request, res: Response) => {
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
// me route 
/**
 * @brief tells who is user
 * @details return user details to help on refresh
 * @param req Incoming Express request containing user id in cookie
 * @param res Outgoing Express response containing user data, 200 Return user data.
 * @returns void
 * @throws 500 Internal Server Error if DB query fails.
 * @throws 401 Internal on invalid session.
 */
authRouter.get('/me', authenticate, (req: Request, res: Response) => {
    try {
        if (!req.user_id) return res.status(401).json(unauthorized);
        const user = findUserById(req.user_id);
        if (!user) return res.status(401).json(unauthorized);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(internalServerError);
    }
})
