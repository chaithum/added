import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
// Import other components like RestaurantMenu, UpdateProfile, etc.

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} /> {/* Restaurant Menu page */}
        <Route path="/update-profile" element={<UpdateProfile />} /> {/* Update Profile page */}
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
