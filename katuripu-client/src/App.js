import { Home } from './components/Home';
import Content from './components/Content';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={<Home />}
          ></Route>
          <Route
            exact
            path="/content"
            element={<Content />}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
