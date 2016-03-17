MessagesList = React.createClass({
    getInitialState(){
        return {
            messages: AppConfig.get('messages')
        }
    },

    render(){
        let messages = (_.sortBy(this.state.messages, 'time')||[]).reverse();

        return(
            <div className="ui segments">
                {_.map(messages, (m, k)=>{
                    return <MessageListItem message={m} key={k} />
                })}
            </div>
        )
    }
});

var MessageListItem = React.createClass({
    render(){
        let m = this.props.message;
        let elipsis = (m.conteudo.length > 100) ? '...' : '';
        let content =  (m.conteudo || '').substr(0, 100) + elipsis;


        let data = {
            userCompleteName: m.nome,
            userName: m.userName,
            avatar: m.avatar,
            time: m.time,
            timeText: 'escreveu',
            content
        }

        return(
            <div className="ui segment">
                <UserPicTime data={data} className="message-list-item"/>
            </div>
        )
    }
});
