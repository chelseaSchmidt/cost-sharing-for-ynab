import React from 'react';
import _ from 'lodash';
import TransactionWindow from './TransactionWindow';
import { getCCTransactions, getDTFTransactions } from '../../utilities/http';
import { dueToFromId } from '../../../identifiers';
import {
  getFiveDaysAgo,
  convertDateToString,
  convertStringToDate,
  checkIfDateInRange,
} from '../../utilities/dateHelpers';
import '../styles/App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sinceDate: getFiveDaysAgo(),
      endDate: new Date(),
      ccTransactions: [],
      dueToFromTransactions: [],
      checkedTransactions: [],
      splitDate: new Date(),
    };
    this.handleDateInput = this.handleDateInput.bind(this);
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
    this.handleSelectTransaction = this.handleSelectTransaction.bind(this);
    this.createSplitEntry = this.createSplitEntry.bind(this);
    this.handleSplitDateInput = this.handleSplitDateInput.bind(this);
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

  handleSplitDateInput(e) {
    this.setState({ splitDate: convertStringToDate(e.target.value) });
  }

  handleSelectTransaction(e, transaction) {
    const { checkedTransactions } = this.state;
    if (e.target.checked) {
      checkedTransactions.push(transaction);
    } else {
      const deletionIndex = checkedTransactions.reduce((finalIdx, txn, currIdx) => (
        txn.id === transaction.id ? currIdx : finalIdx
      ), null);
      checkedTransactions.splice(deletionIndex, 1);
    }
    this.setState({ checkedTransactions });
  }

  createSplitEntry(e) {
    e.preventDefault();
    const { checkedTransactions, splitDate } = this.state;
    const halvedCostsByCategory = checkedTransactions.reduce((totals, txn) => {
      if (txn.category_id in totals) {
        totals[txn.category_id] += Number((txn.amount / 1000 / 2).toFixed(2));
      } else {
        totals[txn.category_id] = Number((txn.amount / 1000 / 2).toFixed(2));
      }
      return totals;
    }, {});
    const summaryTransaction = {
      account_id: dueToFromId,
      date: convertDateToString(splitDate),
      amount: _.reduce(halvedCostsByCategory, (sum, amt) => sum + amt) * 1000,
      payee_id: null,
      payee_name: null,
      category_id: '7607479b-f7f2-eef4-a7bb-fadb5821307d',
      memo: null,
      cleared: 'uncleared',
      approved: true,
      flag_color: null,
      import_id: null,
      subTransactions: _.map(halvedCostsByCategory, (amt, catId) => ({
        amount: amt * 1000,
        payee_id: null,
        payee_name: null,
        category_id: catId,
        memo: null,
      })),
    };
    console.log(checkedTransactions, summaryTransaction);
    // post transaction to YNAB
  }

  render() {
    const {
      ccTransactions,
      dueToFromTransactions,
      sinceDate,
      endDate,
      checkedTransactions,
      splitDate,
    } = this.state;

    const transactionsSelected = checkedTransactions.length > 0;

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
        {
          transactionsSelected
          && (
            <div>
              <form>
                <button type="submit" onClick={this.createSplitEntry}>
                  Split Selected Transactions On Date
                </button>
                <input
                  type="date"
                  id="split-date"
                  value={convertDateToString(splitDate)}
                  onChange={this.handleSplitDateInput}
                />
              </form>
            </div>
          )
        }
        <div id="transaction-area">
          <div>
            <TransactionWindow
              title="Credit Card Account"
              transactions={ccTransactions}
              handleSelectTransaction={this.handleSelectTransaction}
            />
          </div>
          <div>
            <TransactionWindow
              title="Due To/From Account"
              transactions={dueToFromTransactions}
              handleSelectTransaction={this.handleSelectTransaction}
            />
          </div>
        </div>
      </div>
    );
  }
}
