import noTouch from '../img/no-touch.svg';
import touch from '../img/touch.svg';
import notInterested from '../img/not-interested.svg';

const cursors = {
  DEFAULT: 'default',
  GRAB: `url(${noTouch}) 15 15, grab`,
  GRABBING: `url(${touch}) 15 15, grabbing`,
  NOT_ALLOWED: `url(${notInterested}) 15 15, not-allowed`
};

export default cursors;
