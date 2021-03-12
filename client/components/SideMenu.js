import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Canvas from 'react-native-canvas';
import SideMenuCore from '../components/SideMenuCore.js';
import SideMenuLink from '../components/SideMenuLink.js';
import { UsersContext } from '../contexts/Users.js';

class SideMenu extends Component {
  static contextType = UsersContext;

  state = {
    links: [
      {
        name: 'Home',
        active: false,
        iconName: 'home',
      },
      {
        name: 'History',
        active: false,
        iconName: 'history',
      },
      {
        name: 'Feedback',
        active: false,
        iconName: 'comments',
      },
      {
        name: 'About',
        active: false,
        iconName: 'info-circle',
      },
    ],
  };

  setActiveRouteLink = (navigation) => {
    const { index, routes } = navigation.dangerouslyGetState();
    const activeRouteName = routes[index].name;

    const newLinks = this.state.links.map((link) => {
      if (link.name === activeRouteName) {
        link.active = true;
      }

      return link;
    });

    this.setState({
      links: newLinks,
    });
  };

  drawAvatar = (canvas) => {
    if (canvas) {
      const ctx = canvas.getContext('2d');

      const canvasWidth = 70;
      const canvasHeight = 70;

      ctx.canvas.width = canvasWidth;
      ctx.canvas.height = canvasHeight;

      ctx.fillStyle = '#AF9EB8';
      ctx.fillRect(0, 0, 70, 70);

      ctx.font = '40px arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const username = this.context.user.name;
      ctx.fillText(username[0], canvasWidth / 2, canvasHeight / 2);
    }
  };

  handleLogOutButtonPress = async () => {
    await this.context.logOut();
  };

  componentDidMount() {
    this.props.setSideMenuToggleFn(this.sideMenu.toggle);
    this.setActiveRouteLink(this.props.navigation);
  }

  render() {
    const {
      width,
      navigation: { navigate },
    } = this.props;

    return (
      <SideMenuCore ref={(ref) => (this.sideMenu = ref)} width={width}>
        <View style={styles.avatarOuter}>
          <Canvas ref={this.drawAvatar} style={styles.avatar} />
          <Text style={styles.username} numberOfLines={1}>
            {this.context.user.name}
          </Text>
        </View>

        <View style={styles.menu}>
          <View>
            {this.state.links.map((link, i) => {
              return (
                <SideMenuLink
                  key={i}
                  link={link}
                  navigate={navigate}
                  sideMenuToggle={() => this.sideMenu.toggle()}
                />
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.handleLogOutButtonPress}
          >
            <View style={styles.logOutButton}>
              {this.state.loading ? (
                <ActivityIndicator
                  animating={this.state.loading}
                  size="large"
                  color="#fff7"
                />
              ) : (
                <Text style={styles.logOutButtonText}>Log Out</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </SideMenuCore>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 70 / 2,
  },
  avatarOuter: {
    height: 140,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#3B1C32dd',
    padding: 15,
  },
  username: {
    color: '#fff',
    fontSize: 23,
    marginTop: 7,
    textAlign: 'center',
  },
  menu: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
  },
  logOutButton: {
    backgroundColor: '#3B1C32dd',
    width: '100%',
    padding: 7,
    borderRadius: 3,
  },
  logOutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 21,
  },
});

export default SideMenu;
