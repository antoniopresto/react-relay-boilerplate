'use strict';

var {
    Component
} = React;

/**
 * MainApp Component
 */
class MainApp extends Component {
    constructor(p, c) {
        super(p, c);
        moment.locale('pt-br');
        this.state = {
            currentComponent: null
        };
    }

    componentDidMount() {
      this.initRouter();
    }

    render() {
        return (
            <div className="main-component-wr">
                <TopoMenu/>

                <Container class="content-container">
                    <Grid>
                        <Col>
                            <div id="content-container">
                                {this.component()}
                            </div>
                        </Col>
                    </Grid>
                </Container>

                <SegmentMenu routes={this.props.routes}/>
            </div>
        );
    }

    //config components by routes, init router
    initRouter() {
        Router.config(AppConfig.get('routes'));
        
        Router.onBeforeAction((r, p) => {
          const token = Accounts.getToken()
          if(!r.ignoreLogin && !token) Accounts.logout()
        })

        /** Login **/
        Router.on('login', (rota, req) => {
            this.component(<LoginComponent />);
        });
        Router.on('/logout', () => {
            Accounts.logout('/login');
        });

        /** Inicio **/
        Router.on('home', (rota, req) => {
            Router.redirect(rota.submenu[0].path);
        });
        Router.on('profile', (rota, req) => {
            this.component(<NewsFeed  jsonUrl='/feed' userName={req.params.username}/>);
        });
        Router.on('/novidades', (rota, req) => {
            this.component(<NewsFeed  jsonUrl='/feed'/>);
        });

        Router.on('messages', (rota, req) => {
            Router.redirect(rota.submenu[0].path);
        });
        Router.on('/social/conversations', (rota, req) => {
            this.component(<MessagesList />);
        });

        Router.on('settings', (rota, req) => {
            page.redirect(rota.submenu[0].path);
        });
        Router.on('/social/privacy', (rota, req) => {
            this.component(<h1>Privacy</h1>);
        });
        Router.notFound((rota, req) => {
            this.component(<h1>404 {rota.path}</h1>);
        });
        Router.init();
    }

    //set e get currentComponent
    component(component) {
        if (!component)
            return this.state.currentComponent;
        this.state && this.setState({
            currentComponent: component
        });
    }
}
window.MainApp = MainApp;
