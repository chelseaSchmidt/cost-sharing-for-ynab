import React from 'react';
import TransactionWindow from './TransactionWindow';
import { getCCTransactions, getDTFTransactions } from '../../utilities/http';
import {
  getFiveDaysAgo,
  convertDateToString,
  convertStringToDate,
  checkIfDateInRange,
} from '../../utilities/dateHelpers';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sinceDate: getFiveDaysAgo(),
      endDate: new Date(),
      ccTransactions: [],
      dueToFromTransactions: [],
    };
    this.handleDateInput = this.handleDateInput.bind(this);
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
  }

  componentDidMount() {
    const { sinceDate } = this.state;
    let ccTransactions = [];
    let dueToFromTransactions = [];

    getCCTransactions(sinceDate)
      .then(({ data: { data: { transactions } } }) => {
        ccTransactions = transactions;
        return getDTFTransactions(sinceDate);
      })
      .then(({ data: { data: { transactions } } }) => {
        dueToFromTransactions = transactions;
        this.setState({ ccTransactions, dueToFromTransactions });
      })
      .catch((err) => { console.error(err); });
  }

  handleDateInput(e) {
    if (e.target.id === 'start') {
      this.setState({ sinceDate: convertStringToDate(e.target.value) });
    } else {
      this.setState({ endDate: convertStringToDate(e.target.value, false) });
    }
  }

  handleDateSubmit(e) {
    e.preventDefault();
    const { sinceDate, endDate } = this.state;
    let ccTransactions = [];
    let dueToFromTransactions = [];

    getCCTransactions(sinceDate)
      .then(({ data: { data: { transactions } } }) => {
        ccTransactions = transactions.filter((txn) => checkIfDateInRange(txn.date, endDate));
        return getDTFTransactions(sinceDate);
      })
      .then(({ data: { data: { transactions } } }) => {
        dueToFromTransactions = transactions.filter((txn) => checkIfDateInRange(txn.date, endDate));
        this.setState({ ccTransactions, dueToFromTransactions });
      })
      .catch((err) => { console.error(err); });
  }

  render() {
    const {
      ccTransactions,
      dueToFromTransactions,
      sinceDate,
      endDate,
    } = this.state;

    return (
      <div>
        <form>
          <label htmlFor="start">
            Specify start date:
            <input
              type="date"
              id="start"
              value={convertDateToString(sinceDate)}
              onChange={this.handleDateInput}
            />
          </label>
          <label htmlFor="start">
            Specify end date:
            <input
              type="date"
              id="end"
              value={convertDateToString(endDate)}
              onChange={this.handleDateInput}
            />
          </label>
          <button type="submit" onClick={this.handleDateSubmit}>Update Transactions</button>
        </form>
        <div>
          <TransactionWindow transactions={ccTransactions} />
        </div>
        <div>
          <TransactionWindow transactions={dueToFromTransactions} />
        </div>
      </div>
    );
  }
}
