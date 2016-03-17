'use strict';

var {
    Component
} = React;

class GiftsComponent extends Component{
    constructor(p, c){
        super(p, c);
        this.state = {
            data: this.props.data
        }
    }

    render(){
        const {gifts = []} = this.state.data;
        return(
            <a><i className="gift icon"></i>{gifts.length} Gifts</a>
        )
    }

}

window.GiftsComponent = GiftsComponent;
