import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export function Home() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3000/api/requests?userId=${userId}`)
        .then(res => res.json())
        .then(data => data.success && setRequests(data.data))
    }
  }, [userId])

  const exit = () => {
    localStorage.removeItem('userId')
    navigate('/')
  }

  return (
    <>
      <button onClick={exit}>Выход</button>
      <h1>Мои заявки</h1>
      <table border="1">
        <thead>
          <tr><th>Мастер</th><th>Дата</th><th>Статус</th></tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.master}</td>
              <td>{new Date(req.booking_datetime).toLocaleString('ru-RU')}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/new-request')}>Заполнить заявку</button>
    </>
  )
}