Specter Chat

### For development
1. Create PG instance: docker run --name spectrum-chat -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=specter-db -d postgres
2. Duplicate .env.local.example and rename to .env.local
3. Add Postgres config 
4. cd backend; npm run dev
5. cd frontend; npm run dev

### To run API E2E tests
1. cd backend; npm test

### To run Cypress E2E tests
1. cd backend; npm run dev
2. cd frontend; npm run dev
3. npm run cypress:open

