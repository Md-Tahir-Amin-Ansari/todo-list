/**
 * @file middleware.ts
 * @brief Contains all middlewares
 * @details Contains authenticate to validate session.
 */

import type { Request, Response, NextFunction } from 'express';
import { validateSession } from '../repositories/sessionRepository.ts';
import { unauthorized } from '../error/error.ts';

/**
 * @brief Extends Express's global Request interface to include the authenticated `user_id`.
 */
declare global {
    namespace Express {
        interface Request {
            user_id?: number; // use string or number depending on what validateSession returns
        }
    }
}


/**
 * @brief Middleware that validates session authenticity via cookies.
 * @details Reads the `sessionID` from incoming cookies, verifies it with `validateSession`,
 *          and attaches the resolved `user_id` to the request before proceeding.
 * @param req Incoming Express request containing cookies.
 * @param res Outgoing Express response used to send error responses.
 * @param next Callback to pass control to the next handler in the pipeline.
 * @returns void
 * @throws 401 Unauthorized if the cookie is missing or the session is invalid/expired.
 * @note Injects `req.user_id` on successful validation
 */
export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // 1. Read the session ID from the cookie.
    if (!req.cookies || !req.cookies.sessionID) {
        res.status(401).json(unauthorized);
        return;
    }
    const sessionID = req.cookies.sessionID
    // 2. Validate the session.
    const result = validateSession(sessionID)
    // 3. Reject the request if invalid.
    if (result !== undefined) {
        req.user_id = result
        next()
    }
    // 4. Otherwise, call next().
    else {
        res.status(401).json(unauthorized)
    }
}
