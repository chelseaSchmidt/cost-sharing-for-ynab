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

const Subtitle = styled.header`
  width: 100%;
  font-weight: bold;
  font-size: 20px;
  margin: 0 0 20px 0;
  text-align: center;
  color: #2f73b3;
`;

const Divider = styled.div`
  box-sizing: border-box;
  border-top: 1px solid lightgray;
  margin: 70px 0;
  width: 100%;
`;

/* Helper Functions */

const parseMarkdownToHtml = (text: string) => {
  const boldPattern = /(\*\*)/;
  const italicPattern = /(__)/;

  const substrings = text.split(boldPattern).flatMap((substring) => substring.split(italicPattern));

  let isBoldOn = false;
  let isItalicOn = false;

  return substrings.map((substring) => {
    if (substring === '**') isBoldOn = !isBoldOn;
    else if (substring === '__') isItalicOn = !isItalicOn;
    else {
      if (isBoldOn && isItalicOn) {
        return (
          <b key={substring}>
            <em>{substring}</em>
          </b>
        );
      }
      if (isBoldOn) return <b key={substring}>{substring}</b>;
      if (isItalicOn) return <em key={substring}>{substring}</em>;
      return substring;
    }

    return '';
  });
};

/* Main Component */

interface ListItem {
  text: string;
  subList?: { text: string; isHidden?: boolean }[];
  isHidden?: boolean;
}

const Instructions = ({ isHomePage = false, style = {} }) => {
  const listItemsBasic: ListItem[] = [
    {
      text: 'Add an **IOU account in YNAB:** this account will track what you are owed from the person sharing a card/account with you.',
      subList: [
        { text: 'Click **Add Account** in YNAB' },
        { text: "Select an account type of **Checking** (or Cash—this doesn't matter so much)" },
        { text: 'Nickname the account something like **"Owed from [__insert person\'s name__]"**' },
      ],
    },
    {
      text: 'Add your **shared credit card/bank account** as a YNAB account and sync it with your bank, or add transactions manually. ',
    },
    {
      text: 'Click **Start** below. You will need your YNAB credentials.',
      isHidden: !isHomePage,
    },
    {
      text: 'Follow each step in the app to select your shared costs over a given date range and split a specified percentage of them into the IOU account you created earlier.',
      subList: [
        {
          text: '__Cost Sharing for YNAB achieves this by creating a single transaction in your budget, which can be reviewed and/or edited directly in YNAB afterward.__',
        },
      ],
    },
    {
      text: "When you're repaid the owed amount, add a **transfer transaction** from the IOU account to the bank or cash account where you deposited the repayment. This will zero out the IOU account while keeping your bank account perfectly balanced, as all things should be!",
    },
  ];

  const listItemsAdvanced: ListItem[] = [
    {
      text: 'This will involve adjusting how you categorize transactions in YNAB. Create a **parent** category in your YNAB budget named something like "Shared Expenses"',
    },
    {
      text: 'Add desired **sub-categories** underneath the "Shared Expenses" parent (such as rent, groceries, etc.)',
    },
    { text: 'Classify any shared-cost transactions to these categories' },
    {
      text: 'When using Cost Sharing for YNAB, select your "Shared Expenses" category in the available options.',
      subList: [
        {
          text: 'This will make all transactions in your "Shared Expenses" sub-categories available to split, whether or not they\'re charged to your shared accounts.',
        },
        { text: 'A warning will display next to transactions charged to a non-shared account.' },
        {
          text: 'A list of warnings will be displayed showing transactions charged to a shared account, but not added to a shared category.',
        },
      ],
    },
  ];

  return (
    <Container style={style}>
      <Subtitle>Basic</Subtitle>
      <ListItems items={listItemsBasic} />

      <Divider />

      <Subtitle>Optional: Automate checking for misclassified transactions</Subtitle>
      <ListItems items={listItemsAdvanced} />
    </Container>
  );
};

export default Instructions;

function ListItems({ items }: { items: ListItem[] }) {
  return items.map(
    (item) =>
      !item.isHidden && (
        <li key={item.text}>
          {parseMarkdownToHtml(item.text)}

          {item.subList && (
            <ul>
              {item.subList.map(
                (subItem) =>
                  !subItem.isHidden && (
                    <li key={subItem.text}>{parseMarkdownToHtml(subItem.text)}</li>
                  ),
              )}
            </ul>
          )}
        </li>
      ),
  );
}
