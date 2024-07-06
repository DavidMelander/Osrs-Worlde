import React from 'react';
import styled from 'styled-components';

const LivesContainer = styled.div`
  margin-bottom: 20px;
`;

const Life = styled.span`
  color: ${({ active }) => (active ? 'red' : '#ccc')};
  font-size: 24px;
  margin: 0 5px;
`;

function Lives({ lives }) {
  return (
    <LivesContainer>
      {Array.from({ length: 3 }, (_, idx) => (
        <Life key={idx} active={idx < lives}>
          ❤
        </Life>
      ))}
    </LivesContainer>
  );
}

export default Lives;
