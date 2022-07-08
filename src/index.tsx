import React from 'react';
import {Appearance} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {OwnDarkTheme, OwnDefaultTheme} from 'res';
import {NavigationContainer} from '@react-navigation/native';
import {BottomNavigator} from './screens';
//redux
import {connect} from 'react-redux';
import {changeNavigatorsState} from './redux/actions';
//interfaces and types
import {RootStateType} from 'src/redux/reducers';
import {ThemeI} from 'res';

//typescript for redux
const mapStateToProps = (state: RootStateType) => {
  return {};
};
const mapDispatchToProps = {
  changeNavigatorsState,
};
type PropsFromRedux = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

//props and state
interface PropsI extends PropsFromRedux {}

interface StateI {
  scheme: 'light' | 'dark' | 'no-preference';
}

//constants
const DARK = 'dark';
const LIGHT = 'light';

class Main extends React.Component<PropsI, StateI> {
  appearanceListener: any;

  state: StateI = {
    scheme: LIGHT,
  };

  componentDidMount() {
    this.appearanceListener = Appearance.addChangeListener(({colorScheme}) => {
      this.setState({scheme: colorScheme});
    });
  }

  componentWillUnmount() {
    this.appearanceListener.remove();
  }

  render() {
    const themeObject: ThemeI =
      this.state.scheme === DARK ? OwnDarkTheme : OwnDefaultTheme;
    return (
      <ThemeProvider theme={themeObject}>
        <NavigationContainer
          onStateChange={this.props.changeNavigatorsState}
          theme={themeObject}>
          {BottomNavigator()}
        </NavigationContainer>
      </ThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
