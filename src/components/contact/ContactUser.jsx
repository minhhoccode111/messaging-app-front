import PropTypes from 'prop-types';
import { domParser } from './../../methods/index';
import { FakeLink, UserStatus, CircleAvatar } from '../more';

export default function ContactUser({ user, chatId, setChatId, chatType, setChatType }) {
  // if (user.status === 'online') console.log(user);

  function setFocus() {
    return chatType === 'users' && chatId === user?.id ? 'bg-gray-300' : 'bg-gray-100';
  }

  return (
    // BUG not accessibility best practice using onClick on <li></li> tag
    <li
      onClick={() => {
        setChatId(user?.id);
        setChatType('users');
      }}
      className={'my-2 rounded-md flex gap-2 items-center justify-start text-xs font-bold shadow-md p-2 hover:bg-gray-300 transition-colors cursor-pointer' + ' ' + setFocus()}
    >
      <CircleAvatar src={user?.avatarLink} alt={domParser(user?.fullname?.slice(0, 1)?.toUpperCase())} size={10} />

      <div className="">
        <p className="text-sm">
          <FakeLink>{domParser(user?.fullname)}</FakeLink>
        </p>

        <p className="">
          <UserStatus status={user?.status} />
        </p>
      </div>
    </li>
  );
}

ContactUser.propTypes = {
  user: PropTypes.object,
  chatId: PropTypes.string,
  chatType: PropTypes.string,
  setChatId: PropTypes.func,
  setChatType: PropTypes.func,
};