import React from 'react';
import { getCCTransactions, getDTFTransactions } from '../../utilities/http';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sinceDate: this.getFiveDaysAgo(),
      ccTransactions: [],
      dueToFromTransactions: [],
    };
  }

  componentDidMount() {
    const { sinceDate } = this.state;
    let ccTransactions = [];
    let dueToFromTransactions = [];

    getCCTransactions(sinceDate)
      .then(({ data: transactions }) => {
        ccTransactions = transactions;
        return getDTFTransactions(sinceDate);
      })
      .then(({ data: transactions }) => {
        dueToFromTransactions = transactions;
        this.setState({ ccTransactions, dueToFromTransactions });
      })
      .catch((err) => { console.error(err); });
  }

  getFiveDaysAgo() {
    const day = new Date();
    return new Date(day.setDate(day.getDate() - 5));
  }

  render() {
    const { ccTransactions, dueToFromTransactions } = this.state;
    return (
      <div>
        <label htmlFor="start">Specify start date:</label>
        <input type="date" id="start" />
        <label htmlFor="start">Specify end date:</label>
        <input type="date" id="end" />
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
