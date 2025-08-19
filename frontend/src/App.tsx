import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import TopNavigation from "./components/TopNavigation";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import HomePage from ".//screens/Homepage";
import {ProjectsScreen} from "./screens/ProjectsScreen";

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


            </Routes>

        </Router>



    </>
  );
}

export default App;
