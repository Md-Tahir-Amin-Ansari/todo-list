import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.ts';
import { email } from 'zod';

describe('Auth API', () => {
    it('should return 401 when accessing /auth/me without a session cookie', async () => {
        const res = await request(app).get('/auth/me')
        expect(res.status).toBe(401)
    })
    it('should register a new user with status 201 and return user data', async () => {
        const uniqueName = `user_${Date.now()}`;
        const newUser = {
            name: uniqueName,
            email: `${uniqueName}@example.com`,
            password: 'Password123$'
        };
        const res = await request(app)
            .post('/auth/register')
            .send(newUser);
        // status check
        expect(res.status).toBe(201);
        // response check
        expect(res.body.name).toBe(newUser.name);
        expect(res.body.email).toBe(newUser.email);
        expect(res.body).toHaveProperty('id')
    })
})

