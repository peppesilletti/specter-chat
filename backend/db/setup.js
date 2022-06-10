import SQL from '@nearform/sql'
import db from './db.js'

const createUsersTableQuery = SQL`
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatarUrl TEXT NOT NULL
);
`

const createCommentsTableQuery = SQL`
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    upvotes INTEGER,
    published_at TEXT NOT NULL,
    parent_id TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(id)
);
`

const seedUsers = SQL`
INSERT INTO users (id, first_name, last_name, avatarUrl)
    VALUES (1, 'Jon', 'Snow', 'https://gravatar.com/avatar/aed45db8f8c47da256ece14e137de715?s=400&d=robohash&r=x'),
            (2,'Tyrion', 'Lannister', 'https://gravatar.com/avatar/d0d6f590f0dacb808fd6a8e1240b2fe6?s=400&d=robohash&r=x'),
            (3,'Arya', 'Stark', 'https://gravatar.com/avatar/70cfb6efe4b2696a14761ccd64d767af?s=400&d=robohash&r=x');
`

async function main() {
	try {
		console.log('START')
		await db.connect()
		await db.query(createUsersTableQuery)
		await db.query(createCommentsTableQuery)
		await db.query(seedUsers)
		console.log('END')
	} catch (error) {
		console.log(error.message)
	}
}

main()
// db.exec(
// 	`

// db.all('SELECT * FROM users', (error, rows) => {
// 	console.log(rows)
// 	rows.forEach(row => {
// 		console.log(row)
// 	})
// })

// create table comments (
//     author_id
// );

// insert into hero_power (hero_id, hero_power)
//     values (1, 'Web Slinging'),
//            (1, 'Super Strength'),
//            (1, 'Total Nerd'),
//            (2, 'Total Nerd'),
//            (3, 'Telepathic Manipulation'),
//            (3, 'Astral Projection');
