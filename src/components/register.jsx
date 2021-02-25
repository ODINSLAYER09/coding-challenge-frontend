import React, { Component, useState } from "react";
import { Link, Redirect } from "react-router-dom";

class Register extends Component {
  // initialize properties

  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      emailaddress: "",
      homecurrency: "",
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handler for registration form submission

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const body = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.emailaddress,
        homecurrency: this.state.homecurrency,
      };
      const emailaddress = this.state.emailaddress;
      const apiUrl = "http://localhost:5000/users";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      console.log(jsonData);

      // reloads registration page if account already exists
      if (jsonData === emailaddress + " already exists") {
        window.location = "/register";
      } else {
        const apiurl2 = "http://localhost:5000/transaction/" + emailaddress;
        const response2 = await fetch(apiurl2);
        const jsonData2 = await response2.json();
        console.log(jsonData);
        console.log(apiUrl);

        this.setState({
          email: jsonData.email,
          firstname: jsonData.first_name,
          lastname: jsonData.last_name,
          homecurrency: jsonData.home_currency,
          transactions: jsonData2,
        });

        console.log(jsonData);
        console.log(jsonData2);
        console.log(this.props);

        //send data to home2 component
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
      }
    } catch (err) {
      const redirect = this.state;
      this.setState({ redirect: true });
      console.log(redirect);
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
    return (
      <form className="text-center mt-5" onSubmit={this.handleSubmit}>
        <h2>Welcome to Transfer App</h2>
        <div>
          <label>
            <input
              type="text"
              name="firstname"
              className="text-center form-control"
              placeholder="First Name"
              value={this.state.firstname}
              onChange={this.handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="text"
              name="lastname"
              className="text-center form-control"
              placeholder="Last Name"
              value={this.state.lastname}
              onChange={this.handleChange}
            />
          </label>
        </div>
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
          <label>
            <select
              className="text-center form-control"
              name="homecurrency"
              value={this.state.homecurrency}
              onChange={this.handleChange}
            >
              <option value="" default disabled>
                Select Home Currency
              </option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="JPY">JPY</option>
            </select>
          </label>
        </div>
        <div>
          <div>
            <input className="btn btn-primary" type="submit" value="Register" />
          </div>
          <div className="text-center mt-1">
            <Link to="/login">
              <button className="btn btn-outline-secondary btn-sm">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </form>
    );
  }
}

export default Register;
