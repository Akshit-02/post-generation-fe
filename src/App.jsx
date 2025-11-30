import { Amplify } from "aws-amplify";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import awsmobile from "./aws-export";
import GeneratePostPage from "./pages/generate";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import SavedPostsPage from "./pages/saved-posts";

Amplify.configure(awsmobile, { ssr: true });

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/generate" element={<GeneratePostPage />} />
        <Route path="/saved-posts" element={<SavedPostsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
