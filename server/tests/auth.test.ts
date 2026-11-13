import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.ts';

describe('Auth API', () => {
    const uniqueName = `user_${Date.now()}`;
    const testUser = {
        name: uniqueName,
        email: `${uniqueName}@example.com`,
        password: 'Password123!',
    };
    let sessionCookie: string;
    it('should return 401 when accessing /auth/me without a session cookie', async () => {
        const res = await request(app).get('/auth/me')
        expect(res.status).toBe(401)
    })
    it('should register a new user with status 201 and return user data', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(testUser);
        const cookies = res.headers['set-cookie'];
        // there should be a cookie
        expect(cookies).toBeDefined();
        // 2. Extract cookie string and verify it contains sessionID
        const cookieStr = Array.isArray(cookies) ? cookies.join(';') : String(cookies);
        expect(cookieStr).toContain('sessionID=')
        // 3. Save it for the next test!
        sessionCookie = cookieStr;
        // status check
        expect(res.status).toBe(201);
        // response check
        expect(res.body.name).toBe(testUser.name);
        expect(res.body.email).toBe(testUser.email);
        expect(res.body).toHaveProperty('id');

    })
    it('should return 200 and user profile when accessing /auth/me with session cookie', async () => {
        const res = await request(app)
            .get('/auth/me')
            .set('Cookie', sessionCookie);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe(testUser.name);
        expect(res.body.email).toBe(testUser.email)
    })
    it('should reject duplicate username with 409 Conflict', async () => {
        // Try sending testUser again!
        const res = await request(app)
            .post('/auth/register')
            .send(testUser);

        // Assert status is 409
        expect(res.status).toBe(409);
    });

    it.each([
        {
            scenario: 'missing username',
            payload: { email: 'test@example.com', password: 'Password123!' },
        },
        {
            scenario: 'invalid email format',
            payload: { name: 'validuser', email: 'not-an-email', password: 'Password123!' },
        },
        {
            scenario: 'password too short (< 8 chars)',
            payload: { name: 'validuser', email: 'test@example.com', password: '123' },
        },
    ])('should reject registration when $scenario with 400', async ({ payload }) => {
        const res = await request(app)
            .post('/auth/register')
            .send(payload);

        expect(res.status).toBe(400);
    });
    it('should successfully login a previously registered user and response witha valid cookie', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send(testUser)
        expect(res.status).toBe(200)
        expect(res.body.name).toBe(testUser.name)
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
    })
    it('should successfully reject an invalid user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ name: testUser.name, password: 'WrongPassword999!' })
        expect(res.status).toBe(401)
    })

    it('should logout user and revoke the active session cookie', async () => {
        // 1. Send logout with the active session cookie
        const logoutRes = await request(app)
            .post('/auth/logout')
            .set('Cookie', sessionCookie);

        expect(logoutRes.status).toBe(200);
        expect(logoutRes.body.message).toBe('Logout successful');

        // 2. Security verification: Ensure the revoked session can no longer access /auth/me
        const verifyRes = await request(app)
            .get('/auth/me')
            .set('Cookie', sessionCookie);

        expect(verifyRes.status).toBe(401);
    });
})

