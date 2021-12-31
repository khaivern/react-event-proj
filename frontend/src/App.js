import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AuthPage from './users/pages/Auth';
import Events from './events/pages/Events';
import Bookings from './bookings/pages/Bookings';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import './App.css';

const App = () => {
  return (
    <>
      <MainNavigation />
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Navigate to='/auth' />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/events' element={<Events />} />
          <Route path='/bookings' element={<Bookings />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
