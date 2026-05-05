import { useNavigate } from "react-router-dom"

export function Avto() {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const login = e.target.login.value
    const password = e.target.password.value
    
    const response = await fetch(`http://localhost:3000/api/login?login=${login}&password=${password}`)
    const data = await response.json()
    
    if (data.success) {
      alert('Вы вошли!')
      navigate('/home')
    } else {
      alert('Неверный логин или пароль')
    }
  }

  const backReg = () => {
    navigate('/')
  }
  
  return(
    <>
      <h1>Авторизация</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="login" placeholder="Логин"/>
        <input type="password" name="password" placeholder="Пароль"/>
        <button type="submit">Войти</button>
      </form>
      
      <p>Не зарегистрированы?</p>
      <button onClick={backReg}>Зарегистрироваться</button>
    </>
  );
}