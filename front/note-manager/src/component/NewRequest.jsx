import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export function NewRequest() {
  const navigate = useNavigate()
  const [masters, setMasters] = useState([])
  const [error, setError] = useState('')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchMasters = async () => {
      const response = await fetch('http://localhost:3000/api/masters')
      const data = await response.json()
      if (data.success) {
        setMasters(data.data)
      }
    }
    fetchMasters()
  }, [])

  const validateDateTime = (datetime) => {
    if (!datetime) return false

    const selected = new Date(datetime)
    const now = new Date()
    const maxDate = new Date()
    maxDate.setDate(now.getDate() + 30)

    now.setHours(0, 0, 0, 0)
    maxDate.setHours(23, 59, 59, 999)

    if (selected < now) {
      setError('Нельзя выбрать прошедшую дату')
      return false
    }

    if (selected > maxDate) {
      setError('Можно выбрать дату не позже 30 дней от сегодня')
      return false
    }

    const hour = selected.getHours()
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

    if (!validateDateTime(datetime)) return

    const newReq = {
      id_user: userId,
      id_master: master,
      booking_datetime: datetime
    }

    const response = await fetch('http://localhost:3000/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq)
    })

    const data = await response.json()
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

        <input type="datetime-local" name="datetime" onChange={(e) => validateDateTime(e.target.value)} />
        <p>Доступно время с 08:00 до 18:00</p>

        <button type="submit" className='btn'>Создать</button>
      </form>

      <button onClick={() => navigate('/home')} className='btn'>Назад</button>
    </>
  )
}