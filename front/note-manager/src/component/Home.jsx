import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export function Home() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [message, setMessage] = useState('')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchRequests = async () => {
      if (userId) {
        const response = await fetch(`http://localhost:3000/api/requests?userId=${userId}`)
        const data = await response.json()
        if (data.success) {
          setRequests(data.data)
          setMessage('')
        } else {
          setMessage(data.message)
        }
      }
    }
    fetchRequests()
  }, [userId])

  const exit = () => {
    localStorage.removeItem('userId')
    navigate('/')
  }

  return (
    <>
      <button onClick={exit} className='btn'>Выход</button>
      <h1>Мои заявки</h1>
      
      {requests.length === 0 && <p>У вас нет действующих заявок</p>}
      
      {requests.length > 0 && (
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
      )}
      
      <button onClick={() => navigate('/new-request')} className='btn'>Заполнить заявку</button>
    </>
  )
}