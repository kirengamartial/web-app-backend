import moment from 'moment';

function formatMessage(name, text) {
  return {
    username: name,
    text,
    time: moment().format('h:mm a'),
  };
}

export default formatMessage;