import React, { Component } from "react";
import Particles from "react-particles-js"; //This is related with the animated background
import Navigation from "./components/Navigation/Navigation";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceNames from "./components/FaceNames/FaceNames";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import "./App.css";

const initalState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

//Bellow are the STATE that will change with the code
class App extends Component {
  constructor() {
    super();
    this.state = initalState;
  }

  //Here we will check if there is a token in the session storage of the user
  //if there is we will get the token to get the ID from our redis db
  //Then we will get the user id and load our user and change the route to home
  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("http://178.128.38.252:3000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://178.128.38.252:3000/profile/${data.id}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: token
              }
            })
              .then(resp => resp.json())
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange("home");
                }
              });
          }
        })
        .catch(console.log);
    }
  }

  //This is a function, from where we retrieve in Register & Signin the user details
  //...as a response back from our API (NodeJS)
  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  //calculateFaceLocation() is to get the data about face location
  //And we do the calculations to get the location for the face <div>
  calculateFaceLocations = data => {
    if(data && data.outputs) {

      return data.outputs[0].data.regions.map(face => {
        const clarifaiFace = face.region_info.bounding_box;
        const image = document.getElementById("inputimage");
        const width = Number(image.width);
        const height = Number(image.height);
        const person = face.data.concepts[0].name;
        const probability = face.data.concepts[0].value;
  
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
          person: person,
          probability: `${Math.floor(probability * 100)} %`
        };
      });

    }
    return
  };

  //This is to store the cordinates of the FaceBox
  displayFaceBoxes = boxes => {
    if (boxes) {
      this.setState({ boxes: boxes });
    }
  };

  //This is to get the link
  onInputChange = event => {
    this.setState({ input: event.target.value });
  }; 

  /* WE NOW HIDE THE API ON THE BACK-END, WE SEND THE INFO TO BACK END */
  /* AND WE RETRIEVE THAT INFORMATION BACK */
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("http://178.128.38.252:3000/imageurl", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        //The Token we need to add to any protected route we're trying to access
        Authorization: window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      //calculateFaceLocation() is to get the data about face location
      //displayFaceBox() is to pass the returned values to state.box
      //The values from state.box are useful to create the div in "FaceRecgnition.js"
      //On the 'fetch' bellow we are calculating the number of entries
      .then(response => {
        if (response) {
          fetch("http://178.128.38.252:3000/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: window.sessionStorage.getItem("token")
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBoxes(this.calculateFaceLocations(response));
      })
      .catch(err => console.log(err));
  };

  //This is to handle the Routes if is SignedIn, or Out. However is on the server side that we will handle authentication.
  onRouteChange = route => {
    if (route === "signout") {
      return this.setState(initalState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }));
  };

  render() {
    //Line bellow is to avoid that we write all the time "this.state.isSignedIn" for example
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen } = this.state;
    return (
      <div className="App">
        <Particles
          className="particles"
          params={{
            particles: {
              number: {
                value: 60,
                density: {
                  enable: true,
                  value_area: 800
                }
              }
            }
          }}
        />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
        />

        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              user={this.state.user}
            />{" "}
          </Modal>
        )}

        {/* The default route is signin, in state above, however if we click on signin 
        it will route us to 'home' and render the other Components after -> : <- */}
        {route === "home" ? (
          <div>
            <Logo />
            {/* We need to send the details bellow to RANK, so that can display 
            the name and the number of entries */}
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />

            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />

            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            <FaceNames boxes={boxes} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
