import React from 'react';

class Gif extends React.Component {
  constructor(props) {
    super(props);

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidMount() {
    this.gif = document.getElementById("gif");
    this.modal = document.getElementById("parent");
    document.addEventListener('mousedown', this.handleOutsideClick);
    document.body.classList.add("backdrop");
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleOutsideClick() {
    if (!this.modal.contains(event.target)) {
      this.props.endDemonstration();
      document.body.classList.remove("backdrop");
      this.gif.src = "";
      this.gif.src = "./Peek 2018-05-09 02-04.gif";
    }
  }

  render() {
    const className = this.props.hidden ? "gif hidden" : "gif";

    return (
      <div id="parent" className="gif-wrapping-div">
        <h3>Close demonstration by clicking off of the gif</h3>
        <img id="gif" className={className} src={"./Peek 2018-05-09 02-04.gif"} />
      </div>
    );
  }
}

export default Gif;
