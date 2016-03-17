'use strict';

var {
    Component
} = React;

class SegmentMenu extends Component {
    constructor(p, c) {
        super(p, c);
        this.state = {
            marginTop: 0,
            actualParent: Router.actualParent()
        };
    }

    componentDidMount() {
        Router.actualParent((actual, actualParent, req) => {
            this.setState({
                actualParent,
                actual
            });
        });

        //this.handleScroll();
    }

    handleClick(event, linkObj) {
        linkObj.onClick && linkObj.onClick(event);
    }

    renderLinks() {
        let actualParent = this.state.actualParent;

        // cada seção do site (mural, grupos, arquivos...) tem seu
        // proprio menu (segment)
        // filtramos abaixo o menu para a seção atual
        let actualMenuLinks = _.filter(this.props.routes || [], (e, k) => {
            return e.section == actualParent.section;
        });

        let size = parseInt(12 / actualMenuLinks.length) || 1;

        return actualMenuLinks.map((e, k) => {
            let isActive = Router.isRoute(actualParent, e.path);
            let activeClass = (isActive)
                ? 'active brand-link--active '
                : ' brand-link--inactive ';

            return (
                <FlexCol align="center" class="segmento" key={k} size={size}>
                    <a className={'father brand-link' + activeClass + ' ' + e.class} href={e.path} onClick={(event) => {
                        this.handleClick.call(this, event, e);
                    }}>
                        {e.icon && <i className={`ion-${e.icon}`}>
                            {this.renderAlertasBadge(e)}
                        </i>}
                        <span className="title">{e.title}</span>
                    </a>
                    <div className={'seta ' + activeClass}></div>
                    {isActive && <SegmentSubMenu routes={e.submenu || []}/>}
                </FlexCol>
            );
        });
    }

    renderAlertasBadge(rota){
        let alertas = AppNotifications.get(rota.name);
        let qtd = (alertas && alertas.length) || 0;
        if(!qtd) return <span></span>;
        let ems = `${0.3 + (qtd.toString().length * 0.5)}em`;
        let style = {
            lineHeight: ems,
            width: ems,
            height: ems
        };
        return <span className="alerta-badge" style={style}>{qtd}</span>
    }

    render() {
        if(!this.state.actualParent.section){
            return <div className="no-segment-route"></div>
        }

        return (
            <div ref='segment'>
                <Container class="segment-container">
                    <FlexRow align="center" class='SegmentMenu'>
                        {this.state.text}
                        {this.renderLinks.call(this)}
                    </FlexRow>
                </Container>
            </div>
        );
    }

    handleScroll() {
        let lst = 0;
        let st = 0;

        let handler = () => {
            let segment = ReactDOM.findDOMNode(this.refs.segment);
            if(!segment) return;
            st = document.body.scrollTop || document.documentElement.scrollTop;
            if(st > lst){
                segment.style.display = 'none';
            }else{
                segment.style.display = 'inherit';
                segment.className = 'animated fadeIn';
            }
            lst = st;
        };

        window.removeEventListener('scroll', handler);
        window.addEventListener('scroll', handler);
        _log('scroll mounted...');
    }
}
window.SegmentMenu = SegmentMenu;
