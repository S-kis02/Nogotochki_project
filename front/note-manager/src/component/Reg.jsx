import { useState } from 'react';

export function Reg() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    login: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      alert('Регистрация успешна!');
    } else {
      alert('Ошибка: ' + data.message);
    }
  };

  return (
    <>
      <h1>Здравствуйте! Зарегистрируйтесь, чтобы продолжить</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          placeholder="ФИО"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Номер телефона"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="login"
          placeholder="Логин"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={handleChange}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>

      <p>Уже зарегистрированы?</p>
      <button>Авторизоваться</button>
    </>
  );
}