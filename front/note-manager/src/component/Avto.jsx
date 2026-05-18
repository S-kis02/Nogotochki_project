import { useNavigate } from "react-router-dom"
import { useState } from "react"

export function Avto() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const login = e.target.login.value
    const password = e.target.password.value
    
    const response = await fetch(`http://localhost:3000/api/login?login=${login}&password=${password}`)
    const data = await response.json()
    
    if (data.success) {
      localStorage.setItem('userId', data.userId)
      
      if (data.id_role === 2) {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } else {
      setError('Неверный логин или пароль')
    }
  }

  const backReg = () => {
    navigate('/')
  }
  
  return(
    <>
      <h1>Авторизация</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="login" placeholder="Логин"/>
        <input type="password" name="password" placeholder="Пароль"/>
        <button type="submit" className='btn'>Войти</button>
      </form>
      
      <p>Не зарегистрированы?</p>
      <button onClick={backReg} className='btn'>Зарегистрироваться</button>
    </>
  )
}