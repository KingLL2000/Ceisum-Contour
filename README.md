<div align="center">

[English](./README.md) | [中文](./README_zh.md)

</div>

# Cesium Contour

A grid data contour visualization library for Cesium.js. Uses [d3-contour](https://github.com/d3/d3-contour) under the hood. You can find more information from  [Leaflet Contour](https://github.com/JamesRunnalls/leaflet-contour).

## Features

- Generate contour polygon from grid data
- Generate contour polyline from grid data

## USE

```bash
npm install cesium-contour
```

## Quick Start

### Display grid data by polygon contour

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

### Display grid data by polyline contour

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

## API Reference (Constructor Options)

### ContourPolygonPrimitive

| Option       | Type         | Description                                   | Default |
| ------------ | ------------ | --------------------------------------------- | ------- |
| `gridData`   | Array        | Grid data array                               | `null`  |
| `thresholds` | Number/Array | Number of contour levels or custom thresholds | `10`    |
| `colorMap`   | Array        | Array of colors for contour levels            | `[]`    |
| `max`        | Number       | Maximum value for normalization               | `10`    |
| `min`        | Number       | Minimum value for normalization               | `0`     |

### ContourPolylinePrimitive

| Option       | Type         | Description                                   | Default |
| ------------ | ------------ | --------------------------------------------- | ------- |
| `gridData`   | Array        | Grid data array                               | `null`  |
| `thresholds` | Number/Array | Number of contour levels or custom thresholds | `10`    |
| `colorMap`   | Array        | Array of colors for contour levels            | `[]`    |
| `max`        | Number       | Maximum value for normalization               | `10`    |
| `min`        | Number       | Minimum value for normalization               | `0`     |
| `width`      | Number       | Minimum value for normalization               | `1`     |

### Methods

#### `updateGridData(data)`

Update the contour with new grid data

#### `setThresholds(thresholds)`

Set new threshold values

#### `setColorMap(colors)`

Update the color mapping

## Example Data Format

### data

Data must be an object {x: [[]], y:[[]], z:[[]]} where x, y, z are 2D arrays of equivalent shape.
x: Longitude
y: Latitude
z: Parameter to display

:warning: Leaflet contour can only be used to disply gridded data, the gridded data must include geographic data beyond the real values (this means at least one layer of surrounding null values). For point data [leaflet.heat](https://github.com/Leaflet/Leaflet.heat) may be more appropriate.

Example rectangluar gridded data:

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
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],\
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],\
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],\
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],\
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],\
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],\
      [8.475, 8.5, 8.525, 8.55, 8.575, 8.6, 8.625],\
    ],
  y: [
      [47.42, 47.42, 47.42, 47.42, 47.42, 47.42, 47.42],\
      [47.4, 47.4, 47.4, 47.4, 47.4, 47.4, 47.4],\
      [47.38, 47.38, 47.38, 47.38, 47.38, 47.38, 47.38],\
      [47.36, 47.36, 47.36, 47.36, 47.36, 47.36, 47.36],\
      [47.34, 47.34, 47.34, 47.34, 47.34, 47.34, 47.34],\
      [47.32, 47.32, 47.32, 47.32, 47.32, 47.32, 47.32],\
      [47.3, 47.3, 47.3, 47.3, 47.3, 47.3, 47.3],\
    ],
  z: [
      [null, null, null, null, null, null, null],\
      [null, null, null, 2, null, null, null],\
      [null, null, 2, 5, 2, null, null],\
      [null, 2, 5, 10, 5, 2, null],\
      [null, null, 2, 5, 2, null, null],\
      [null, null, null, 2, null, null, null],\
      [null, null, null, null, null, null, null],\
    ],
};

```

## Development
If you want to develop this project, you can follow the steps below:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
## License

MIT © [wang hua bo]
## Issues
Issues and pull requests are welcome.
## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.