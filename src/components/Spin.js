'use strict';

var {Component} = React;

class Spin extends Component{
    constructor(p, c){
        super(p, c);
    }

    render(){
        return(
            <p className="spin">Carregando...</p>
        );
    }
}
window.Spin = Spin;
