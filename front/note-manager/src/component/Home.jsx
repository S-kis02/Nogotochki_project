import { useNavigate } from "react-router-dom"

export function Home() {
    const navigate = useNavigate()

    const exit = () =>{
        navigate('/')
    }
    
    return (<>
        <button onClick={exit}>Выход</button>
        <h2>Ваши заявки</h2>
        <p>Пуки каки</p>
        <button>Заполнить заявку</button>
    </>)
}