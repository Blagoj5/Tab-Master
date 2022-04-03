/* eslint-disable react/jsx-one-expression-per-line */
import styled from 'styled-components';

const ListItem = styled.li`
  li {
    margin-bottom: 10px;
    line-height: 24px;
    code {
      background: hsl(216deg 10% 34%);
      padding: 3px 6px;
      border-radius: 4px;
      letter-spacing: 1px;
    }
  }
`;

type Props = {
  title: string;
  commands?: string[];
  children?: JSX.Element;
};
function DescriptionItem({ title, commands, children }: Props) {
  return (
    <ListItem>
      {title} -{' '}
      {commands?.map((command, index) => (
        <>
          <code>{command}</code>
          {index !== commands.length - 1 && <span> + </span>}
        </>
      ))}
      {children}
    </ListItem>
  );
}

export default DescriptionItem;
