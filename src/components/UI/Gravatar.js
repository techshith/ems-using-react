import React from 'react';
import Gravatar from 'react-gravatar';

const Gravatar = ({ email }) => {
  return <Gravatar email={email} size={40} className="avatar" />;
};

export default Gravatar;
