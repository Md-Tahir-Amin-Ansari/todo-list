import { db } from './database.ts';

export function createSession(user_id: number): [string,number] | undefined{
    // insert into session table and return its session id
    const statement = db.prepare(`INSERT INTO sessions (user_id) VALUES (?) RETURNING id,expires_at`)
    const result = statement.get(user_id) as { id: string; expire_at: number } | undefined;
    if(result && typeof result.id ==='string'){
        return [result.id , result.expire_at]     
    }else{
        return undefined
    }
}
