import config from '../config';
import {linebreaks, nl2br} from 'humanize';
import {scrape} from '../redux/modules/scraper';


const yRegex = /https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)(&(amp;)?[\w\?=]*)?/;
const uRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b((\?[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/;


export default (dispatch) => (data = {}) => {
  let message = data.message || '';
  const youtubeData = (yRegex.exec(message) || []);
  const youtubeVideoURL = youtubeData[0];
  const youtubeVideoId = youtubeData[1];
  let externalUrl = (uRegex.exec(message) || [])[0];

  if (youtubeVideoId) {
    message = message.replace(youtubeVideoURL, '');
  } else if (externalUrl) {
    message = message.replace(externalUrl, '');
    if (!externalUrl.match('https?://')) externalUrl = 'http://' + externalUrl;
    if (!data.og) setTimeout(() => dispatch(scrape(externalUrl, data.pub_id)), 0);
  }

  const {og = {}} = data;
  const messageHtml = linebreaks(nl2br(message || ''));

  let ogImage = (og.image || {}).url;
  if (ogImage && ogImage.map) ogImage = ogImage[0];

  return {
    ...data,
    username: data.username,
    userName: data.username,
    userCompleteName: (data.username || '').toUpperCase(),
    avatar: config.userDefaultPic,
    memberSince: '',
    profileType: '',
    timeText: data.title,
    created_at: data.created_at,
    message: data.message,
    className: data.className,
    messageHtml,
    youtubeVideoURL,
    youtubeVideoId,
    externalUrl,
    og,
    ogTitle: og.title,
    ogDescription: og.description,
    ogImage,
    ogLoading: og.loading
  };
};
