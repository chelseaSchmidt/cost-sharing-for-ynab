import styled from 'styled-components';
import Accordion from './Accordion';

/* STYLED COMPONENTS */

const Container = styled.div``;

const Subtitle = styled.header`
  width: 100%;
  font-weight: bold;
  font-size: 20px;
  margin: 20px 0;
  text-align: center;
  color: #2f73b3;
`;

const Divider = styled.div`
  border-top: 1px solid lightgray;
  margin: 70px 0;
  width: 100%;
`;

/* MAIN */

export default function Instructions({ isHomePage = false, style = {} }) {
  return (
    <Container style={style}>
      <Subtitle>Prepare your YNAB budget</Subtitle>

      {[
        {
          title: 'Create an "IOU" account in YNAB',
          children:
            'This account will track what you are owed from the person sharing an account with you. In YNAB, click "Add Account", then "Add an Unlinked Account", and nickname it something like "Owed from [person\'s name]." The account type should be Checking, Savings, or Cash.',
        },
        {
          title: 'Add your shared credit card or bank account in YNAB',
          children:
            'Add your shared account in YNAB and sync it with your bank, or add transactions manually.',
        },
      ].map((props) => (
        <Accordion {...props} key={props.title} />
      ))}

      <Subtitle>Use the app</Subtitle>

      {[
        isHomePage
          ? {
              title: 'Click "Start" and authorize Cost Sharing for YNAB',
              subtitle: '"Start" button located above and in the header menu',
              children:
                'You will be redirected to a YNAB page where you can securely log in. Afterward, you will be asked to authorize Cost Sharing for YNAB to make changes to your budget. You will then be redirected to the Cost Sharing for YNAB app.',
            }
          : null,
        {
          title: 'Follow each guided step',
          children:
            'Follow each step in the app to select your shared costs over a given date range and split a specified percentage of them into the IOU account you created earlier. Cost Sharing for YNAB achieves this by creating a single transaction in your budget. From there, the created transaction will be like any other transaction in your budget—it can be edited or deleted at will. So feel free to experiment!',
        },
      ]
        .filter((props) => props !== null)
        .map((props) => (
          <Accordion {...props} key={props.title} />
        ))}

      <Subtitle>Record repayments</Subtitle>

      {[
        {
          title: 'When you receive a repayment, record it as a transfer from the IOU account',
          children:
            "When you're repaid an owed amount, add it as a transfer in YNAB: an outflow from the IOU account and inflow to the bank or cash account where you deposited the repayment. This will zero out the IOU account, while keeping your bank account perfectly balanced, as all things should be!",
        },
      ].map((props) => (
        <Accordion {...props} key={props.title} />
      ))}

      <Divider />

      <Subtitle>Advanced: Automate checking for misclassified transactions</Subtitle>

      {[
        {
          title: 'Create a parent category called "Shared Expenses"',
          children:
            'This method of tracking shared costs will involve adjusting how you categorize transactions in YNAB. Create a new parent category in YNAB and name it something like "Shared Expenses".',
        },
        {
          title: 'Add various categories under "Shared Expenses"',
          children: 'Such as rent, groceries, etc.',
        },
        {
          title: 'Classify your shared costs to these categories',
          children:
            'Record transactions in your budget normally, but for costs that you expect to split with someone, use your new shared-cost categories.',
        },
        {
          title: 'When using the app, switch to the "Advanced" recording method',
          children:
            'Switch to the "Advanced" recording method and select your "Shared Expenses" parent category in the available options. This will make all transactions in your "Shared Expenses" categories available to split, whether or not they\'re charged to your shared credit cards or shared accounts. Instead, warnings will display next to transactions charged to non-shared accounts, and a list of warnings will be displayed for transactions charged to a shared account, but not added to a shared category.',
        },
      ].map((props) => (
        <Accordion {...props} key={props.title} />
      ))}
    </Container>
  );
}
