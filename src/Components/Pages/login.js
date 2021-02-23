import React from "react";

import axios from "axios";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import isEmail from "validator/lib/isEmail";


import { tempDatabase } from "./tempDatabase";

if (localStorage.getItem("Database") == null) {
  localStorage.setItem("Database", JSON.stringify(tempDatabase));
}
let database = JSON.parse(localStorage.getItem("Database"));
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      password: "",
      emailClass: "emailClass",
      emailNotInUse: "emailNotInUse",
      wrongPassword: "wrongPassword",
      submitBool: true,
      value: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if (localStorage.getItem("logUser") !== null) {
      this.props.history.push({
        pathname: "/homepage",
      });
    }
  }

  componentDidMount() {
    database = JSON.parse(localStorage.getItem("Database"));

    // passes email from validate
    try {
      this.setState({ email: this.props.location.data.email });
    } catch (error) {
      console.log(error);
      this.setState({ email: "" });
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    if (name == "email") {
      //check and get email is it in database?
      this.setState({ submitBool: false });


     


      if (isEmail(event.target.value)) {
        let emailExists = false
     for (let i = 0; i < database.length; i++) {
        if (database[i].email == value) {
          emailExists = true
        }
      }

      if(emailExists){
        this.setState({ emailNotInUse: "emailNotInUse flagEmailInUse" });
      } else {
        this.setState({ submitBool: true });

        this.setState({ emailNotInUse: "emailNotInUse" });
      

      }


        this.setState({ emailClass: "emailClass" });
      }
    }
  }

  handleSubmit(event) {
    let user = {
      email: this.state.email,
      first_name: this.state.fname,
      last_name: this.state.lname,
      password: this.state.password,
      avatar: this.state.img,
    };

    if (this.state.submitBool) {

      for (let i = 0; i < database.length; i++) {
      

        if (database[i].email == user.email) {
          if(database[i].password == user.password){
            user.first_name = database[i].first_name;
            user.last_name = database[i].last_name;
            user.avatar = database[i].avatar;
            localStorage.setItem("Database", JSON.stringify(database));
            localStorage.setItem("logUser", JSON.stringify(user));
            this.setState({ redirect: "/homepage" });
          } else {
            this.setState({ wrongPassword: "flagWrongPassword" });
          }
        }
     
    }

    event.preventDefault();
  }
}

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="background">
        <form
          className="wrapper"
          name="loginForm"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            className={this.state.emailClass}
            placeholder="Enter Email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          ></input>
          <span className={this.state.emailNotInUse}>
            This Email Is Not Registered
          </span>

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            autoComplete="on"
            value={this.state.password}
            onChange={this.handleChange}
            required
          ></input>
          <div className={this.state.wrongPassword}>
            This Password Is Not Correct
          </div>

          <div className="loginOuterButtons">
            <input
              type="submit"
              value="Submit"
              disabled={!this.state.submitBool}
            ></input>
            <Link to="/CreateAccountForm" className="linkRedirect">
              <p className="linkButton">CreateAccountForm</p>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm;
