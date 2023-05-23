import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';
import ListMetric from "./components/ListMetric";
import NewAnomalyMetric from "./components/NewAnomalyMetric";

const Home = () => <div>Home</div>;

const About = () => <div>About</div>;

const App = () => (
    <Router>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        <Route  path="/" element={<ListMetric/>} />
        <Route path="/about" element={<NewAnomalyMetric/>} />
    </Router>
);

export default App;