import React from "react";

class Rank extends React.Component {
  constructor() {
    super()
    this.state = {
      emoji: ''
    }
  }

  //This is to get the entries as soon the Component is mounted
  componentDidMount() {
    this.generateEmoji(this.props.entries)
  }

  //This is to update the emoji component if there is any update on the entries value
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.entries === this.props.entries) {
      return null
    } else {
      this.generateEmoji(this.props.entries)
    }
  }
  
  //This is to get the rank function from Amazon Lambda
  generateEmoji = (entries) => {
    fetch(`https://0jzhxke112.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
    .then(response => response.json())
    .then(data => this.setState({ emoji: data.input  }))
    .catch(console.log)
  }

  render() {
    return (
      <div>
        <div className="white f3">
          {`${this.props.name} , your current entry count is...`}
        </div>
        <div className="white f1">{this.props.entries}</div>
        <div className="white f3">{`Rank Badge: ${this.state.emoji}`}</div>
      </div>
    );
  }
}

export default Rank;
