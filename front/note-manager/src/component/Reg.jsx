import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export function Reg() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    login: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
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
      navigate('/home')
    } else {
      alert('Ошибка: ' + data.message);
    }
  };

  const AvtoGo = () => {
    navigate('/avto')
  }
 
  return (
    <>
      <h1>Здравствуйте! Зарегистрируйтесь, чтобы продолжить</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="full_name" placeholder="ФИО" onChange={handleChange}/>
        <input type="text" name="phone" placeholder="Номер телефона" onChange={handleChange}/>
        <input type="text" name="login" placeholder="Логин" onChange={handleChange}/>
        <input type="password" name="password" placeholder="Пароль" onChange={handleChange}/>
        <button type="submit">Зарегистрироваться</button>
      </form>

      <p>Уже зарегистрированы?</p>
      <button onClick={AvtoGo}>Авторизоваться</button>
    </>
  );
}