import styled from 'styled-components';
import { Account } from '../types';

/* Styled Components */

const Container = styled.div``;

const Select = styled.select`
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

/* Main Component */

interface Props {
  accounts: Account[];
  setAccountId: (id: string) => void;
  optionIdPrefix?: string;
}

const AccountSelector = ({ accounts, setAccountId, optionIdPrefix = '' }: Props) => {
  return (
    <Container>
      <Select onChange={(e) => setAccountId(e.target.value)} defaultValue="none">
        <option disabled value="none">
          -- select an account --
        </option>

        {accounts.map(({ name, id }) => (
          <option id={`${optionIdPrefix}-${id}`} key={`${optionIdPrefix}-${id}`} value={id}>
            {name}
          </option>
        ))}
      </Select>
    </Container>
  );
};

export default AccountSelector;
