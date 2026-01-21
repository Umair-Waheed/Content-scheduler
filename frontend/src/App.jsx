import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostsList from "./pages/PostsList";
import PostForm from "./pages/PostForm";
import ProtectedRoute from "./components/protectedRoute";
import Navbar from "./components/Navbar";


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/posts" element={
            <ProtectedRoute>
              <PostsList />
            </ProtectedRoute>
          } />

          <Route path="/posts/create" element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          } />

          <Route path="/posts/edit/:id" element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
