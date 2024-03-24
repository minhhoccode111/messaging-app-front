import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Footer, Header } from './../components';
import { get, set } from './../methods/index';
import axios from 'axios';

// things only need to fetch once, like other users and groups
async function useInitFetch() {
  //
  return {};
}

export default function Layout() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  // login state on local storage
  const [loginState, setLoginState] = useState({});

  // app theme
  const [isLightTheme, setIsLightTheme] = useState(true);

  // init user data on local storage if has
  useEffect(() => {
    const state = get();

    // only use when token not expired
    if (new Date(state.expiresInDate) > new Date()) setLoginState(() => state);
    else set({});
  }, []);

  return (
    <>
      <Header isLightTheme={isLightTheme} setIsLightTheme={setIsLightTheme} loginState={loginState} />

      {/* dynamic part */}
      <main className="flex-1 flex flex-col">
        <Outlet context={{ setLoginState }} />
      </main>

      {/* footer part */}
      {pathname !== '/' && <Footer />}
    </>
  );
}
