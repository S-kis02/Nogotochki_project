import express from 'express';
import { db } from './db.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Регистрация
app.post('/api/register', (req, res) => {
  const { full_name, phone, login, password } = req.body;

  if (!full_name || !phone || !login || !password) {
    return res.json({ success: false, message: 'Все поля обязательны' });
  }

  db.query('SELECT * FROM user WHERE login = ?', [login], (err, results) => {
    if (err) {
      console.log('Ошибка БД:', err);
      return res.json({ success: false, message: 'Ошибка сервера' });
    }
    if (results.length > 0) {
      return res.json({ success: false, message: 'Логин уже существует' });
    }

    const id_role = 1;
    db.query('INSERT INTO user (full_name, phone, login, password, id_role) VALUES (?, ?, ?, ?, ?)', 
      [full_name, phone, login, password, id_role], 
      (err, result) => {
        if (err) {
          console.log('Ошибка при добавлении:', err);
          return res.json({ success: false, message: 'Ошибка при регистрации' });
        }
        res.json({ success: true, message: 'Регистрация успешна', userId: result.insertId, role: 'user' });
      }
    );
  });
});

// Авторизация
app.get('/api/login', (req, res) => {
  const { login, password } = req.query;

  db.query('SELECT id, id_role FROM user WHERE login = ? AND password = ?', [login, password], (err, results) => {
    if (err) {
      return res.json({ success: false, message: 'Ошибка БД' });
    }
    if (results.length > 0) {
      const user = results[0];
      res.json({ success: true, message: 'Вы авторизовались', userId: user.id, id_role: user.id_role });
    } else {
      res.json({ success: false, message: 'Неверный логин или пароль' });
    }
  });
});

// Просмотр заявок пользователя
app.get('/api/requests', (req, res) => {
  const userId = req.query.userId;

  db.query(
    'SELECT r.*, m.name as master, s.name as status FROM request r JOIN master m ON r.id_master = m.id JOIN status s ON r.id_status = s.id WHERE r.id_user = ?', 
    [userId], 
    (err, results) => {
      if (err) {
        return res.json({ success: false, message: 'Ошибка БД' });
      }
      res.json({ success: true, data: results });
    }
  );
});

// Создание заявки
app.post('/api/requests', (req, res) => {
  const { id_user, id_master, booking_datetime } = req.body;

  if (!id_master) {
    return res.json({ success: false, message: 'Выберите мастера' });
  }
  if (!booking_datetime) {
    return res.json({ success: false, message: 'Выберите дату и время' });
  }

  db.query('INSERT INTO request (id_user, id_master, id_status, booking_datetime) VALUES (?, ?, 1, ?)', 
    [id_user, id_master, booking_datetime], 
    (err) => {
      if (err) {
        return res.json({ success: false, message: 'Ошибка БД' });
      }
      res.json({ success: true, message: 'Заявка создана' });
    }
  );
});

// Получение списка мастеров
app.get('/api/masters', (req, res) => {
  db.query('SELECT id, name FROM master', (err, results) => {
    if (err) {
      return res.json({ success: false, message: 'Ошибка БД' });
    }
    res.json({ success: true, data: results });
  });
});

// Админ: все заявки
app.get('/api/admin/requests', (req, res) => {
  db.query(
    'SELECT r.*, u.full_name, u.phone, m.name as master, s.name as status FROM request r JOIN user u ON r.id_user = u.id JOIN master m ON r.id_master = m.id JOIN status s ON r.id_status = s.id', 
    (err, results) => {
      if (err) {
        return res.json({ success: false, message: 'Ошибка БД' });
      }
      res.json({ success: true, data: results });
    }
  );
});

// Админ: смена статуса
app.put('/api/admin/request/:id', (req, res) => {
  const { id_status } = req.body;
  const { id } = req.params;

  db.query('UPDATE request SET id_status = ? WHERE id = ?', [id_status, id], (err) => {
    if (err) {
      return res.json({ success: false, message: 'Ошибка БД' });
    }
    res.json({ success: true, message: 'Статус обновлён' });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});