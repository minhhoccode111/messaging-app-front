import PropTypes from 'prop-types';
import { domParser } from './../../methods/index';
import { FakeLink, CircleAvatar } from '../more';

export default function ContactGroup({ group, chatId, setChatId, chatType, setChatType }) {
  // if (user.status === 'online') console.log(user);

  function setFocus() {
    return chatType === 'groups' && chatId === group.id ? 'bg-gray-300' : 'bg-gray-100';
  }

  return (
    <li
      onClick={() => {
        setChatType('groups');
        setChatId(group.id);
      }}
      className={'my-2 rounded-md flex gap-2 items-center justify-start text-xs font-bold shadow-md p-2 bg-gray-100 hover:bg-gray-300 transition-colors cursor-pointer' + ' ' + setFocus()}
    >
      <CircleAvatar src={group?.avatarLink} alt={domParser(group?.name?.slice(0, 1)?.toUpperCase())} size={10} />

      <p className="text-sm">
        <FakeLink>{domParser(group.name)}</FakeLink>
      </p>
    </li>
  );
}

ContactGroup.propTypes = {
  group: PropTypes.object,
  chatId: PropTypes.string,
  chatType: PropTypes.string,
  setChatId: PropTypes.func,
  setChatType: PropTypes.func,
};