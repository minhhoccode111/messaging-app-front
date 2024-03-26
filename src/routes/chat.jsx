import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Navigate, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error, SubmitButton, CustomButton } from './../components/more';

async function useFetchContact() {
  const { loginState } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dataContact, setDataContact] = useState({});
  const [willFetchContact, setWillFetchContact] = useState(false);

  useEffect(() => {
    async function tmp() {
      try {
        setIsLoading(true);

        const [userContactRes, groupContactRes] = await Promise.all([
          axios({
            mode: 'cors',
            method: 'get',
            url: import.meta.env.VITE_API_ORIGIN + '/chat/users',
            headers: {
              Authorization: `Bearer ${loginState?.token}`,
            },
          }),
          axios({
            mode: 'cors',
            method: 'get',
            url: import.meta.env.VITE_API_ORIGIN + '/chat/groups',
            headers: {
              Authorization: `Bearer ${loginState?.token}`,
            },
          }),
        ]);

        // extract data from responses
        const data = {};
        data.users = userContactRes.data.users;
        data.joinedGroups = groupContactRes.data.joinedGroups;
        data.publicGroups = groupContactRes.data.publicGroups;
        data.privateGroups = groupContactRes.data.privateGroups;

        // console.log(`the data belike: `, data);

        // console.log(userContactRes.data);
        // console.log(groupContactRes.data);

        setDataContact(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    tmp();
    // flag to re-fetch
  }, [willFetchContact]);

  return { isLoading, isError, dataContact, setWillFetchContact };
}

export default function Chat() {
  const { loginState } = useOutletContext();

  // contact data, fetch states, flag to re-fetch
  const { isLoading, isError, dataContact, setWillFetchContact } = useFetchContact();

  // an array of messages to display in chat section
  const [currentMessages, setCurrentMessages] = useState([]);

  // an object to display in options section, {info: {}, members:[]}
  // includes info of current user or group, members for group only
  const [currentOptions, setCurrentOptions] = useState({});

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/'} />;

  return (
    <section className="flex-1 text-slate-900 p-2 grid grid-cols-chat gap-2 max-h-full">
      {/* display contact section */}
      <article className="overflow-y-auto shadow-gray-400 rounded-3xl p-4 shadow-2xl bg-white">
        {/* other users */}
        <div className=""></div>

        {/* joined groups */}
        <div className=""></div>

        {/* public groups */}
        <div className=""></div>

        {/* private groups */}
        <div className=""></div>

        {/* create a group */}
        <div className=""></div>
      </article>

      {/* display chat section */}
      <article className="overflow-y-auto shadow-gray-400 rounded-3xl p-4 shadow-2xl bg-white">
        {/* display old messages section */}
        <div className=""></div>

        {/* form to send message section */}
        <div className=""></div>
      </article>

      {/* display option section */}
      <article className="overflow-y-auto shadow-gray-400 rounded-3xl p-4 shadow-2xl bg-white">
        {/* display user or group  */}
        <div className=""></div>

        {/* display group's members */}
        <div className=""></div>
      </article>
    </section>
  );
}
