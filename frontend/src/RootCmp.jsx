import { AppHeader } from "./cmps/AppHeader.jsx";
import { AppFooter } from "./cmps/AppFooter.jsx";
import { Home } from "./pages/Home.jsx";
import { BugIndex } from "./pages/BugIndex.jsx";
import { BugDetails } from "./pages/BugDetails.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { UserMsg } from "./cmps/UserMsg.jsx";
import { useState } from "react";
import { UserDetails } from "./pages/UserDetails.jsx";

export function App() {
  //in real app it will be redux and not exist in root cmp
  const [user, setUser] = useState(null);
  return (
    <Router>
      <div className="main-app">
        <AppHeader setUser={setUser} user={user} />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bug" element={<BugIndex user={user} />} />
            <Route path="/bug/:bugId" element={<BugDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/u/:userId" element={<UserDetails />} />
          </Routes>
        </main>
        <AppFooter />
        <UserMsg />
      </div>
    </Router>
  );
}
