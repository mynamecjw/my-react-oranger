import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserInfo, getUserMenu } from "./redux";
import Loading from '@comps/Loading'

@connect(null, { getUserInfo, getUserMenu })
class Authorized extends Component {
  state={
    loading:true
  }
  async componentDidMount() {
    // console.log(this.props)
    // 这样一条一条的获取太慢
    // this.props.getUserInfo();
    // this.props.getUserMenu();
    // 改成下面的方式
     // 发送请求获取数据
     let {getUserInfo,getUserMenu} = this.props
     await Promise.all([getUserInfo(),getUserMenu()])
     // 数据一定存储到了redux中
     this.setState({
       loading:false
     })
  }
  render() {
    let {loading} = this.state
    return loading ? <Loading></Loading>:this.props.render();
  }
}
export default Authorized;
