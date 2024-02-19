import { SpeedInsights } from "@vercel/speed-insights/react"
import { Home } from './components/Home';
import ContentPage from './components/ContentPage';
import { ContactUs } from './components/ContactUs';
import { BrowseTopics } from './components/BrowseTopics';
import { BookSession } from './components/BookSession';
import { AboutUs } from './components/team';
import { MathJaxContext } from "better-react-mathjax";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]]
    }
  };

  
  return (
    <MathJaxContext config={config} version={3}>
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
          path='/team'
          element={<AboutUs/>}
          ></Route>
          <Route
          exact
          path='/contact-us'
          element={<ContactUs />}
          ></Route>
        </Routes>
        <SpeedInsights />
      </div>
    </Router>
    </MathJaxContext>
  );
}

export default App;
