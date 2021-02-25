import React, { Component, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { withRouter } from "react-router";

class login extends Component {
  // property initialization

  constructor(props) {
    super(props);
    this.state = {
      lastname: "",
      emailaddress: "",
      redirect: false,
      loginState: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handler for submitting the login form
  async handleSubmit(event) {
    event.preventDefault();
    try {
      const emailaddress = this.state.emailaddress;
      const apiUrl = "http://localhost:5000/users/" + emailaddress;
      const response = await fetch(apiUrl);
      const jsonData = await response.json();

      const apiurl2 = "http://localhost:5000/transaction/" + emailaddress;
      const response2 = await fetch(apiurl2);
      const jsonData2 = await response2.json();
      console.log(jsonData);
      console.log(apiUrl);

      this.setState({
        loginState: true,
        email: jsonData.email,
        firstname: jsonData.first_name,
        lastname: jsonData.last_name,
        homecurrency: jsonData.home_currency,
        transactions: jsonData2,
      });

      console.log(jsonData);
      console.log(jsonData2);
      console.log(this.props);
      this.props.history.push({
        pathname: "/home2",
        state: {
          email: this.state.email,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          homecurrency: this.state.homecurrency,
          transactions: this.state.transactions,
        },
      });
      console.log(this.props.history);
    } catch (err) {
      this.setState({ redirect: true });
      console.error(err.message);
    }
  }

  // handler for input changes

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value,
    });
  }

  // render method

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/register" />;
    }
    return (
      <form className="text-center mt-5" onSubmit={this.handleSubmit}>
        <h2>Welcome to Transfer App</h2>
        <div>
          <label>
            <input
              type="text"
              name="emailaddress"
              className="text-center form-control"
              placeholder="E-mail Address"
              value={this.state.emailaddress}
              onChange={this.handleChange}
            />
          </label>
        </div>
        <div>
          <input className="btn btn-success" type="submit" value="Log In" />
        </div>
        <div className="text-center mt-1">
          <Link to="/register">
            <button className="btn btn-outline-secondary btn-sm">
              Register
            </button>
          </Link>
        </div>
      </form>
    );
  }
}

export default withRouter(login);
