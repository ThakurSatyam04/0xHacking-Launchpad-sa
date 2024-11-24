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
import CheckpointFive from "./components/forms/checkpointFive";

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
              <Route path="/checkpoint-1" element={<CheckpointOne />} />
              <Route path="/checkpoint-2" element={<CheckpointTwo />} />
              <Route path="/checkpoint-3" element={<CheckpointThree />} />
              <Route path="/checkpoint-4" element={<CheckpointFour />} />
              <Route path="/checkpoint-5" element={<CheckpointFive />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
