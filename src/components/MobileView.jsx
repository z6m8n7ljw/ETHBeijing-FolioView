import React, { PureComponent } from "react";

function setUserAgent(window, userAgent) {
  if (window.navigator.userAgent != userAgent) {
    var userAgentProp = {
      get: function () {
        return userAgent;
      },
    };
    try {
      Object.defineProperty(window.navigator, "userAgent", userAgentProp);
    } catch (e) {
      window.navigator = Object.create(navigator, {
        userAgent: userAgentProp,
      });
    }
  }
}

export default class MobileView extends PureComponent {
  iframeRef = null;

  componentDidMount() {
    if (this.iframeRef) {
    }
  }

  render() {
    const { width, height, src } = this.props;
    return (
      <iframe
        ref={(ref) => (this.iframeRef = ref)}
        src={src}
        width={width}
        height={height}
      ></iframe>
    );
  }
}
