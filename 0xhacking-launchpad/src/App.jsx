import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LaunchpadProtectedRoute from "./components/LaunchpadProtectedRoute";
import Launchpad from "./routes/Launchpad";
import Resource from './routes/Resource'
import Message from './routes/Message'
import ResourceProtectedRoute from "./components/ResourceProtectedRoute";
import CheckpointOne from "./components/forms/CheckpointOne";
import CheckpointTwo from "./components/forms/CheckpointTwo";
import CheckpointThree from "./components/forms/CheckpointThree";
import CheckpointFour from "./components/forms/checkpointFour";
import CheckpointFive from "./components/forms/CheckpointFive";
import ScreenOne from "./routes/Screen-1";
import ScreenTwo from "./routes/Screen-2";
import ScreenThree from "./routes/Screen-3";
import ScreenFour from "./routes/Screen-4";
import ScreenFive from "./routes/Screen-5";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route>
            <Route element={<LaunchpadProtectedRoute />}>
              <Route path="/" element={<Launchpad />} />
              <Route path="/message" element={<Message />} />
            </Route>
            <Route element={<ResourceProtectedRoute />}>
              <Route path="/resource" element={<Resource />} />
            </Route>
            <Route element={<LaunchpadProtectedRoute />}>
              <Route path="/checkpoint-1" element={<ScreenOne />} />
              <Route path="/checkpoint-2" element={<ScreenTwo />} />
              <Route path="/checkpoint-3" element={<ScreenThree />} />
              <Route path="/checkpoint-4" element={<ScreenFour />} />
              <Route path="/checkpoint-5" element={<ScreenFive />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
