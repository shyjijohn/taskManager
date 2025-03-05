
const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',   
    user: 'root',        
    password: 'shyjimysql!123',        
    database: 'taskManager' 
});


const initializeDB = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL');

        // Create the tasks table if it doesn't exist
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          status ENUM('todo', 'in-progress', 'done') NOT NULL
        )
      `;

        connection.query(createTableQuery, (err, results) => {
            if (err) {
                console.error('Error creating table:', err);
                return;
            }
            console.log('Tasks table is ready');
        });
    });
};


app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching tasks' });
        }
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { id, title, status } = req.body;
    const query = 'INSERT INTO tasks (id, title, status) VALUES (?, ?, ?)';
    connection.query(query, [id, title, status], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating task' });
        }
        res.status(201).json({ id, title, status });
    });
});

app.put('/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    connection.query(query, [status, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating task status' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ id, status });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting task' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

app.listen(3002, () => {
    console.log('Hey its me Shyji!! --   Backend server is running')

    initializeDB();
})
