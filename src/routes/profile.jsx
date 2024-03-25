import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error } from './../components';
import { domParser } from './../methods/index';
import { set } from './../methods/index';

export default function Profile() {
  const { loginState, setLoginState } = useOutletContext();

  // display error messages in form
  const [errorMessage, setErrorMessage] = useState('');

  // update fetching states
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isErrorUpdate, setIsErrorUpdate] = useState(false);

  // display section
  const [isUpdate, setIsUpdate] = useState(false);

  // tracking form states
  const formRef = useRef(null);

  // input states that need to keep track
  const [avatarLink, setAvatarLink] = useState(loginState?.user?.avatarLink);
  const [fullname, setFullname] = useState(loginState?.user?.fullname);

  useEffect(() => {
    if (fullname?.trim()?.length === 0) setErrorMessage(`Fullname cannot be empty`);
    else setErrorMessage(``);
  }, [fullname, formRef]);

  async function handleUpdateSubmit(e) {
    e.preventDefault();

    // console.log(formRef.current);

    const fullname = formRef.current[0].value;
    const status = formRef.current[1].value;
    const bio = formRef.current[2].value;
    const dateOfBirth = formRef.current[3].value;
    const avatarLink = formRef.current[4].value;

    // console.log(`fullname belike: `, fullname);
    // console.log(`status belike: `, status);
    // console.log(`bio belike: `, bio);
    // console.log(`dateOfBirth belike: `, dateOfBirth);
    // console.log(`avatarLink belike: `, avatarLink);

    const user = loginState?.user;

    const oldBirth = new Date(user.dateOfBirth).setHours(0, 0, 0, 0);
    const newBirth = new Date(dateOfBirth).setHours(0, 0, 0, 0);

    const isNotChanged = fullname === user.fullname && status === user.status && bio === user.bio && avatarLink === user.avatarLink && oldBirth === newBirth;

    // console.log(isNotChanged);

    // if nothing change then just ignore
    if (isNotChanged) {
      setIsUpdate(false);
      return;
    }

    // if fullname is empty then ignore
    if (errorMessage !== '') return;

    setIsLoadingUpdate(true);

    try {
      const res = await axios({
        mode: 'cors',
        method: 'put',
        url: import.meta.env.VITE_API_ORIGIN + '/user',
        data: {
          fullname,
          status,
          bio,
          dateOfBirth,
          avatarLink,
        },
        headers: {
          Authorization: `Bearer ${loginState?.token}`,
        },
      });

      // console.log(res.data.newUser);
      const user = res.data.newUser;

      console.log(res.data);

      setLoginState({ ...loginState, user });
      set({ ...loginState, user });
      setIsUpdate(false);
    } catch (error) {
      console.log(error);

      if (error.response.status !== 400) setIsErrorUpdate(true);
      else setIsErrorUpdate(true);
    } finally {
      setIsLoadingUpdate(false);
    }
  }

  // only logged in user be able to go to this route
  if (!loginState?.token || !loginState?.user) return <Navigate to={'/'} />;

  let jsx;

  if (isUpdate) {
    // update container
    jsx = (
      <form ref={formRef} className="mt-8 mb-4" onSubmit={handleUpdateSubmit}>
        <header className="">
          <h2 className="text-2xl font-bold">Update</h2>
        </header>

        <div className="flex items-center justify-center self-center rounded-full my-8">
          {/* make the alt text center just in case the link is not an image */}
          <img className="rounded-full text-xs w-48 h-48 bg-warn grid place-items-center" src={avatarLink} alt={domParser(loginState?.user?.fullname) + ' avatar'} />
        </div>

        {/* update fullname */}
        <div className="grid gap-4 grid-cols-custom">
          <label htmlFor="fullname" className="font-bold">
            Fullname{' '}
          </label>
          {/* unescaped default value inputs */}
          <input id="fullname" name="fullname" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required minLength={1} />

          {/* update current status */}
          <label htmlFor="status" className="font-bold">
            Status
          </label>
          {/* custom tailwind base on user?.status */}
          <select id="status" name="status" className="" defaultValue={loginState?.user?.status}>
            Status:
            <option className="text-online" value="online">
              Online
            </option>
            <option className="text-gray-500" value="offline">
              Offline
            </option>
            <option className="text-busy" value="busy">
              Busy
            </option>
            <option className="text-afk" value="afk">
              Afk
            </option>
          </select>

          {/* update bio */}
          <label htmlFor="bio" className="font-bold">
            Bio{' '}
          </label>
          {/* unescaped default value input */}
          <textarea id="bio" name="bio" rows={8} className="block box-border w-full" defaultValue={domParser(loginState?.user?.bio)}></textarea>

          {/* update date of birth */}
          <label htmlFor="dateOfBirth" className="font-bold">
            Date of birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            // defaultValue={user?.dateOfBirth}
            defaultValue={loginState?.user?.dateOfBirthIso}
          />

          {/* update avatar link */}
          <label htmlFor="avatarLink" className="font-bold">
            Avatar link
          </label>
          <input id="avatarLink" name="avatarLink" className="block w-full" onChange={(e) => setAvatarLink(e.target.value)} type="text" value={avatarLink} />
        </div>

        <p className="text-2xl font-bold text-danger">{errorMessage}</p>

        {/* update button */}
        <div className="flex gap-4 items-center justify-between my-4">
          <button className="px-4 py-2 bg-danger text-white rounded-md" onClick={() => setIsUpdate(false)}>
            Cancel
          </button>

          <button disabled={isLoadingUpdate || isErrorUpdate} type="submit" className="ripper px-4 py-2">
            {isErrorUpdate ? <Error /> : isLoadingUpdate ? <Loading /> : 'Confirm'}
          </button>
        </div>
      </form>
    );
  } else {
    // preview container
    jsx = (
      <article className="mt-4 mb-8">
        <header className="">
          <h2 className="text-2xl font-bold">Preview</h2>
        </header>

        <div className="flex items-center justify-center self-center rounded-full my-8">
          {/* make the alt text center just in case the link is not an image, also make it unescaped */}
          <img className="rounded-full text-xs w-48 h-48 bg-warn grid place-items-center" src={loginState?.user?.avatarLink} alt={domParser(loginState?.user?.fullname) + ' avatar'} />
        </div>

        <div className="grid gap-4 grid-cols-custom">
          <h3 className="font-bold">Fullname </h3>
          {/* unescaped user fullname */}
          <h3 className="">{domParser(loginState?.user?.fullname)}</h3>

          <h3 className="font-bold">Status</h3>
          {/* custom tailwind base on user?.status */}
          <p
            className={
              'capitalize' +
              ' ' +
              (loginState?.user?.status === 'online' ? 'text-success' : loginState?.user?.status === 'busy' ? 'text-busy' : loginState?.user?.status === 'afk' ? 'text-afk' : 'text-gray-500')
            }
          >
            {loginState?.user?.status}
          </p>

          <h3 className="font-bold">Bio </h3>
          <p className="">{domParser(loginState?.user?.bio)}</p>

          <h3 className="font-bold">Date of birth</h3>
          <p className="">{loginState?.user?.dateOfBirthFormatted?.split(' - ')[0]}</p>
        </div>

        {/* update button */}
        <div className="flex gap-4 items-center justify-end my-4">
          <button onClick={() => setIsUpdate(true)} type="button" className="ripper px-4 py-2">
            Update
          </button>
        </div>
      </article>
    );
  }

  return <section className="mx-auto max-w-[60ch] px-4 py-16 my-10 sm:px-6 lg:px-8 shadow-lg shadow-gray-400 rounded-xl bg-[#ffffffcc] text-slate-900 w-full">{jsx}</section>;
}
