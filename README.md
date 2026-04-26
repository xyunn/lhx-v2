# 抽水蓄能电站风险管控处理演示系统

一个基于 React + Tailwind CSS 的前端演示项目，使用树状 JSON 数据驱动首页、模块页、场景页、活动页和风险详情页。

## 运行方式

```bash
python -m http.server 5173
https://xyunn.github.io/lhx-v2/
```

浏览器打开：

```text
<http://localhost:5173>
```

## 数据扩展

风险层级数据位于：

```text
src/data/riskTree.js
```

新增模块、场景、活动或风险项时，按 `module -> scene -> activity -> risk` 的结构追加节点即可。
