import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export function NewRequest() {
  const navigate = useNavigate()
  const [masters, setMasters] = useState([])
  const [error, setError] = useState('')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetch('http://localhost:3000/api/masters')
      .then(res => res.json())
      .then(data => data.success && setMasters(data.data))
  }, [])

  const validateTime = (datetime) => {
    if (!datetime) return false
    const hour = new Date(datetime).getHours()
    if (hour < 8 || hour > 18) {
      setError('Время бронирования должно быть с 8:00 до 18:00')
      return false
    }
    setError('')
    return true
  }

  const addRequest = async (e) => {
    e.preventDefault()
    setError('')
    
    const datetime = e.target.datetime.value
    const master = e.target.master.value
    
    if (!validateTime(datetime)) return
    
    const newReq = {
      id_user: userId,
      id_master: master,
      booking_datetime: datetime
    }
    
    const res = await fetch('http://localhost:3000/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq)
    })
    
    const data = await res.json()
    if (data.success) {
      navigate('/home')
    } else {
      setError('Ошибка при создании заявки')
    }
  }

  return (
    <>
      <h1>Новая заявка</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={addRequest}>
        <select name="master" required>
          <option value="">Выберите мастера</option>
          {masters.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        
        <input 
          type="datetime-local" 
          name="datetime" 
          required 
          onChange={(e) => validateTime(e.target.value)}
        />
        
        <button type="submit">Создать</button>
      </form>
      
      <button onClick={() => navigate('/home')}>Назад</button>
    </>
  )
}