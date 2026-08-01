import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import PostPage from "./pages/PostPage";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";

const SLUGS = ["coding-projects","tech-tips","updates","puppy-life","minecraft-server","beta","stats","feature-request"];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/admin"          element={<Admin />} />
        <Route path="/post/:id"       element={<PostPage />} />
        {SLUGS.map(s => <Route key={s} path={`/pages/${s}`} element={<CategoryPage slug={s} />} />)}
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
