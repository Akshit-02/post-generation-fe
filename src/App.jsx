import { Amplify } from "aws-amplify";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import awsmobile from "./aws-export";
import GeneratePostPage from "./pages/generate";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";

Amplify.configure(awsmobile, { ssr: true });

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/generate" element={<GeneratePostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
