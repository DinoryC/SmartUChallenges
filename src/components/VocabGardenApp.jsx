// VocabGardenApp.jsx
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserVocabs from "./UserVocabs";
import AuthCard from "./AuthCard";
import VocabGardenTopper from "./VocabGardenTopper";
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

function VocabGardenApp() {
  const [user, setUser] = useState({ isAuthenticated: false, user: null });
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const res = await axios.get('/literacyHome/vb/auth/getUser');
      console.log("VocabGardenApp.jsx + get /getUser: res.data = ", res.data);
      const { isAuthenticated, user: fetchedUser } = res.data || {};
      setUser({
        isAuthenticated: !!isAuthenticated,
        user: fetchedUser || null,
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setUser({ isAuthenticated: false, user: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();  // Initial user fetch on load
  }, [fetchUserData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user.isAuthenticated && window.location.pathname !== "/literacyHome/vocabGardenApp/auth") {
    return <Navigate to="/literacyHome/vocabGardenApp/auth" replace />;
  }

  return (
    <Router>
      <div className="mt-3 mb-5">
        <VocabGardenTopper authState={user} setAuthState={setUser} />
        <div className="mt-3">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/literacyHome/vocabGardenApp/auth"
              element={
                <PublicRoute isAuthenticated={user.isAuthenticated}>
                  <AuthCard updateUser={fetchUserData} />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/literacyHome/vocabGardenApp/user"
              element={
                <ProtectedRoute isAuthenticated={user.isAuthenticated}>
                  <UserVocabs />
                </ProtectedRoute>
              }
            />

            {/* Default Route: Redirect based on authentication */}
            <Route
              path="*"
              element={
                user.isAuthenticated ? (
                  <Navigate to="/literacyHome/vocabGardenApp/user" replace />
                ) : (
                  <Navigate to="/literacyHome/vocabGardenApp/auth" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default VocabGardenApp;
