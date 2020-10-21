import React from 'react';
import PrivacyPolicy from './PrivacyPolicy';

const Home = () => {
  const url = window.location.href;
  const appEndpoint = 'cost-sharer';
  return (
    <div>
      <a href={`https://app.youneedabudget.com/oauth/authorize?client_id=4ac8ca3c431ac99075e603496136606d7da8102f6178ce2796566b30c4659988&redirect_uri=${url}${appEndpoint}&response_type=token`}>Authenticate and use the app</a>
      <div />
      <a href={`${url}cost-sharer`}>See the app without authenticating</a>
      <PrivacyPolicy />
    </div>
  );
};

export default Home;
