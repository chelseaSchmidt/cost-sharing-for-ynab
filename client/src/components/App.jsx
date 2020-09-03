import React from 'react';
import axios from 'axios';
import { token, budgetId, ccId, dueToFromId } from '../../../identifiers';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sinceDate: this.getFiveDaysAgo(),
      ccTransactions: [],
      dueToFromTransactions: [],
    };
  }

  getFiveDaysAgo() {
    let day = new Date();
    return new Date(day.setDate(day.getDate() - 5));
  }

  componentDidMount() {
    const { sinceDate } = this.state;
    let ccTransactions = [];
    let dueToFromTransactions = [];

    axios({
      method: 'get',
      headers: { Authorization: `Bearer ${token}` },
      url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${ccId}/transactions`,
      params: {
        since_date: `${sinceDate}`,
      },
    })
      .then(({ data: transactions }) => {
        ccTransactions = transactions;
        return axios({
          method: 'get',
          headers: { Authorization: `Bearer ${token}` },
          url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${dueToFromId}/transactions`,
          params: {
            since_date: `${sinceDate}`,
          },
        });
      })
      .then(({ data: transactions }) => {
        dueToFromTransactions = transactions;
        this.setState({ ccTransactions, dueToFromTransactions });
      })
      .catch((err) => { console.error(err); });
  }

  render() {
    const { ccTransactions, dueToFromTransactions } = this.state;
    return (
      <div>
        <label htmlFor='start'>Specify start date:</label>
        <input type='date' id='start' />
        <label htmlFor='start'>Specify end date:</label>
        <input type='date' id='end' />
        <div>
          {JSON.stringify(ccTransactions)}
        </div>
        <div>
          {JSON.stringify(dueToFromTransactions)}
        </div>
      </div>
    );
  }
}
