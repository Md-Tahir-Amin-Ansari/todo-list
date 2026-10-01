# Todo App

Todo App is a light web app for making todo list. It exist to leanr full stack web development.

## Features
- 5 CRUD endpoints
- frontend to enter and update todos

## Tech Stack
- HTML5
- CSS3
- JS
- TS
- Node.js
- Express.js
- SQLite (via Node.js built-in node:sqlite)

## Project Structure
public/
app.js < Frontend js>
index.html < Frontend html>
style.css < style >
server.ts
todoRepostory.ts <all the db function>

## Running Locally

start server :
node server.ts

open frontend :
open index.html in web browser

## API

Method    Endpoint       Purpose
GET       /todos         Get all Todos
GET       /todos/:id     Get one Todo
POST      /todos         Create a Todo
PATCH     /todos/:id     Update completion status
DELETE    /todos/:id     Delete a Todo

## What I'm Learning

- Backend
- revision frontend & Typescript

## Future Improvements

auth