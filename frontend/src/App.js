import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AuthPage from './users/pages/Auth';
import Events from './events/pages/Events';
import Bookings from './bookings/pages/Bookings';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import './App.css';

const App = () => {
  const token = useSelector(state => state.token);
  return (
    <>
      <MainNavigation />
      <main className='main-content'>
        <Routes>
          {!token && <Route path='/' element={<Navigate to='/auth' />} />}
          {token && <Route path='/' element={<Navigate to='/events' />} />}
          {!token && <Route path='/auth' element={<AuthPage />} />}
          {token && <Route path='/auth' element={<Navigate to='/events' />} />}
          <Route path='/events' element={<Events />} />
          {token && <Route path='/bookings' element={<Bookings />} />}
        </Routes>
      </main>
    </>
  );
};

export default App;
