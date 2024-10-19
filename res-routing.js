import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AddItem from "./components/AddItem"; // Import your AddItem component
import DisplayItems from "./components/DisplayItems"; // Import your DisplayItems component
import UpdateRestaurant from "./components/UpdateRestaurant"; // Import your UpdateRestaurant component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/items" element={<DisplayItems />} />
        <Route path="/update-restaurant" element={<UpdateRestaurant />} />
        <Route path="/display-restaurants" element={<DisplayRestaurants />} />
        <Route path="/update-restaurant/:id" element={<UpdateRestaurant />} />
      </Routes>
    </Router>
  );
};

export default App;

