import React from 'react';
import axios from 'axios';
import { token, budgetId } from '../../../identifiers';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sinceDate: this.getFiveDaysAgo(),
      transactions: [],
    };
  }

  getFiveDaysAgo() {
    let day = new Date();
    return new Date(day.setDate(day.getDate() - 5));
  }

  componentDidMount() {
    const { sinceDate } = this.state;
    axios({
      method: 'get',
      headers: { Authorization: `Bearer ${token}` },
      url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/transactions`,
      params: {
        since_date: `${sinceDate}`,
      },
    })
      .then(({ data: transactions }) => {
        this.setState({ transactions });
      })
      .catch((err) => { console.error(err); });
  }

  render() {
    const { transactions } = this.state;
    return (
      <div>
        {JSON.stringify(transactions)}
      </div>
    );
  }
}
