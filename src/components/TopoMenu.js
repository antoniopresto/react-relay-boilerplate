TopoMenu = React.createClass({
  getInitialState() {
    return {
      title: 'Alterar',
      open: false,
      activeRoute: {},
      logo: AppConfig.get('logo'),
      links: AppConfig.get('sectionLinks'),
      site: AppConfig.get('site')
    }
  },

  componentDidMount() {
    Router.actual((activeRoute) => {
      this.setState({activeRoute, open: false});
    });
  },

  handleLeftButton() {},

  handleRightButton() {
    this.setState({
      open: !this.state.open
    });
  },

  render() {
    if (this.state.activeRoute.ignoreLogin)
      return <div/>;

    return (
      <div className={`topo-menu-wr ${this.state.site} brand-bg-gradient`}>
        <FlexRow class='topo-menu'>
          <FlexCol key={'logo'} size={{
          xs: 2
          }}>
            <a className="a-logo" style={{
            backgroundImage: `url(${this.state.logo})`
            }} onClick={this.handleLeftButton}></a>
          </FlexCol>

          <FlexCol key={'title'} size={{
          xs: 8
          }}>
            <span className='title'>
              {this.state.activeRoute.title}
            </span>
          </FlexCol>

          <FlexCol key={'burger'} class="burger" size={{
          xs: 2
          }} align="right">
            {this.renderBurger.call(this)}
          </FlexCol>

          <FlexCol>
            {this.renderLinks.call(this)}
          </FlexCol>
        </FlexRow>
      </div>
    );
  },

  renderLinks() {
    return (this.state.open && <TopoMenuIcons links={this.state.links}/>);
  },

  renderBurger() {
    let style = {
      backgroundColor: AppConfig.get('menuColor') || 'white'
    };

    return (
      <a onClick={this.handleRightButton}>
        <div id="hamburger-icon" className={(this.state.open && 'open') + " hamburger-menu-icon"}>
          <span style={style}></span>
          <span style={style}></span>
          <span style={style}></span>
          <span style={style}></span>
        </div>
      </a>
    );
  }
});

var TopoMenuIcons = React.createClass({
  getInitialState() {
    const user = Accounts.user()
    return {logged: user.token, names: this.props.links, site: AppConfig.get('site')}
  },

  componentDidMount() {
    Accounts.onChange(() => {
      const user = Accounts.user() || {}
      let logged = user.token
      this.setState({logged});
    });
  },

  render() {
    let names = this.state.names;
    return (
      <FlexCol>
        <FlexRow>
          <FlexCol>
            <FlexRow class="topo-menu-icones-row">
              {_.map(this.state.names, (n, k) => {
                return <TopoLink name={n} key={k} size={1} site={this.state.site}/>
              })}
            </FlexRow>
          </FlexCol>

          <FlexCol>
            <div className="login-wr">
              {this.renderLoginButtons()}
            </div>
          </FlexCol>
        </FlexRow>
      </FlexCol>
    );
  },

  renderLoginButtons() {
    let style = {
      color: AppConfig.get('menuColor') || 'white'
    };

    if (this.state.logged) {return (
        <a style={style} href='/logout'>
          <i className="ion-log-out"></i>
          Sair
        </a>
      );} else {return (
        <a style={style} href='/login'>
          <i className="ion-log-in"></i>
          Entrar
        </a>
      );}
  }
});

let TopoLink = React.createClass({
  handleClick() {},

  render() {
    let style = {
      color: AppConfig.get('menuColor') || 'white'
    };
    let name = this.props.name;
    let className = '';
    let size = this.props.size;
    let iconClass = `${name}_${this.props.site}`
    return (
      <FlexCol size={{
      xs: 3
      }} class="menu-item">
        <a style={style} title={name.toUpperCase()} onClick={this.handleClick} className={`${className} ${name} menu-item`}>
          <i className={`ficon ficon-${iconClass}`}></i>
          {name}
        </a>
      </FlexCol>
    );
  }
});
