'use strict';

var {
    Component
} = React;

class FormComment extends Component {
    constructor(p, c){
        super(p, c);
        this.state = {
            value: this.props.value || ''
        }
    }

    handleComentar(ev){
        ev.preventDefault();
        let id = this.props.data.id;
        alert('teste comentando... ' + id + ' ' + this.state.value);
    }

    handleChange(ev){
        let value = ev.target.value;
        this.setState({value});
    }

    render() {
        let {data} = this.props;
        return(
            <form onSubmit={this.handleComentar.bind(this)}
                className="ui form comments-form">
                <div className="inline fields">
                    <div className="thirteen wide stackable field">
                        <input value={this.state.value}
                            autoComplete="off"
                            onChange={this.handleChange.bind(this)}
                            placeholder="Comente esta publicação."
                            ref="comment-input" name="comment" />
                    </div>

                    {()=>{
                        if(!this.state.value) return <span></span>
                        return(
                            <div className="animated fadeIn three wide stackable field">
                                <a className="ui basic fluid blue button"
                                    onClick={this.handleComentar.bind(this)}>
                                    Comentar
                                </a>
                            </div>
                        )
                        }()
                    }
                </div>
            </form>
        );
    }
}
window.FormComment = FormComment;
