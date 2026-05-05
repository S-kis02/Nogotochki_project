import express from 'express';
import { db } from './db.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

app.post('/api/register', (req, res) => {
    const { login, password, full_name, phone } = req.body;

    db.query('SELECT * FROM user WHERE full_name = ?', [full_name], (err) => {
        if (err) {
            console.log('Ошибка БД:', err);
            return res.status(500).json({ success: false });
        }

        const id_role = 1;

        db.query(
            'INSERT INTO user (id_role, login, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
            [id_role, login, password, full_name, phone],
            (err) => {
                if (err) {
                    console.log('Ошибка при добавлении:', err);
                    return res.status(500).json({ success: false });
                }

                console.log('Пользователь зарегистрирован:', full_name);
                res.json({ success: true });
            }
        );
    });
});


app.get('/api/login', (req, res) => {
  const { login, password } = req.query;
  
  db.query(
    'SELECT * FROM user WHERE login = ? AND password = ?',
    [login, password],
    (err, results) => {
      if (err) {
        return res.json({ success: false });
      }
      
      if (results.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту:${PORT}`);
});
