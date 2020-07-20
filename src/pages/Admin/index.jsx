import React, { Component } from "react";

import Analysis from "./Analysis";

import Scales from "./Scales";

// import Monitor from "./Monitor";
import Search from "./Search";
import Static from "./Static";

export default class Admin extends Component {
  render() {
    return (
      <div>
        <Analysis />
        <Scales />
        {/* <Monitor /> */}
        <Search />
        <Static />
      </div>
    );
  }
}
