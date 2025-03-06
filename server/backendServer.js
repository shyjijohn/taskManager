
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'
import dotenv from 'dotenv'

dotenv.config(); //to get the clerk publishable key availabel to this js script by loading it from the .env file.
//console.log("Clerk Publishable Key:", process.env.CLERK_PUBLISHABLE_KEY);

const app = express();
app.use(clerkMiddleware())
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});


const initializeDB = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL');

        // Create UserData table
        const createUserTable = `
        CREATE TABLE IF NOT EXISTS UserData (
          id int AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL
        )`;

        connection.query(createUserTable, (err, results) => {
            if (err) {
                console.error('Error creating UserData table:', err);
                return;
            }
            console.log('UserData table is ready');
        });

        const createTaskTable = `
        CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NULL,
          status ENUM('todo', 'in-progress', 'done') NOT NULL,
          userId int,
          FOREIGN KEY (userId) REFERENCES UserData(id) ON DELETE CASCADE
        )`;

        connection.query(createTaskTable, (err, results) => {
            if (err) {
                console.error('Error creating tasks table:', err);
                return;
            }
            console.log('Tasks table is ready');
        });
    });
};


//returns user id in db
const getOrAddUser = async (req) => {

    try {
        // Get the authenticated user's information
        const { userId } = getAuth(req);

        if (!userId) {
            console.log("registering user : Unauthorized: User")
            return null;
        }

        // Fetch user details from Clerk
        const user = await clerkClient.users.getUser(userId);

        const email = user.emailAddresses[0].emailAddress
        // console.log("user : ", email, "   Trying to do something !")

        const results = await new Promise((resolve, reject) => {
            connection.query('SELECT id FROM UserData WHERE email = ?', [email], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (results.length === 0) {
            //user not found in DB. so, creating one. 
            const results = await new Promise((resolve, reject) => {
                connection.query('INSERT INTO UserData (email) VALUES (?)', [email], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            return results.insertId; //this is the primary key
        }
        else{
            return results[0].id;
        }

    } catch (error) {
        console.error('Error registering user:', error);
        return null;
    }
}

app.get('/tasks', requireAuth(), async (req, res) => {
    const userId = await getOrAddUser(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized: User not found' });

    const query = 'SELECT * FROM tasks WHERE userId = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching tasks' });
        }
        res.json(results);
    });
});

app.post('/tasks', requireAuth(), async (req, res) => {
    const userId = await getOrAddUser(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized: User not found' });

    const { id, title, description, status } = req.body;
    const query = 'INSERT INTO tasks (id, title, description, status, userId) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [id, title, description, status, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating task' });
        }
        res.status(201).json({ id, title, status, userId });
    });
});

app.put('/tasks/:id/status', requireAuth(), async (req, res) => {
    const userId = await getOrAddUser(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized: User not found' });

    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE tasks SET status = ? WHERE id = ? AND userId = ?';
    connection.query(query, [status, id, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating task status' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found or does not belong to the user' });
        }
        res.json({ id, status });
    });
});

app.put('/tasks/:id', requireAuth(), async (req, res) => {
    console.log("Editing TAsk")
    const userId = await getOrAddUser(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized: User not found' });

    const taskId = req.params.id;  // Get task ID from the URL parameter
    const { title, description, status } = req.body;

    // SQL query to update task by id
    const query = `
        UPDATE tasks 
        SET title = ?, description = ?, status = ? 
        WHERE id = ? AND userId = ?
    `;

    // Run the query to update the task
    connection.query(query, [title, description, status, taskId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating task' });
        }

        // If no rows were affected, the task might not exist for the current user
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json({ message: 'Task updated successfully', taskId, title, description, status });
    });
});


app.delete('/tasks/:id', requireAuth(), async (req, res) => {
    const userId = await getOrAddUser(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized: User not found' });

    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ? AND userId = ?';
    connection.query(query, [id, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting task' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found or does not belong to the user' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});


app.listen(process.env.PORT, () => {
    console.log('Hey its me Shyji!! --   Backend server is running');
    initializeDB();
});
