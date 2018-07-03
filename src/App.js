import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const contracts = await PizzeriaFactory.methods.pizzeriaFactories().call();
    //const list = await lottery.methods.getContracts().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "You have been entered!" + "  " + accounts[0] });
  };

  onClickOne = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });
    await lottery.methods.pickWinnerOne().send({
      from: accounts[0]
    });

    this.setState({
      message: "A winner has been picked!" + "  " + accounts
    });
  };

  onClickTwo = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinnerTwo().send({
      from: accounts[0]
    });

    this.setState({
      message: "A winner has been picked!" + "  " + accounts
    });
  };

  render() {
    return (
      <div>
        <h2>Betting Ethereum Blockchain Smart Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} people enter competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>
            {" "}
            Select from Anyone of the upcoming games and generate a bet link
          </h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner></h4>
        <button onClick={this.onClickOne}>Winner One!</button>
        <button onClick={this.onClickTwo}>Winner Two!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
