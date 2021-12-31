import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authActions } from '../../../store/auth';

import './MainNavigation.css';

const MainNavigation = props => {
  const token = useSelector(state => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate('/', { replace: true });
  };
  return (
    <header className='main-navigation'>
      <div className='main-navigation__logo'>
        <h1>
          <Link to='/'>Event Finder</Link>
        </h1>
      </div>
      <nav className='main-navigation__items'>
        <ul>
          {!token && (
            <li>
              <NavLink to='/auth'>Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to='/events'>Events</NavLink>
          </li>
          {token && (
            <>
              <li>
                <NavLink to='/bookings'>Bookings</NavLink>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
