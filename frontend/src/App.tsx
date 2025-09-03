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
import MyEquipmentScreen from "./screens/admin/MyEquipmentScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import ProjectAnalyticsScreen from "./screens/ProjectAnalyticsScreen";
import EquipmentEditScreen from "./screens/admin/EquipmentEditScreen";


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
                <Route path={"/equipments/:id"} element={<EquipmentEditScreen />} />
                <Route path={"/equipments"} element={<EquipmentScreen />} />
                <Route path={"/equipmentAnalytics"} element={<EquipmentAnalyticsScreen />} />
                <Route path={"/projects/user/:id"} element={<MyProjectScreen />} />
                <Route path={"/equipments/user/:id"} element={<MyEquipmentScreen />} />
                <Route path={"/contactUs"} element={<ContactUsScreen />} />
                <Route path={"/about"} element={<AboutUsScreen />} />
                <Route path={"/settings"} element={<SettingsScreen />} />
                <Route path={"/projectAnalytics"} element={<ProjectAnalyticsScreen />} />

            </Routes>

        </Router>



    </>
  );
}

export default App;
