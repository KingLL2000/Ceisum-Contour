<div align="center">

[ English](./README.md) | [中文](./README_zh.md)

</div>

# Cesium 等高线

一个 Cesium.js 网格数据的等值面和等值线可视化库。底层使用 [d3-contour](https://github.com/d3/d3-contour)。您可以从 [Leaflet Contour](https://github.com/JamesRunnalls/leaflet-contour) 获取更多信息。

## 特性

- 从网格数据生成等值面
- 从网格数据生成等值线

## 使用方法

```bash
npm install cesium-contour
```

## 快速开始

### 通过多边形等高线显示网格数据

```javascript
import { ContourPolygonPrimitive } from "cesium-contour";

const pContour = new ContourPolygonPrimitive({
  gridData: gridData,
  thresholds: 50,
  colorMap: [
    {
      color: "#053061",
      value: 0,
    },
    {
      color: "#eaf1f5",
      value: 0.5,
    },
    {
      color: "#67001f",
      value: 1,
    },
  ],
  min: 10,
  max: 14,
});
viewer.scene.primitives.add(pContour);
```

### 通过折线等高线显示网格数据

```javascript
const pContour = new ContourPolylinePrimitive({
  gridData: gridData,
  thresholds: 10,
  width: 1,
  colorMap: [
    {
      color: "#053061",
      value: 0,
    },
    {
      color: "#eaf1f5",
      value: 0.5,
    },
    {
      color: "#67001f",
      value: 1,
    },
  ],
  min: 10,
  max: 14,
});
viewer.scene.primitives.add(pContour);
```

## API 参考 (构造函数选项)

### ContourPolygonPrimitive

| 选项         | 类型         | 描述                                   | 默认值  |
| ------------ | ------------ | ------------------------------------- | ------- |
| `gridData`   | Array        | 网格数据数组                           | `null`  |
| `thresholds` | Number/Array | 等高线级别数量或自定义阈值              | `10`    |
| `colorMap`   | Array        | 等高线级别的颜色数组                   | `[]`    |
| `max`        | Number       | 归一化的最大值                         | `10`    |
| `min`        | Number       | 归一化的最小值                         | `0`     |

### ContourPolylinePrimitive

| 选项         | 类型         | 描述                                   | 默认值  |
| ------------ | ------------ | ------------------------------------- | ------- |
| `gridData`   | Array        | 网格数据数组                           | `null`  |
| `thresholds` | Number/Array | 等高线级别数量或自定义阈值              | `10`    |
| `colorMap`   | Array        | 等高线级别的颜色数组                   | `[]`    |
| `max`        | Number       | 归一化的最大值                         | `10`    |
| `min`        | Number       | 归一化的最小值                         | `0`     |
| `width`      | Number       | 线条宽度                              | `1`     |

### 方法

#### `updateGridData(data)`

使用新网格数据更新等高线

#### `setThresholds(thresholds)`

设置新的阈值

#### `setColorMap(colors)`

更新颜色映射

## 示例数据格式

### 数据

数据必须是对象 {x: [[]], y:[[]], z:[[]]}，其中 x, y, z 是相同形状的二维数组。
x: 经度
y: 纬度
z: 要显示的参数

:warning: Leaflet 等高线只能用于显示网格数据，网格数据必须包含超出实际值的地理数据（这意味着至少有一层周围的空值）。对于点数据，[leaflet.heat](https://github.com/Leaflet/Leaflet.heat) 可能更合适。

示例矩形网格数据：

|           | 8.475 | 8.5  | 8.525 | 8.55 | 8.575 | 8.6  | 8.625 |
| --------- | ----- | ---- | ----- | ---- | ----- | ---- | ----- |
| **47.42** | null  | null | null  | null | null  | null | null  |
| **47.4**  | null  | null | null  | 2    | null  | null | null  |
| **47.38** | null  | null | 2     | 5    | 2     | null | null  |
| **47.36** | null  | 2    | 5     | 10   | 5     | 2    | null  |
| **47.34** | null  | null | 2     | 5    | 2     | null | null  |
| **47.32** | null  | null | null  | 2    | null  | null | null  |
| **47.3**  | null  | null | null  | null | null  | null | null  |

```javascript
const data = {
  x: [
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],
    ],
  y: [
      [47.42, 47.42, 47.42, 47.42, 47.42, 47.42, 47.42],
      [47.4, 47.4, 47.4, 47.4, 47.4, 47.4, 47.4],
      [47.38, 47.38, 47.38, 47.38, 47.38, 47.38, 47.38],
      [47.36, 47.36, 47.36, 47.36, 47.36, 47.36, 47.36],
      [47.34, 47.34, 47.34, 47.34, 47.34, 47.34, 47.34],
      [47.32, 47.32, 47.32, 47.32, 47.32, 47.32, 47.32],
      [47.3, 47.3, 47.3, 47.3, 47.3, 47.3, 47.3],
    ],
  z: [
      [null, null, null, null, null, null, null],
      [null, null, null, 2, null, null, null],
      [null, null, 2, 5, 2, null, null],
      [null, 2, 5, 10, 5, 2, null],
      [null, null, 2, 5, 2, null, null],
      [null, null, null, 2, null, null, null],
      [null, null, null, null, null, null, null],
    ],
};

```

## 开发

如果您想开发这个项目，可以按照以下步骤操作：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 许可证

MIT © [wang hua bo]

## 问题

欢迎提交问题和拉取请求。

## 贡献

欢迎贡献！请在提交拉取请求之前阅读我们的贡献指南。