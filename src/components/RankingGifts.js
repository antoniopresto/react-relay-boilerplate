import React, {Component} from 'react';
import {FlexCol, FlexRow} from '../theme/Grid';

export default class RankingGifts extends Component {
  constructor(p, c) {
    super(p, c);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.getItems();
  }

  getItems() {
    const items = [];
    this.setState({items});
  }

  renderItem(data, key) {
    return (
      <li className="ranging-gifts-li" key={key}>
        <span className="pos">{`${data.pos}º`}</span>
                <span className="nome">
                    <a href={`/social/${data.userName}`}>{data.nome}</a>
                </span>
                <span className="qtd">
                    <span className="num">{data.qtd}</span>
                    <i className="gift icon"></i>
                </span>
      </li>
    );
  }

  render() {
    if (this.state.isLoading) {
      return 'Carregando...';
    }
    return (
      <FlexRow class="ranking-gifts-row">
        <FlexCol size={{sm: 12, md: 8}} class="ranking-gifts-col">
          <h2 className="sec-title">Ranking Gifts</h2>

          <ul className="ranking-gifts-ul">
            {(this.state.items || []).map((i, k)=> {
              return this.renderItem(i, k);
            })}
          </ul>
        </FlexCol>
      </FlexRow>
    );
  }
}
