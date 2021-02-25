import React, { Component, Fragment } from "react";

//components

import NewTransaction from "./newtransaction2";

//home class definition

class ListTransactions extends Component {
  // property initialization

  constructor(props) {
    super(props);
    this.state = {
      lastname: this.props.location.state.lastname,
      emailaddress: this.props.location.state.email,
      homecurrency: this.props.location.state.homecurrency,
      firstname: this.props.location.state.firstname,
      alltransactions: this.props.location.state.transactions,
      transactions: this.props.location.state.transactions,
      filter: "All Transactions",
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  // handler for closing modals/pop-ups

  handleClose(event) {
    event.preventDefault();
    this.setState({
      email: "",
      firstname: "",
      homecurrency: "",
      lastname: "",
    });
    console.log(this.state);
    window.location = "/";
  }

  // handler for transaction filtering

  handleFilter(event) {
    const value = event.target.value;
    const emailaddress = this.state.emailaddress;
    if (value === "What I Sent") {
      const filteredTransaction = this.state.alltransactions.filter(
        (transaction) => transaction.s_email.includes(emailaddress)
      );
      console.log(emailaddress);
      console.log(filteredTransaction);
      this.setState({
        filter: value,
        transactions: filteredTransaction,
      });
      console.log(this.state.transactions);
    } else {
      if (value === "What I Received") {
        const filteredTransaction = this.state.alltransactions.filter(
          (transaction) => transaction.r_email.includes(emailaddress)
        );
        console.log(emailaddress);
        console.log(filteredTransaction);
        this.setState({
          filter: value,
          transactions: filteredTransaction,
        });
        console.log(this.state.transactions);
      } else {
        const filteredTransaction = this.state.alltransactions;
        this.setState({
          filter: value,
          transactions: filteredTransaction,
        });
        console.log(this.state.transactions);
      }
    }
  }

  // render function

  render() {
    console.log(this.props.location.state);
    const email = this.props.location.state.email;
    const firstname = this.props.location.state.firstname;
    const lastname = this.props.location.state.lastname;
    const homecurrency = this.props.location.state.homecurrency;
    const transactions = this.state.transactions;
    const filter = this.state.filter;
    return (
      <Fragment>
        <h1 className="text-center mt-5">
          Hello {firstname} {lastname}!
        </h1>
        <h5 className="text-center">
          Welcome to Transfer App, your current Home Currency is {homecurrency}
        </h5>
        <div className="text-center mt-5">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              className="btn btn-secondary"
              name="allTransactions"
              value="All Transactions"
              onClick={this.handleFilter}
            >
              All Transactions
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              value="What I Sent"
              onClick={this.handleFilter}
            >
              What I sent
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              value="What I Received"
              onClick={this.handleFilter}
            >
              What I received
            </button>
          </div>
          <div className="mt-3">Showing {filter}</div>
        </div>
        <table className="table mt-2 table-striped">
          <thead class="thead-dark center-text">
            <tr>
              <th>Sender Email</th>
              <th>Amount Sent</th>
              <th>Home Currency</th>
              <th>Transaction Date</th>
              <th>Receiver Email</th>
              <th>Amount Received</th>
              <th>Receiver Home Currency</th>
              <th>Conversion Rate</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr>
                <td key={transaction.transaction_id}>{transaction.s_email}</td>
                <td key={transaction.transaction_id + 1}>
                  {transaction.s_amount}
                </td>
                <td key={transaction.transaction_id + 2}>
                  {transaction.s_home_currency}
                </td>
                <td key={transaction.transaction_id + 3}>
                  {transaction.transaction_date}
                </td>
                <td key={transaction.transaction_id + 4}>
                  {transaction.r_email}
                </td>
                <td key={transaction.transaction_id + 5}>
                  {transaction.r_amount}
                </td>
                <td key={transaction.transaction_id + 6}>
                  {transaction.r_home_currency}
                </td>
                <td key={transaction.transaction_id + 7}>
                  {transaction.conversion_rate}
                </td>
                <td key={transaction.transaction_id + 8}>
                  {transaction.t_notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center mt-5">
          <NewTransaction homecurrency={homecurrency} email={email} />
        </div>
        <div className="text-center mt-1">
          <button
            type="button"
            className="btn btn-info btn-sm"
            onClick={this.handleClose}
          >
            Logout
          </button>
        </div>
      </Fragment>
    );
  }
}
export default ListTransactions;
