import { Reg } from './component/Reg.jsx'
import { Avto } from './component/Avto.jsx'
import { Routes, Route } from 'react-router-dom'
import { Home } from './component/Home.jsx'
import { NewRequest } from './component/NewRequest.jsx'
import { Admin } from './component/Admin.jsx'

// внутри Routes добавь:

export function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Reg />}>
      </Route>
      <Route path='/avto' element={<Avto />}>
      </Route>
      <Route path='/home' element={<Home />}>
      </Route>
      <Route path='/new-request' element={<NewRequest />}>
      </Route>
      <Route path='/admin' element={<Admin />}>
      </Route>
    </Routes>
    </>
  )
}
