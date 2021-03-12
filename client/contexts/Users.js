import React, { Component } from 'react';

const UsersContext = React.createContext();
const { API_URL } = process.env;

class UsersContextProvider extends Component {
  logIn = async (name, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ name, password }),
      });
      const { status: statusCode } = res;

      if (statusCode === 200) {
        const user = await res.json();
        this.setState({
          user,
          isLoggedIn: true,
        });

        return { err: null };
      } else {
        const err = new Error();
        err.statusCode = statusCode;
        throw err;
      }
    } catch (err) {
      return { err: { statusCode: err.statusCode } };
    }
  };

  logOut = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        credentials: 'include',
        method: 'POST',
      });
      const { status: statusCode } = res;

      if (statusCode === 200) {
        this.setState({
          user: {},
          isLoggedIn: false,
        });

        return { err: null };
      } else {
        const err = new Error();
        err.statusCode = statusCode;
        throw err;
      }
    } catch (err) {
      return { err: { statusCode: err.statusCode } };
    }
  };

  signUp = async (name, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ name, password }),
      });
      const { status: statusCode } = res;

      if (statusCode === 201) {
        const { err } = await this.logIn(name, password);
        if (err) {
          const newErr = new Error();
          newErr.statusCode = err.statusCode;
          throw newErr;
        }

        return { err: null };
      } else {
        const err = new Error();
        err.statusCode = statusCode;
        throw err;
      }
    } catch (err) {
      return { err: { statusCode: err.statusCode } };
    }
  };

  async componentDidMount() {
    try {
      const res = await fetch(`${API_URL}/auth/current`, {
        credentials: 'include',
      });
      const { status: statusCode } = res;

      if (statusCode === 200) {
        const user = await res.json();
        this.setState({
          user,
          isLoggedIn: true,
        });
      }
    } catch (err) {}
    this.setState({ gettingCurrentUser: false });
  }

  state = {
    user: {},
    isLoggedIn: false,
    gettingCurrentUser: true,
    logIn: this.logIn,
    signUp: this.signUp,
    logOut: this.logOut,
  };

  render() {
    return (
      <UsersContext.Provider value={this.state}>
        {this.props.children}
      </UsersContext.Provider>
    );
  }
}

const UsersContextConsumer = UsersContext.Consumer;

export { UsersContext, UsersContextProvider, UsersContextConsumer };
