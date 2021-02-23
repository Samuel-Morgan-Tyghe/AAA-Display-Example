import React from "react";
import axios from "axios";
import isEmail from "validator/lib/isEmail";
import { tempDatabase } from "./tempDatabase";

if (localStorage.getItem("Database") == null) {
  localStorage.setItem("Database", JSON.stringify(tempDatabase));
}
let database = JSON.parse(localStorage.getItem("Database"));
let email;
class EmailValidate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", emailClass: "emailClass " };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if (localStorage.getItem("logUser") !== null) {
      this.props.history.push({
        pathname: "/homepage",
      });
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });

    if (!isEmail(event.target.value)) {
      this.setState({ emailClass: "emailClass flagValidator" });
    } else {
      this.setState({ emailClass: "emailClass" });
    }
  }

  handleSubmit(event) {
    email = this.state.value;
    let doesEmailExist = false
    for (let i = 0; i < database.length; i++) {
      if (database[i].email == email) {
        doesEmailExist = true
      }
    }
      if(!doesEmailExist){
        this.setState({ redirect: "/CreateAccountForm" });
        } else {
          this.setState({ redirect: "/LoginForm" });
        }
        this.props.history.push({
          pathname: this.state.redirect,
          data: { email: this.state.value },
        });
    event.preventDefault();
  
}

  render() {
    return (
      <div className="background">
        <form
          className="wrapper"
          name="Email Validator"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            name="email"
            value={this.state.value}
            onChange={this.handleChange}
            className={this.state.emailClass}
            required
          ></input>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default EmailValidate;
