import React from 'react';
import { getCCTransactions, getDTFTransactions } from '../../utilities/http';
import { getFiveDaysAgo, convertDateToString, convertStringToDate } from '../../utilities/dateHelpers';

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

  handleDateInput(e) {
    if (e.target.id === 'start') {
      this.setState({ sinceDate: convertStringToDate(e.target.value) });
    } else {
      this.setState({ endDate: convertStringToDate(e.target.value, false) });
    }
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
