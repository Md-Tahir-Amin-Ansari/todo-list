import { db } from './database.ts';

export function createSession(user_id: number): string | undefined{
    // insert into session table and return its session id
    const statement = db.prepare(`INSERT INTO sessions (user_id) VALUES (?) RETURNING id`)
    const result = statement.get(user_id)
    if(result && typeof result.id ==='string'){
        return result.id        
    }else{
        return undefined
    }
}
