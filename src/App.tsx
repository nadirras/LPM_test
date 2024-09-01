import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormDetails from "./components/FormDetails";
import Home from "./pages/Home";
import ListFormsPage from "./pages/ListFormsPage";

function App() {
  return (
    <Router data-theme="emerald">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-forms" element={<ListFormsPage />} />
        <Route path="/list-forms/:id" element={<FormDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
