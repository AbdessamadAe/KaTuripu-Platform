import { Home } from './components/Home';
import ContentPage from './components/ContentPage';
import { ContactUs } from './components/ContactUs';
import { BrowseTopics } from './components/BrowseTopics';
import { BookSession } from './components/BookSession';
import { AboutUs } from './components/AboutUs';
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
            path="/BrowseTopics"
            element={<BrowseTopics />}
          ></Route>
          <Route
            exact
            path="/content/:topic_id"
            element={<ContentPage />}
          ></Route>
          <Route
            exact
            path="/book-session"
            element={<BookSession />}
          ></Route>
          <Route
          exact
          path='/about-us'
          element={<AboutUs/>}
          ></Route>
          <Route
          exact
          path='/contact-us'
          element={<ContactUs />}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
