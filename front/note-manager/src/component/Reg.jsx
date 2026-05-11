import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Reg() {
  const navigate = useNavigate();
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    login: '',
    password: ''
  });

  const handleChange = (e) => {
    setError('')
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name) {
      setError('Введите ФИО')
      return
    }
    
    if (!formData.phone || formData.phone.length < 10) {
      setError('Введите корректный телефон')
      return
    }

    if (formData.login.length < 3) {
      setError('Логин должен быть не менее 3 символов')
      return
    }
    
    if (formData.password.length < 4) {
      setError('Пароль должен быть не менее 4 символов')
      return
    }

    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      
      const loginRes = await fetch(`http://localhost:3000/api/login?login=${formData.login}&password=${formData.password}`)
      const loginData = await loginRes.json()
      
      if (loginData.success) {
        localStorage.setItem('userId', loginData.userId)
        navigate('/home')
      } else {
        navigate('/avto')
      }
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
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