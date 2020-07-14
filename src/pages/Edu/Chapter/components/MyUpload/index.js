import React, { Component } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { reqGetQiniuToken } from "@api/edu/lesson";

// 引入
import * as qiniu from "qiniu-js";
import { nanoid } from "nanoid";

const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
export default class MyUpload extends Component {
  // 定义构造函数
  // 构造函数中只是从缓存中获取数据/定义状态
  constructor() {
    super();

    // 一进来要从缓存中获取有没有token
    const str = localStorage.getItem("upload_token");

    if (str) {
      // 如果是有内容的字符串,说明之前存储过token
      // 这里没有必要判断token是否已经过期,只需要把从缓存中拿到的值,赋值给state就可以
      // 把缓存中字符串拿到,转成对象 对象中又uploadToken,expires
      const res = JSON.parse(str);
      this.state = {
        expires: res.expires,
        uploadToken: res.uploadToken,
      };
    } else {
      // 没有内容 undefined, 没有存储过
      this.state = {
        expires: 0,
        uploadToken: "",
      };
    }
  }

  // 上传视频之前调用
  handleBeforeUpload = (file, fileList) => {
    // file就是我们要上传的文件

    return new Promise(async (resolve, reject) => {
      // 在上传视频之前要做的两件事
      // 1.限制视频大小
      // 比如要限制的视频大小是20M
      // MAX_VIDEO_SIZE
      if (file.size > MAX_VIDEO_SIZE) {
        message.error("视频太大,不能超过20M");
        reject();
        // 如果视频过大,后面的代码不执行
        return;
      }
      // 2.请求上传的token
      // 在请求之前,只需要判断token是否过期
      if (Date.now() > this.state.expires) {
        const { uploadToken, expires } = await reqGetQiniuToken();

        // 将数据存储起来
        // state里面有最新的数据,本地缓存中也是有最新的数据
        this.saveUploadToken(uploadToken, expires);
      }
      resolve(file);
    });
  };

  // 存储uploadToken和过期时间的方法
  saveUploadToken = (uploadToken, expires) => {
    // 1.发送请求获取数据
    // 2.存储到本地缓存中
    // 注意: localStorage 里面不能直接存储对象,只能存字符串
    // 注意: expires 是秒数,并且是过期时间的周期值 7200只表示两个小时
    // 所以需要使用expires 换算一个过期的时间
    // 获取到token的时间 加上 时间周期 得到过期的目标时间
    const targetTime = Date.now() + expires * 1000 - 2 * 60 * 1000;
    expires = targetTime;
    const upload_token = JSON.stringify({ uploadToken, expires });
    localStorage.setItem("upload_token", upload_token);
    // 3.存储到state里面
    this.setState({
      uploadToken,
      expires,
    });
  };

  // 真正上传视频时调用,这个函数会覆盖默认的上传方法
  handleCustomRequest = (value) => {
    // 要上传的文件对象
    const file = value.file;

    // key 新定义的文件名 尽可能不要重复
    const key = nanoid(10) + "oranger";

    // token 就是七牛云返回的token
    const token = this.state.uploadToken;

    // putExtra 上传的额外配置项 可以配置上传文件的类型
    // 可以上传所有格式的视频
    // 后台限制上传文件的类型,不是视频,就不能上传成功
    const putExtra = {
      mimeType: "video/*",
    };

    // config 配置项 可以控制上传到哪个区域
    const config = {
      region: qiniu.region.z2,
    };

    const observable = qiniu.upload(file, key, token, putExtra, config);

    const observer = {
      next(res) {
        console.log(res);
        value.onProgress(res.total);
      },
      error(err) {
        value.onError(err);
      },
      complete: (res) => {
        value.onSuccess(res);
        this.props.onChange("http://qdcdb1qpp.bkt.clouddn.com/" + res.key);
      },
    };
    this.subscription = observable.subscribe(observer); // 上传开始
  };
  // 如果组件卸载,上传取消
  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe(); // 上传取消
  }
  render() {
    return (
      <div>
        <Upload
          beforeUpload={this.handleBeforeUpload}
          customRequest={this.handleCustomRequest}
          // 前端控制上传视频的类型,不是视频文件,就看不到
          accept="video/*"
        >
          <Button>
            <UploadOutlined />
            上传视频
          </Button>
        </Upload>
      </div>
    );
  }
}
