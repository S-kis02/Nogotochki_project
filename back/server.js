import express from 'express';
import { db } from './db.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
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
    'SELECT id, id_role FROM user WHERE login = ? AND password = ?',
    [login, password],
    (err, results) => {
      if (err) {
        return res.json({ success: false });
      }
      
      if (results.length > 0) {
        const user = results[0]
        res.json({ success: true, id_role: user.id_role, userId: user.id })
      } else {
        res.json({ success: false });
      }
    }
  );
});

app.get('/api/admin/requests', (req, res) => {
  const sql = `
    SELECT r.id, u.full_name, u.phone, r.booking_datetime, 
           m.name as master, s.name as status, r.id_status
    FROM request r
    JOIN user u ON r.id_user = u.id
    JOIN master m ON r.id_master = m.id
    JOIN status s ON r.id_status = s.id
  `
  db.query(sql, (err, data) => {
    if (err) res.json({ success: false })
    else res.json({ success: true, data })
  })
})

app.put('/api/admin/request/:id', (req, res) => {
  db.query('UPDATE request SET id_status = ? WHERE id = ?', 
    [req.body.id_status, req.params.id], 
    (err) => res.json({ success: !err })
  )
})

app.get('/api/requests', (req, res) => {
  const userId = req.query.userId
  db.query(`
    SELECT r.id, m.name as master, r.booking_datetime, s.name as status
    FROM request r
    JOIN master m ON r.id_master = m.id
    JOIN status s ON r.id_status = s.id
    WHERE r.id_user = ?
  `, [userId], (err, data) => {
    if (err) res.json({ success: false })
    else res.json({ success: true, data })
  })
})

app.post('/api/requests', (req, res) => {
  const { id_user, id_master, booking_datetime } = req.body
  
  db.query(
    'INSERT INTO request (id_user, id_master, id_status, booking_datetime) VALUES (?, ?, 1, ?)',
    [id_user, id_master, booking_datetime],
    (err, result) => {
      if (err) res.json({ success: false })
      else res.json({ success: true })
    }
  )
})

app.get('/api/masters', (req, res) => {
  db.query('SELECT id, name FROM master', (err, data) => {
    if (err) res.json({ success: false })
    else res.json({ success: true, data })
  })
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту:${PORT}`);
});