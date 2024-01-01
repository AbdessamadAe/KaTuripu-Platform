import { Home } from './components/Home';
import ContentPage from './components/ContentPage';
import {
  BrowserRouter as Router,
  Routes,
  Route
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
            path="/content/:topic_id"
            element={<ContentPage />}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
