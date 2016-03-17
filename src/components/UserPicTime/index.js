import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {FlexRow, FlexCol} from '../../theme/Grid';
import moment from 'moment';
import styles from './UserPicTime.scss';

/*eslint-disable*/
export default class UserPicTime extends Component {
  constructor(p, c) {
    super(p, c);

    this.state = {
      momentFromNow: true // moment(time).fromNow()
    };
  }

  componentDidMount() {

    const a = ReactDOM.findDOMNode(this.refs.userLink);

    $(a).popup({
      popup: ReactDOM.findDOMNode(this.refs.popup),
      inline: true,
      hoverable: true,
      position: 'bottom left',
      delay: {
        show: 300,
        hide: 800
      }
    });
  }

  handleEnter() {
    this.setState({over: true});
  }

  handleLeave() {
    this.setState({over: false});
  }


  renderPopup() {
    const data = this.props.data || {};

    const {
      userCompleteName,
      memberSince,
      profileType,
      username,
      avatar
      } = data;

    const desde = moment(memberSince);
    const desdeFormatado = `${desde.format('LL')}`;

    const content = (
      <FlexRow class="user-profile-popup-row">
        <FlexCol>
          <img className="avatar" src={avatar}/>
          <a className="nome"
             href={`/social/${username}`}>
            {userCompleteName}
          </a>

          <ul className="dados-ul">
            <li>{`Membro desde ${desdeFormatado}`}</li>
            <li>{`Perfil ${profileType}`}</li>
          </ul>
        </FlexCol>
      </FlexRow>
    );

    return (
      <div ref="popup"
           className="ui flowing popup bottom left transition hidden">
        {content}
      </div>
    );
  }

  changeMomentFormat(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.setState({momentFromNow: !this.state.momentFromNow});
    return false;
  }

  render() {
    const {
      created_at,
      message,
      username,
      className = '',
      avatar,
      userCompleteName,
      messageHtml
      } = this.props.data;

    const time = moment(created_at);

    return (
      <FlexRow class={`user-pic-time-component ${className} `}>
        <FlexCol size={{xs:2, md:2, lg:1}} className={styles["avatar-col"]}>
          <img src={avatar}/>
        </FlexCol>

        <FlexCol size={{xs: 10, md: 10}} className="event-col">
          {this.renderPopup()}

          <a ref="userLink"
             className="user-link-data"
             href={`/social/${username}`}>
            {userCompleteName}
          </a>

          <br />

          <a href="#"
             onClick={this.changeMomentFormat.bind(this)}
             className={styles.titleTime}
             title={time.format('LLL')}>
            <time dateTime={created_at}>
              {(this.state.momentFromNow) ? `Publicou há ${time.fromNow(true)}` : `Publicou em ${time.format('LLL')}`}
            </time>
          </a>

          {message && <div className="content-row" dangerouslySetInnerHTML={{__html: messageHtml}} />}
        </FlexCol>
      </FlexRow>
    );
  }
}
