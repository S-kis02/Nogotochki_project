import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Admin() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/requests')
      .then(res => res.json())
      .then(data => data.success && setRequests(data.data))
  }, [])

  const updateStatus = async (id, id_status) => {
    await fetch(`http://localhost:3000/api/admin/request/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_status })
    })
    const res = await fetch('http://localhost:3000/api/admin/requests')
    const data = await res.json()
    data.success && setRequests(data.data)
  }

  return (
    <>
      <button onClick={() => navigate('/')}>Выход</button>
      <h1>Панель администратора</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>Дата</th>
            <th>Мастер</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.full_name}</td>
              <td>{r.phone}</td>
              <td>{new Date(r.booking_datetime).toLocaleString('ru-RU')}</td>
              <td>{r.master}</td>
              <td>{r.status}</td>
              <td>
                <select onChange={e => updateStatus(r.id, e.target.value)} defaultValue={r.id_status}>
                  <option value="1">Новое</option>
                  <option value="4">Подтверждено</option>
                  <option value="3">Отклонено</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}