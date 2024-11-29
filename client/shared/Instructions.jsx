import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import breakpoints from './breakpoints';

/* Styled Components */

const Container = styled.ol`
  text-align: justify;
  margin: 10px;
  margin-block-start: unset;
  margin-block-end: unset;
  margin-inline-start: unset;
  margin-inline-end: unset;
  padding-inline-start: unset;

  li {
    margin-bottom: 40px;
  }

  li > ul {
    margin: 20px 0 10px 0;
  }

  li > ul > li {
    margin-bottom: 20px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    text-align: unset;
  }
`;

/* Helper Functions */

const parseMarkdownToHtml = (text) => {
  const boldPattern = /(\*\*)/;
  const italicPattern = /(__)/;

  const substrings = text.split(boldPattern)
    .flatMap((substring) => substring.split(italicPattern));

  let isBoldOn = false;
  let isItalicOn = false;

  return substrings.map((substring) => {
    if (substring === '**') isBoldOn = !isBoldOn;
    else if (substring === '__') isItalicOn = !isItalicOn;

    else {
      if (isBoldOn && isItalicOn) return <b key={substring}><em>{substring}</em></b>;
      if (isBoldOn) return <b key={substring}>{substring}</b>;
      if (isItalicOn) return <em key={substring}>{substring}</em>;
      return substring;
    }

    return '';
  });
};

/* Main Component */

const Instructions = ({
  isHomePage = false,
  style = {},
}) => {
  const listItems = [
    { text: 'Create a **parent** category in your YNAB budget named something like "Shared Expenses"' },
    { text: 'Add desired **sub-categories** underneath the "Shared Expenses" parent (such as rent, groceries, etc.)' },
    {
      text: 'Add an **IOU account in YNAB:** this account will track what you are owed as a result of maintaining the shared credit card/bank account.',
      subList: [
        { text: 'Click **Add Account** in YNAB' },
        { text: 'Select an account type of **Checking** (or Cash - this doesn\'t matter so much)' },
        { text: 'Nickname the account something like **"Owed from [__insert person\'s name__]"**' },
      ],
    },
    {
      text: 'Add the **shared credit card/bank account** as a YNAB account and sync it with your bank, or add transactions manually. Classify transactions to the shared expense categories you created earlier.',
    },
    {
      text: 'Click **Start** below. You will need your YNAB credentials.',
      isHidden: !isHomePage,
    },
    {
      text: 'Follow each step in the app to select your shared costs over a given date range and split a specified percentage of them into the IOU account you created earlier. After you hit "Split Costs," a transaction will be created in your YNAB budget that moves the other person\'s share of the costs **out of your expenses** and **into the IOU account**. You can view the transaction in YNAB afterward (and delete or edit it if needed).',
    },
    {
      text: 'When you\'re repaid the owed amount, add a **transfer transaction** from the IOU account to the bank or cash account where you deposited the money. This will zero out the IOU account while keeping your bank account perfectly balanced, as all things should be!',
    },
  ];

  return (
    <Container style={style}>
      {
        listItems.map((item) => (
          !item.isHidden && (
            <li key={item.text}>
              {parseMarkdownToHtml(item.text)}

              {item.subList && (
                <ul>
                  {item.subList.map((subItem) => (
                    !subItem.isHidden && (
                      <li key={subItem.text}>
                        {parseMarkdownToHtml(subItem.text)}
                      </li>
                    )
                  ))}
                </ul>
              )}
            </li>
          )
        ))
      }
    </Container>
  );
};

Instructions.propTypes = {
  isHomePage: PropTypes.bool,
  style: PropTypes.object,
};

export default Instructions;
