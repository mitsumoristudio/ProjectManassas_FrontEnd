import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import TopNavigation from "./components/TopNavigation";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomePage from ".//screens/Homepage";
import {ProjectsScreen} from "./screens/ProjectsScreen";
import {ProjectFilters} from "./components/ProjectFilters";

function App() {
  return (
    <>
        <Router>
            <ToastContainer />

            {/*<TopNavigation />*/}

            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path={"/projects"} element={<ProjectsScreen />} />
                <Route path={"/filterProjects"} element={<ProjectFilters/>} />


            </Routes>

        </Router>



    </>
  );
}

export default App;
