import React from "react";
import axios from "axios";
import loadingIcon from "../../Assets/loading2.gif";
import { Redirect } from "react-router-dom";
import deleteIcon from "../../Assets/cancel.png";
import fakeLogo from "../../Assets/fakeLogo.png";

import { tempDatabase } from "./tempDatabase";

if (localStorage.getItem("Database") == null) {
          // console.log('email submitted')

  localStorage.setItem("Database", JSON.stringify(tempDatabase));
}
let database = JSON.parse(localStorage.getItem("Database"));

// console.log(database);
class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempApiList: [],
      loadingIcon: "hideIcon",
      tempUser: {
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        avatar: "",
        id: 0,
      },
      logUser: null,
      email: "",
      redirect: false,
    };
    if (localStorage.getItem("logUser") !== null) {
      this.state.logUser = JSON.parse(localStorage.getItem("logUser"));
    } else {
      // alert("How did you get here?, Hold on whilst i redirect you");
      this.setState({ redirect: true });
      this.props.history.push({
        pathname: "/",
      });
    }

    this.handleChange = this.handleChange.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  componentDidMount = () => {
    database = JSON.parse(localStorage.getItem("Database"));
    for (let i = 0; i < database.length; i++) {
        database[i].id = i
        localStorage.setItem("Database", JSON.stringify(database));
      }
        
        
        

    this.setState({ loadingIcon: "loadingIcon" });
    this.setState({ tempUser: [] });
    // console.log(database)
    this.setState({
      tempApiList: database,
    });

    this.setState({ loadingIcon: "hideIcon" });
  };

  updateUser = (i, event) => {
    this.setState({ loadingIcon: "hideIcon" });

    const id = event.target.value;
    const userdata = this.state.tempApiList.map((item, j) => {
      if (item.id == id) {
        // axios({
        //   method: "get",
        //   url: `./AAAdb.json` ,
        // })
        // .then((response) => {
        // console.log(database);

        for (let i = 0; i < database.length; i++) {
          if (database[i].id == id) {
            database[i].email = item.email;
            database[i].first_name = item.first_name;
            database[i].last_name = item.last_name;
            database[i].password = item.password;
            database[i].avatar = item.avatar;
            localStorage.setItem("Database", JSON.stringify(database));
          }
        }
        this.componentDidMount();
      }
    });

    event.preventDefault();
  };

  deleteUser(email, id, event) {
    this.setState({ loadingIcon: "loadingIcon" }); // makes loading icon show

    for (let i = 0; i < database.length; i++) {
      if (database[i].id == id) {
        delete database[i];
        database = database.filter(function (x) {
          return x !== null;
        });
        // console.log(database);
        localStorage.setItem("Database", JSON.stringify(database));
      }
    }

    if (email === this.state.logUser.email) {
      alert("you fool, you deleted yourself");

      this.setState({ redirect: true });
    }
    this.setState({ loadingIcon: "hideIcon" }); // hides loading icon

    this.componentDidMount();
  }

  addUser = () => {
    this.setState({ loadingIcon: "loadingIcon" });

    let newUser = {
      email: "Email@email.com",
      first_name: "First_Name",
      last_name: "Last_Name",
      password: "Password",
      avatar:   "https://randomuser.me/api/portraits/lego/" +
          Math.floor(Math.random() * 10) +
          ".jpg",
      id: 17,
    };
    database.push(newUser);
    localStorage.setItem("Database", JSON.stringify(database));


    this.setState({ loadingIcon: "hideIcon" });
    this.componentDidMount();
  
  };

  findValue(id) {
    this.state.tempApiList.find((x) => x.id == id);
  }

  handleChange = (id, event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState((state) => {
      const tempApiList = state.tempApiList.map((item, j) => {
        if (item.id == id) {
          if (name == "avatar") {
            item[name] = event.target.files[0].name;
          } else {
            item[name] = value;
          }
          return item;
        } else {
          return item;
        }
      });

      return {
        tempApiList,
      };
    });
  };

  redirect() {
    this.setState({ redirect: true });
  }

  render() {
    let welcomeMessage = <h1>Hello Guest</h1>;
    if (this.state.logUser != undefined) {
      welcomeMessage = (
        <p>
          Good to see you <i>{this.state.logUser.first_name}</i>
        </p>
      );
    }

    if (this.state.redirect) {
      localStorage.removeItem('logUser');
      return <Redirect to="/" />;
    }

    return (
      <div className="outerApi">
        <div className="buttonOuterFlow">
          <div className="logoWelcomeContainer">
            <div className="width1001">
              <div className="welcomeMessage">{welcomeMessage}</div>
            </div>
            <div className="width100">
              <img src={fakeLogo}></img>
            </div>

            <div className="topButtonContainer">
              <div className="innerTopButtonContainer">
                <button onClick={this.addUser}>Add User</button>
                <button onClick={this.redirect}>Sign Out</button>
              </div>
            </div>
          </div>
        </div>
        <img className={this.state.loadingIcon} src={loadingIcon}></img>

        <div className="outerApilist">
          {this.state.tempApiList.map((content) => (
            <div className="tempApiListInner" key={content.id}>
              <div className="tempApiListTop">
                <div className="imgBorder">
                  <label htmlFor="file-input">
                    <img
                      src={content.avatar}
                      width="128px"
                      height="128px"
                      alt="Profile Pictures"
                    ></img>
                    <input
                      className="hideInput"
                      type="file"
                      id="file-input"
                      name="avatar"
                      accept="image/*"
                      onChange={(e) => this.handleChange(content.id, e)}
                    />
                  </label>
                </div>
                <div className="homepageOuterButtons">
                  <div className="deleteUpdatContainer">
                    <div
                      className="deleteButton"
                      onClick={(e) => {
                        this.deleteUser(content.email, content.id);
                      }}
                      value={content.id}
                    >
                      <img src={deleteIcon}></img>
                    </div>
                  </div>{" "}
                  <div className="updateUserButtonOuter">
                    <button
                      type="button"
                      onClick={(e) => {
                        this.updateUser(content.id, e);
                      }}
                      value={content.id}
                    >
                      Update user
                    </button>
                  </div>
                </div>
              </div>
              <div className="flexRow firstFlexRow">
                <div className="outerLabel">
                  <label className={"labels"}>Email:</label>
                </div>

                <div className="outerInput">
                  <input
                    className={"editableSize"}
                    name="email"
                    value={content.email}
                    placeholder={this.value}
                    onChange={(e) => {
                      this.handleChange(content.id, e);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flexRow">
                <div className="outerLabel">
                  <label className={"labels"}>First Name: </label>
                </div>
                <div className="outerInput">
                  <input
                    className={"editableSize"}
                    name="first_name"
                    value={content.first_name}
                    placeholder={this.value}
                    onChange={(e) => {
                      this.handleChange(content.id, e);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flexRow">
                <div className="outerLabel">
                  <label className={"labels"}>Last Name: </label>
                </div>
                <div className="outerInput">
                  <input
                    className={"editableSize"}
                    name="last_name"
                    value={content.last_name}
                    placeholder={this.value}
                    onChange={(e) => {
                      this.handleChange(content.id, e);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flexRow">
                <div className="outerLabel">
                  <label className={"labels"}>Password: </label>
                </div>
                <div className="outerInput">
                  <input
                    className={"editableSize"}
                    name="password"
                    value={content.password}
                    placeholder={this.value}
                    onChange={(e) => {
                      this.handleChange(content.id, e);
                    }}
                  ></input>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default Homepage;
