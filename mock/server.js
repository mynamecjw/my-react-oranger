const express = require("express");

const Mock = require("mockjs");

const Random = Mock.Random;

Random.ctitle();

const app = express();

app.use((req, res, next) => {
  //设置响应头
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "content-type,token");
  res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  //调用下一个中间件
  next();
});

app.get("/admin/edu/subject/:page/:limit", (req, res) => {
  let { page, limit } = req.params;

  const data = Mock.mock({
    total: Random.integer(+limit + 2, limit * 2),
    [`item|${limit}`]: [
      {
        "_id|+1": 1,
        title: "@ctitle(2,5)",
        parentId: 0,
      },
    ],
  });

  res.json({
    code: 20000,
    success: true,
    data,
    message: "",
  });
});
app.listen(8888, (err) => {
  if (err) {
    return console.log("服务启动失败");
  }
  console.log("服务器启动成功,求情地址http://localhost:8888");
});
