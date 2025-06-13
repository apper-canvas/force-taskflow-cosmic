import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import CalendarPage from '@/components/pages/CalendarPage';
import CategoriesPage from '@/components/pages/CategoriesPage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import { routes } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
<Route path="tasks" element={<HomePage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
          toastClassName="shadow-lg"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;