import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom'
import Board from './Board'
import BoardList from "./BoardList";
import './App.css';
import 'grommet/scss/vanilla/index.scss';
import Title from 'grommet/components/Title';
import GrommetApp from 'grommet/components/App'
import Header from 'grommet/components/Header'
import Article from 'grommet/components/Article'
import Box from 'grommet/components/Box'
import {withRouter} from 'react-router-dom'
import BoardPage from "./BoardPage";

class App extends Component {
  render() {
    return (
      <GrommetApp>
        <Article>
          <Header>
            <Box pad={{horizontal: 'medium'}}>
              <Title>Tic-tac-toe</Title>
            </Box>
          </Header>
        </Article>
        <Article>
          <Box pad={{horizontal: 'medium'}}>
            <Switch>
              <Route exact path="/" component={BoardList}/>
              <Route exact path="/boards/:id" component={BoardPage}/>
            </Switch>
          </Box>
        </Article>
      </GrommetApp>
    );
  }
}

export default withRouter(App);
