import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Repos from "./pages/Repos";

function App() {
  const path = window.location.pathname;

  if (path === "/" || path === "/landing") {
    return <Landing />;
  }

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  if (path === "/repos") {
    return <Repos />;
  }

  if (path === "/login") {
    return <Login />;
  }

  return <Login />;
}

export default App;