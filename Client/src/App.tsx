import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import LoginCreate from "./wrappers/LoginCreateWrapper";
import "@/styles/App.css";
import "@/styles/App.sass";
import SiteWrapper from "./wrappers/SiteWrapper";

const PagesRoutes = () =>
  useRoutes([
    {
      path: "/*",
      element: <SiteWrapper />,
    },
    {
      path: "/login",
      element: <LoginCreate />,
    },
  ]);

function App() {

  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <PagesRoutes></PagesRoutes>
      </Router>
    </div>
  );
}

export default App;
