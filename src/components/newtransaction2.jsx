import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

//components

import login from "./login";

class NewTransaction extends Component {
  // property initialization

  constructor(props) {
    super(props);
    this.state = {
      homecurrency: this.props.homecurrency,
      recipient: "",
      fromamount: null,
      users: [],
      options: [],
      conversionrate: 0,
      targetcurrency: "",
      toamount: 0,
      transactionnotes: null,
    };
    this.getConversionRate = this.getConversionRate.bind(this);
    this.GetUsers = this.GetUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.createNewTransaction.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  // new transaction function
  async createNewTransaction(e) {
    e.preventDefault();
    var d = new Date();
    const date = d.toISOString();
    console.log(this.state.date);
    const toamount = this.state.toamount;
    console.log(toamount);
    const tohomecurrency = this.state.targetcurrency;
    console.log(tohomecurrency);
    const toemail = this.state.recipient;
    console.log(toemail);
    try {
      const body = {
        fromemail: this.props.email,
        fromhomecurrency: this.props.homecurrency,
        fromamount: this.state.fromamount,
        transactiondate: date,
        toemail: this.state.recipient,
        toamount: this.state.toamount,
        tohomecurrency: this.state.targetcurrency,
        conversionrate: this.state.conversionrate,
        transactionnotes: this.state.transactionnotes,
      };
      // populates all the transactions on the table
      const apiUrl = "http://localhost:5000/transaction";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      console.log(body);
      console.log(jsonData);

      // database validation for inputs
      // if violates constraints, it will return an error

      if (jsonData === "could not process this transaction") {
        const alertHeader = "Transaction Failed";
        const alertMessage =
          "We could not process this transaction. Make sure all inputs have values.";
        this.setState({
          alertHeader: alertHeader,
          alertMessage: alertMessage,
        });
      } else {
        const alertHeader = "Transaction Successful";
        const alertMessage =
          "You have transferred " +
          toamount +
          " " +
          tohomecurrency +
          " to " +
          toemail;
        this.setState({
          alertHeader: alertHeader,
          alertMessage: alertMessage,
        });
      }

      // fetching user data to supply to the form
      const emailaddress = this.props.email;
      const apiurl2 = "http://localhost:5000/transaction/" + emailaddress;
      const response2 = await fetch(apiurl2);
      const jsonData2 = await response2.json();
      console.log(apiurl2);
      console.log(jsonData2);

      this.setState({
        email: this.props.location.state.email,
        firstname: this.props.location.state.firstname,
        lastname: this.props.location.state.lastname,
        homecurrency: this.props.location.state.homecurrency,
        transactions: jsonData2,
      });

      // will render the home page with updated data
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
      console.log(this.state);
    } catch (err) {
      console.error(err.message);
    }
  }

  // handler for getting users for user selection dropdown
  async GetUsers() {
    try {
      const thisemail = this.props.location.state.email;
      console.log(thisemail);
      const apiUrl = "http://localhost:5000/allusers";
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      console.log(jsonData);
      const filteredJsonData = jsonData.filter(
        (item) => item.email != thisemail
      );
      console.log(filteredJsonData);
      const users = filteredJsonData.map((user, index) => ({
        id: index,
        name: user,
      }));

      // Dynamically create select list
      let options = [];
      users.map((user) =>
        options.push({
          label: user.name.email,
          value: user.name.email,
          firstname: user.name.first_name,
          lastname: user.name.last_name,
        })
      );
      this.setState({
        options: options,
      });
      console.log(users);
      console.log(options);
    } catch (err) {
      console.error(err.message);
    }
  }

  // handler for input changes

  handleChange(event) {
    event.preventDefault();
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value,
    });
    const toamount = this.state.fromamount * this.state.conversionrate;
    console.log(toamount);
    this.setState(
      {
        toamount: toamount,
      },
      () => {}
    );
  }

  // handler for close button

  handleClose(event) {
    event.preventDefault();
    this.setState({
      homecurrency: this.props.homecurrency,
      recipient: "",
      fromamount: null,
      users: [],
      options: [],
      conversionrate: 0,
      targetcurrency: "",
      toamount: 0,
      transactionnotes: null,
    });
    console.log(this.state);
    window.location = "/home2";
  }

  // handler for getting the conversion rate

  async getConversionRate(event) {
    event.preventDefault();
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value,
    });
    const homecurrency = this.props.homecurrency;
    const targetcurrency = value;
    try {
      const apiUrl =
        "https://api.exchangeratesapi.io/latest?base=" +
        homecurrency +
        "&symbols=" +
        targetcurrency;
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      console.log(jsonData);
      var obj = jsonData.rates;
      var array = Object.keys(obj).map((key) => [key, obj[key]]);
      console.log(array);
      const conversionrate = array[0][1];
      this.setState({
        conversionrate: conversionrate,
      });
      console.log(conversionrate);
      console.log(this.state.fromamount);
      const toamount = this.state.fromamount * this.state.conversionrate;
      console.log(toamount);
      this.setState({
        toamount: toamount,
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  // render function

  render() {
    console.log(this.props);
    const options = this.state.options;
    console.log(options);
    const conversionrate = this.state.conversionrate;
    console.log(conversionrate);
    const homecurrency = this.props.homecurrency;
    console.log(homecurrency);
    const toamount = this.state.toamount;
    console.log(toamount);
    const alertHeader = this.state.alertHeader;
    console.log(alertHeader);
    const alertMessage = this.state.alertMessage;
    console.log(alertMessage);
    return (
      <Fragment>
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#myModal"
          onClick={this.GetUsers}
        >
          New Transaction
        </button>
        <div className="modal fade" id="myModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">New Transaction</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label">Recipient</label>
                  <div className="col-sm-5">
                    <select
                      className="form-control text-center"
                      name="recipient"
                      value={this.state.recipient}
                      onChange={this.handleChange}
                    >
                      <option key="0" value="" disabled>
                        Select Recipient
                      </option>
                      {options.map((option) => (
                        <option key={option.index} value={option.value}>
                          {option.firstname} {option.lastname}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label">
                    Amount to be sent
                  </label>
                  <div className="col-sm-5">
                    <input
                      type="number"
                      name="fromamount"
                      className="form-control text-center"
                      placeholder="Enter amount"
                      value={this.state.fromamount}
                      onChange={this.handleChange}
                    ></input>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label">
                    Home Currency
                  </label>
                  <div className="col-sm-5">
                    <button type="button" className="form-control badge-light">
                      {homecurrency}
                    </button>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label">
                    Target Currency
                  </label>
                  <div className="col-sm-5">
                    <select
                      className="text-center form-control"
                      name="targetcurrency"
                      value={this.state.targetcurrency}
                      onChange={this.getConversionRate}
                    >
                      <option key="0" value="" defaultValue disabled>
                        Select Currency
                      </option>
                      <option value="EUR" key="1">
                        EUR
                      </option>
                      <option value="USD" key="2">
                        USD
                      </option>
                      <option value="JPY" key="3">
                        JPY
                      </option>
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label">
                    Amount to be received
                  </label>
                  <div className="col-sm-5">
                    <button type="badge" className="form-control badge-info">
                      {toamount}
                    </button>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label">
                    Conversion Rate
                  </label>
                  <div className="col-sm-5">
                    <button type="button" className="form-control badge-light">
                      {conversionrate}
                    </button>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label">Notes</label>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      className="form-control text-center"
                      name="transactionnotes"
                      placeholder="Add notes"
                      value={this.state.transactionnotes}
                      onChange={this.handleChange}
                    ></input>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={(e) => this.createNewTransaction(e)}
                  data-dismiss="modal"
                  data-toggle="modal"
                  data-target="#alertModal"
                >
                  Proceed
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                  onClick={this.handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal fade" id="alertModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">{alertHeader}</h4>
                <button type="button" class="close" data-dismiss="modal">
                  &times;
                </button>
              </div>

              <div class="modal-body">{alertMessage}</div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-danger"
                  data-dismiss="modal"
                  onClick={this.handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(NewTransaction);
