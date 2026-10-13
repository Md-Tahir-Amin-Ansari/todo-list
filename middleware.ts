import type { Request, Response, NextFunction } from 'express';
import { validateSession } from './sessionRepository.ts';

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // 1. Read the session ID from the cookie.
    if(!req.cookies || !req.cookies.sessionID){
        return res.status(401).json({error:"Unauthorized"})
    }
    const sessionID = req.cookies.sessionID
    // 2. Validate the session.
    const result = validateSession(sessionID)
    // 3. Reject the request if invalid.
    if(result !== undefined){
        req.user_id = result
        next()
    }
    // 4. Otherwise, call next().
    else{
        res.status(401).json({error:"Unauthorized"})
    }
}
