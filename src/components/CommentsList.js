'use strict';

var {
    Component
} = React;

class CommentsList extends Component{
    constructor(p, c){
        super(p, c);
        this.state = {
            data: this.props.data,
            show: false
        }
    }

    renderItem(c){
        c.timeText = 'comentou ';

        let {
            avatar,
            userCompleteName,
            userName,
            time,
            text,
            gifts
        } = c;

        return(
            <FlexCol class="comment-item-col">
                <ul className="comment-ul">
                    <li className="comment-ul-item user-pic-time">
                        <UserPicTime data={c}/>
                    </li>
                    <li className="comment-ul-item text">{text}</li>
                    <li className="comment-ul-item gifts">
                        <GiftsComponent data={c} />
                    </li>
                </ul>
            </FlexCol>
        );
    }

    toggleComments(){
        let show = !this.state.show;
        this.setState({show});
    }

    renderComments(comments){
        if(!this.state.show) return <span></span>
        return(
            <FlexRow class="comments-list-row">
                {_.map(comments, (c)=>{
                    return this.renderItem(c);
                })}

                {/*this.renderToggler(comments, true)*/}
            </FlexRow>
        )
    }

    renderToggler(comments, hideText){
        let show = this.state.show;
        return(
            <a className='a-toggle' onClick={this.toggleComments.bind(this)}>
                {!hideText && `${comments.length} Comentários`}
                {!show && <i className="ion-chevron-down"></i>}
                {show && <i className="ion-chevron-up"></i>}
            </a>
        )
    }

    render(){
        let {comments = [], show} = this.state.data;
        let className = (show) ? 'show' : 'hide';
        return(
            <div className={'comments-wr ' + className}>
                {this.renderToggler(comments)}
                {this.renderComments(comments)}
            </div>
        )
    }

}

window.CommentsList = CommentsList;
