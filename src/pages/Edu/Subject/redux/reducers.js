import { GET_SUBJECT_LIST, GET_SECSUBJECT_LIST } from "./constants";

const initSubjectList = {
  total: 0, // 总数
  items: [], // 详细user数据
};

export default function subjectList(prevState = initSubjectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      action.data.items.forEach((item) => {
        item.children = [];
      });
      return action.data;
    case GET_SECSUBJECT_LIST:
      // 1.获取一级分类的id(需要先着地要把这个数据添加到哪个一级里面)
      // 如果没有二级分类数据,不执行后面代码
      if (action.data.items.length > 0) {
        const parentId = action.data.items[0].parentId;

        // 2.找到对应的一级分类数据
        // 遍历一级分类
        prevState.items.forEach((item) => {
          // 找到了对应的一级分类
          if (item._id === parentId) {
            // 给一级分类的children赋值
            item.children = action.data.items;
          }
        });
      }
      // 刚才的代码一直在修改原来的数据,redux也是浅层对比
      // 所以要创建一个新的对象
      return {
        ...prevState,
      };
    default:
      return prevState;
  }
}
