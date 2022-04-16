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
      text: 'Add an **IOU account in YNAB:** this account will track what your partner owes you for their half of the credit card debt.',
      subList: [
        { text: 'Click **Add Account** in YNAB' },
        { text: 'Select an account type of **Checking** (or Cash - this doesn\'t matter so much)' },
        { text: 'Nickname the account something like **"Owed from [__insert partner\'s name__]"**' },
      ],
    },
    {
      text: 'Add the **shared credit card** as a YNAB account and sync it with your bank, or add transactions manually. Classify transactions to the shared expense categories you created earlier.',
    },
    {
      text: 'Click **Start** below. You will need your YNAB credentials.',
      isHidden: !isHomePage,
    },
    {
      text: 'The app will guide you through selecting your shared costs over a custom date range. Then it will create a single transaction **removing half the costs from your expenses,** and **adding the same amount to the IOU account you created,** reflecting the balance your partner owes you. You\'ll be able to see the transaction in YNAB, and delete or edit it if needed.',
    },
    {
      text: 'When your partner pays you back the balance, add a **transfer transaction** from the IOU account to the bank or cash account where you deposited the money. This will zero out the IOU account and make your bank account perfectly balanced, as all things should be!',
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
