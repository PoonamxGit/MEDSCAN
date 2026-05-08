import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Predict from "./components/Predict";
import Services from "./components/Services";
import Footer from "./components/Footer";
import MedicalChatbot from "./components/MedicalChatbot"; // ← ADD

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <section id="home"><HomePage /></section>
            <section id="services"><Services /></section>
            <section id="about"><AboutUs /></section>
            <section id="contact"><ContactUs /></section>
            <section id="footer"><Footer /></section>
          </>
        } />
        <Route path="/pneumonia" element={<Predict modelName="pneumonia" />} />
        <Route path="/eyeDisease" element={<Predict modelName="eyeDisease" />} />
        <Route path="/skinDisease" element={<Predict modelName="skinDisease" />} />
      </Routes>
      <MedicalChatbot />
    </Router>
  );
}

export default App;