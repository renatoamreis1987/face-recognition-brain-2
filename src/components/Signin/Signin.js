import React from "react";
import "./Signin.css";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: ""
    };
  }

  //Bellow are the code to get the values and store in the PROPS above
  onEmailChange = event => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ signInPassword: event.target.value });
  };

  //We receive the token from the backend
  //window.sessionStorage we can find it in our browser under Application tab (console)
  saveAuthTokenInSession = token => {
    window.sessionStorage.setItem("token", token); //id token, value token
  };

  //Here is when we don't have a session (We don't have the token)
  //We are sending a POST request to the server with email, pw & name
  //We receive back a response with the user. This is defined in the API (NodeJS)
  //With the response back, we save the token in the Session of the user browser
  //And we also load the user and routing to home
  onSubmitSignIn = () => {
    fetch("http://178.128.38.252:3000/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.userId && data.success === "true") {
          this.saveAuthTokenInSession(data.token)
          fetch(`http://178.128.38.252:3000/profile/${data.userId}`, {
            method: "get",
            headers: {
              'Content-Type': "application/json",
              'Authorization': data.token
            }
          })
            .then(resp => resp.json())
            .then(user => {
              if (user && user.email) {
                this.props.loadUser(user);
                this.props.onRouteChange("home");
              }
            })

            .catch(console.log);
        }
      });
  };

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;
