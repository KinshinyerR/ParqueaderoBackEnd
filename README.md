# Parqueadero API 

## Content
- [Parqueadero API](#parqueadero-api)
  - [Content](#content)
  - [Modules](#modules)
  - [Installation](#installation)
    - [Node](#node)
    - [DataBase](#database)
  - [API](#api)
    - [Using local node server](#using-local-node-server)
      - [You can run the api with command](#you-can-run-the-api-with-command)
## Modules
- Express
- mongoose
- morgan

## Installation
### Node
```bash
npm install
```
### DataBase
1. Add env vars to the `.env` file
```
MONGODB=mongodb+srv://dbadmin:<password>@cluster0.wtsge.mongodb.net/Parqueadero?retryWrites=true&w=majority
```

## API
### Using local node server
#### You can run the api with command
```bash
npm run dev
```