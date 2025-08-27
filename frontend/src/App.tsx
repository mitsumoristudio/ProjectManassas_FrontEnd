import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
// import TopNavigation from "./components/TopNavigation";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomePage from ".//screens/Homepage";
import {ProjectsScreen} from "./screens/ProjectsScreen";
import EquipmentScreen from "./screens/EquipmentScreen";
import EquipmentAnalyticsScreen from "./screens/EquipmentAnalyticsScreen";
import ProjectEditScreen from "./screens/admin/ProjectEditScreen";
import SettingsScreen from "./screens/admin/SettingsScreen";
import MyProjectScreen from "./screens/admin/MyProjectScreen";

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
                <Route path={"/projects/:id"} element={<ProjectEditScreen />} />
                <Route path={"/equipments"} element={<EquipmentScreen />} />
                <Route path={"/equipmentAnalytics"} element={<EquipmentAnalyticsScreen />} />
                <Route path={"/projects/user/:id"} element={<MyProjectScreen />} />
                <Route path={"/settings"} element={<SettingsScreen />} />


            </Routes>

        </Router>



    </>
  );
}

export default App;
