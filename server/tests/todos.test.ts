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
    it('GET /todos should return all tasks for the authenticated user', async () => {
        const res = await request(app)
            .get('/todos')
            .set('Cookie', authCookie)

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((t: any) => {
            return t.id === createdTaskId
        })).toBe(true);
    })
    it('GET /todos/:id should return the specific task by ID', async () => {
        const res = await request(app)
            .get(`/todos/${createdTaskId}`)
            .set('Cookie', authCookie)
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdTaskId);
        expect(res.body.name).toBe("Buy Grocceries")
    })
    it('PATCH /todos/:id should update task completion status', async () => {
        const res = await request(app)
            .patch(`/todos/${createdTaskId}`)
            .set('Cookie', authCookie)
            .send({ completed: true })
        expect(res.status).toBe(200);
        expect(res.body.completed).toBe(true);
    })
    it('DELETE /todos/:id should delete the task and return 404 on subsequent get', async () => {
        const deleteRes = await request(app)
            .delete(`/todos/${createdTaskId}`)
            .set('Cookie', authCookie);
        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe('Task deleted successfully');
        // Confirm it is gone
        const getRes = await request(app)
            .get(`/todos/${createdTaskId}`)
            .set('Cookie', authCookie);
        expect(getRes.status).toBe(404);
    });
    it('Security: User B should NOT be able to view, edit, or delete User A tasks', async () => {
        // 1. User A creates a task
        const userATaskRes = await request(app)
            .post('/todos')
            .set('Cookie', authCookie)
            .send({ name: 'User A Secret Task', priority: 'high' });
        const userATaskId = userATaskRes.body.id;
        // 2. Register User B and get their cookie
        const userBName = `userB_${Date.now()}`;
        const userBRes = await request(app)
            .post('/auth/register')
            .send({
                name: userBName,
                email: `${userBName}@example.com`,
                password: 'Password123!'
            })
        const userBCookies = userBRes.headers['set-cookie'];
        const userBCookie = Array.isArray(userBCookies) ? userBCookies.join(';') : String(userBCookies);
        // 3. User B attempts to GET User A's task -> 404
        const getRes = await request(app)
            .get(`/todos/${userATaskId}`)
            .set('Cookie', userBCookie)

        expect(getRes.status).toBe(404);
        // 4. User B attempts to Patch User A's task -> 404
        const patchRes = await request(app)
            .patch(`/todos/${userATaskId}`)
            .set('Cookie', userBCookie)
            .send({ name: 'Hacked by User B' })

        expect(patchRes.status).toBe(404);
        // 5. User B attempts to DELETE User A's task -> 404
        const deleteRes = await request(app)
            .delete(`/todos/${userATaskId}`)
            .set('Cookie', userBCookie)

        expect(deleteRes.status).toBe(404);
        // 6. User B lists their own todos -> User A's task should not be in User B's list
        const listRes = await request(app)
            .get(`/todos`)
            .set('Cookie', userBCookie)

        expect(listRes.body.some((t: any) => t.id === userATaskId)).toBe(false);
    })
})