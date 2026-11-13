import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe('Todos API', () => {
    let authCookie: string;
    let createdTaskId: number;
    beforeAll(async () => {
        const uniqueName = `todouser_${Date.now()}`;
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: uniqueName,
                email: `${uniqueName}@example.com`,
                password: 'Password123!'
            });
        const cookies = res.headers['set-cookie'];
        authCookie = Array.isArray(cookies) ? cookies.join(';') : String(cookies);
    })
    it('GET /todos should reject unauthenticated requests with 401', async () => {
        const res = await request(app).get('/todos');
        expect(res.status).toBe(401);
    });
    it('POST /todos should create a new task with status 201', async () => {
        const newTask = {
            name: "Buy Grocceries",
            priority: 'high',
            tag: 'personal',
        };
        const res = await request(app)
            .post('/todos')
            .set('Cookie', authCookie)
            .send(newTask);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe("Buy Grocceries");
        expect(res.body.priority).toBe('high');
        expect(res.body.completed).toBe(false);
        // Save the taskId for subsequent tests!
        createdTaskId = res.body.id;
    })
})