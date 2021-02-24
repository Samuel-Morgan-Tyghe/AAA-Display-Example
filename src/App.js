import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EmailValidate from "./Components/Pages/emailValidate.js";
import CreateAccountForm from "./Components/Pages/createAccount.js";
import LoginForm from "./Components/Pages/login.js";
import HomePage from "./Components/Pages/homePage.js";

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL} >
        {/* <Nav /> */}
        <Switch>
          <Route path="/" component={EmailValidate} exact />
          <Route path="/LoginForm" component={LoginForm} />
          <Route path="/CreateAccountForm" component={CreateAccountForm} />
          <Route path="/HomePage" component={HomePage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
