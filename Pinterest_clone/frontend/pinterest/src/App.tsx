import React, {useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.tsx';
import Profile from './components/Profile.tsx';
import Login from './components/Login.tsx';
import { startTokenRefreshInterval } from './api/apiRequests.tsx';
import { AuthProvider } from './context/contextProvider.tsx';
import ProtectedRoute from './context/protected.tsx';
import Home from './components/Home.tsx';
import PostDetail from './components/PostDetail.tsx';
import CreatePin from './components/CreatePin.tsx';

const App: React.FC = () => {

  useEffect(() => {
    startTokenRefreshInterval();
  }, []);

  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home></Home></ProtectedRoute>}></Route>
        <Route path='/:username' element={<ProtectedRoute><Profile></Profile></ProtectedRoute>
        
        }></Route>
        <Route path="/pins/:id" element={<ProtectedRoute><PostDetail></PostDetail></ProtectedRoute>}></Route>

        <Route path="/create-pin" element={<ProtectedRoute><CreatePin></CreatePin></ProtectedRoute>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>

      </Routes>
    </AuthProvider>
  );
};

export default App;
