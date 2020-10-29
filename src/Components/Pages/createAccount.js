import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import isEmail from "validator/lib/isEmail";

import EmailValidate from "./emailValidate.js";

class CreateAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: EmailValidate.value,
      fname: "",
      lname: "",
      password: "",
      img: "",
      emailInUse: "emailInUse",
      emailClass: "emailClass",
      passwordChar: "hidePasswordCharAlert",
      passwordNumber: "hidePasswordNumAlert",
      passwordBool: "fail",
      passwordBool2: "fail",

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();

  }

  componentDidMount() {
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

    if (name === "email") {
      if (!isEmail(value)) {
        this.setState({ emailClass: "emailClass flagValidator" });
      } else {
        console.log(value);
        axios({
          method: "get",
          url: "http://localhost:3000/AAAUsers?email=" + value,
        }).then(
          (response) => {
            if (response.data.length === 0) {
              this.setState({ emailInUse: "emailInUse" });
            } else {
              this.setState({ emailInUse: "flagEmailInUse" });
            }
          },
          (error) => {
            console.log(error);
          }
        );
        this.setState({ emailClass: "emailClass" });
      }
    }

    var pattern = new RegExp(".*[0-9].*");

    if (name === "password") {
      //double boolean ( this can get optimised)
      if (value.length <= 6) {
        this.setState({ passwordChar: "flagPassword" });
        this.setState({ passwordBool: "fail" });
      } else {
        this.setState({ passwordChar: "hidePasswordCharAlert" });
        this.setState({ passwordBool: "pass" });
      }

      if (pattern.test(value)) {
        this.setState({ passwordNumber: "hidePasswordNumAlert" });
        this.setState({ passwordBool2: "pass" });
      } else {
        this.setState({ passwordNumber: "flagPassword" });
        this.setState({ passwordBool2: "fail" });
      }
    }
  }

  handleSubmit(event) {


   

    if (
      this.state.passwordBool === "pass" &&
      this.state.passwordBool2 === "pass"
    ) {
      console.log("it through");
      let user = {
        email: this.state.email,
        first_name: this.state.fname,
        last_name: this.state.lname,
        password: this.state.pwd,
        avatar: this.state.img,
      };

      if (user.avatar === "") {
        user.avatar =
          "https://randomuser.me/api/portraits/lego/" +
          Math.floor(Math.random() * 10) +
          ".jpg";
      }

      axios({
        method: "get",
        url: "http://localhost:3000/AAAUsers?email=" + user.email,
      }).then(
        (response) => {
          if (response.data.length === 0) {
            //if email is not taken

            axios({
              method: "post",
              url: "http://localhost:3000/AAAUsers",
              data: user,
            }).then((response) => {
              localStorage.setItem("logUser", JSON.stringify(user));
              this.setState({ redirect: "/homepage" });
            });
          } else {
          }

          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    event.preventDefault();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <form
        className="wrapper"
        name="Create Account"
        method="post"
        onSubmit={this.handleSubmit}
      >
        <div className='innerWrapper'>
        <label htmlFor="email">Enter your email:</label>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
          className={this.state.emailClass}
          required
        ></input>
        <span className={this.state.emailInUse}>
          This Email Is already Registered
        </span>

        <label htmlFor="fname">First name:</label>
        <input
          type="text"
          placeholder="Enter First Name"
          name="fname"
          value={this.state.fname}
          onChange={this.handleChange}
          required
        ></input>

        <label htmlFor="lname">Last name:</label>
        <input
          type="text"
          placeholder="Enter Last Name"
          name="lname"
          value={this.state.lname}
          onChange={this.handleChange}
          required
        ></input>

        <label htmlFor="pwd">Password:</label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          autoComplete="off"
          value={this.state.password}
          onChange={this.handleChange}
          required
        ></input>
        <span className={this.state.passwordChar}>
          Password must contain at least 6 characthers
        </span>
        <span className={this.state.passwordNumber}>
          Password must contain at least 1 numbers
        </span>
        <label className={"chooseAvatarlabel"} htmlFor="img">
        Choose Avatar:</label>
        <label className={"chooseAvatarlabel"} htmlFor="img">
          <input
            className={"uploadAvatar"}
            placeholder="chooseAvatar"
            defaultValue=""
            id="img"
            type="file"
            ref={this.fileInput}
            name="img"
            accept="image/*"
            value={this.state.img}
            onChange={this.handleChange}
          ></input>
            <i className="altUploadAvatar" placeholder="Click Here to Upload Avatar">Upload Avatar</i> 
        </label>

        <div className="termsWrapper">
          <input className={"radioTerms"} type="checkbox" required></input>
          <label className={"textTerms"} htmlFor="vehicle1">
            <p>
              Tick to accept the{" "}
              <a href="https://en.wikipedia.org/wiki/Terms_of_service">
                Terms And Conditions
              </a>
            </p>{" "}
          </label>
        </div>


        <div className='createOuterButtons'>
        <input type="submit" value="Submit" />
        <input type="reset"></input>
        <Link to="/LoginForm" className='linkRedirect'><p className='linkButton' >LoginForm</p></Link>
        </div>
        </div>
      </form>
    );
  }
}

export default CreateAccountForm;
