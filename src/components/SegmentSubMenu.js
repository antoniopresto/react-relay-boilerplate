var {
    Component
} = React;


class SegmentSubMenu extends Component{
    constructor(p, c) {
        super(p, c);
        this.state = {
            activeRoute: Router.actual()
        };
    }

    componentDidMount(){
        Router.actual((activeRoute) => {
            this.setState({activeRoute});
        });
    }

    handleClick(event, linkObj) {
        linkObj.onClick && linkObj.onClick(event);
    }

    renderItem(e, k){
        let isActive = Router.isRoute(this.state.activeRoute, e.path);
        let activeClass = (isActive) ? ' active brand-link--active ' : ' brand-link--inactive ';

        return(
            <div className="children" key={k}>
                <a  className={(e.class || '') + activeClass}
                    href={e.path}
                    onClick={(event)=>{
                        this.handleClick.call(this, event, e);
                    }}>
                    {e.icon && <i className={`ion-${e.icon}`}></i>}
                    <span className="title">{e.title}</span>
                </a>
            </div>
        );
    }

    render(){
        if(!this.props.routes.length) return <nav className="vazio" />;
        return(
            <div className="segment-content-wr">
                <div className="SegmentSubMenu">
                    <div className="sombra"></div>
                    <div className="list-wrapper">
                        <div className="inner">
                            <div className="scroller animated fadeInLeft">
                                {this.props.routes.map((e, k)=> this.renderItem(e, k))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

window.SegmentSubMenu = SegmentSubMenu;
