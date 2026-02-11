import { extent, range } from "d3";
import { contours as d3contours } from "d3-contour";
import {
  Primitive,
  Color,
  PerInstanceColorAppearance,
  Cartesian3,
  GeometryInstance,
  PolylineGeometry,
  ColorGeometryInstanceAttribute,
  PolylineColorAppearance,
} from "cesium";

class ContourPolylinePrimitive extends Primitive {
  _primitive = null;
  gridData = null;
  options = {
    thresholds: 10,
    colorMap: [],
    width: 1,
    max: 10,
    min: 0,
  };

  constructor(options) {
    super(options);
    this.options = options;
    if (options.gridData) {
      this.gridData = options.gridData;
      const geojson = this._createContours(options.gridData);
      this._updatePrimitive(geojson);
    }
  }

  _updatePrimitive(geojson) {
    if (!geojson || !geojson.length) {
      this._primitive = undefined;
      return;
    }
    // 存储所有的几何体实例
    this.geometryInstances = [];
    // 遍历所有等值线的级别
    for (let i = 0; i < geojson.length; i++) {
      const contour = geojson[i];
      const colorSring = this._getColor(
        contour.value,
        this.options.min,
        this.options.max,
        this.options.colorMap,
      );
      const color = Color.fromCssColorString(colorSring);
      contour.coordinates.forEach((lineCoords) => {
        this.geometryInstances.push(
          this._createPolylineInstance(lineCoords, color),
        );
      });
    }
    // 创建Primitive实现线绘制
    this._primitive = new Primitive({
      geometryInstances: this.geometryInstances,
      appearance: new PolylineColorAppearance({
        translucent: false,
        renderState: {
          depthTest: {
            enabled: false,
          },
        },
      }),
      // appearance: new PerInstanceColorAppearance({
      //   flat: true,
      //   translucent: false,
      //   renderState: {
      //     depthTest: {
      //       enabled: false,
      //     },
      //   },
      // }),
    });
  }

  _createPolylineInstance(coordinates, color) {
    try {
      // 处理每条线的坐标
      const positions = Cartesian3.fromDegreesArray(coordinates[0].flat());
      // 创建线几何体实例
      return new GeometryInstance({
        geometry: new PolylineGeometry({
          positions: positions,
          width: this.options.width ?? 1, // 线宽
          vertexFormat: PolylineColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(color),
        },
      });
    } catch (error) {
      console.log("#", error);
    }
  }
  /**
   * 线性插值获取颜色
   * @param {Number} value 值
   * @param {Number} min 最小值
   * @param {Number} max 最大值
   * @param {Array} colors 颜色数组
   * @returns {String} 颜色
   */
  _getColor(value, min, max, colors) {
    function hex(c) {
      var s = "0123456789abcdef";
      var i = parseInt(c, 10);
      if (i === 0 || isNaN(c)) return "00";
      i = Math.round(Math.min(Math.max(0, i), 255));
      return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
    }
    function trim(s) {
      return s.charAt(0) === "#" ? s.substring(1, 7) : s;
    }
    function convertToRGB(hex) {
      var color = [];
      color[0] = parseInt(trim(hex).substring(0, 2), 16);
      color[1] = parseInt(trim(hex).substring(2, 4), 16);
      color[2] = parseInt(trim(hex).substring(4, 6), 16);
      return color;
    }
    function convertToHex(rgb) {
      return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
    }

    if (value === null || isNaN(value)) {
      return "#ffffff";
    }
    if (value > max) {
      return colors[colors.length - 1].color;
    }
    if (value < min) {
      return colors[0].color;
    }
    const loc = (value - min) / (max - min);

    if (loc < 0 || loc > 1) {
      return "#fff";
    } else {
      let index = 0;
      for (let i = 0; i < colors.length - 1; i++) {
        if (loc >= colors[i].value && loc <= colors[i + 1].value) {
          index = i;
        }
      }
      const color1 = convertToRGB(colors[index].color);
      const color2 = convertToRGB(colors[index + 1].color);

      const f =
        (loc - colors[index].value) /
        (colors[index + 1].value - colors[index].value);
      const rgb = [
        color1[0] + (color2[0] - color1[0]) * f,
        color1[1] + (color2[1] - color1[1]) * f,
        color1[2] + (color2[2] - color1[2]) * f,
      ];

      return `#${convertToHex(rgb)}`;
    }
  }

  _createContours(gridData) {
    const zdomain = extent(
      [].concat.apply([], gridData.z).filter((f) => {
        return !isNaN(parseFloat(f)) && isFinite(f);
      }),
    );
    const thresholds = range(
      zdomain[0],
      zdomain[1],
      (zdomain[1] - zdomain[0]) / this.options.thresholds,
    );

    const values = gridData.z.flat();
    const contours = d3contours()
      .size([gridData.z[0].length, gridData.z.length])
      .thresholds(thresholds)(values);

    for (let i = 0; i < contours.length; i++) {
      for (let j = 0; j < contours[i].coordinates.length; j++) {
        for (let k = 0; k < contours[i].coordinates[j].length; k++) {
          for (let l = 0; l < contours[i].coordinates[j][k].length; l++) {
            contours[i].coordinates[j][k][l] = this._unitToGeographic(
              gridData.x,
              gridData.y,
              contours[i].coordinates[j][k][l][1],
              contours[i].coordinates[j][k][l][0],
            );
          }
        }
      }
    }

    return contours;
  }

  _unitToGeographic(gridx, gridy, i, j) {
    const ii = Math.floor(i);
    const jj = Math.floor(j);
    let x, y;
    if (
      gridx[ii][jj] !== null &&
      gridx[ii][jj + 1] !== null &&
      gridx[ii + 1][jj] !== null &&
      gridx[ii + 1][jj + 1] !== null
    ) {
      x =
        ((gridx[ii + 1][jj + 1] - gridx[ii + 1][jj]) * (j - jj) +
          gridx[ii + 1][jj] +
          ((gridx[ii][jj + 1] - gridx[ii][jj]) * (j - jj) + gridx[ii][jj])) /
        2;
      y =
        ((gridy[ii + 1][jj] - gridy[ii][jj]) * (i - ii) +
          gridy[ii][jj] +
          ((gridy[ii + 1][jj + 1] - gridy[ii][jj + 1]) * (i - ii) +
            gridy[ii][jj + 1])) /
        2;
    } else {
      x = gridx[ii][jj];
      y = gridy[ii][jj];
    }

    return [x, y];
  }

  /**
   * 更新函数，由Cesium渲染循环调用
   * @param {Cesium.FrameState} frameState 渲染帧状态
   * @returns {Cesium.DrawCommand[]} 渲染命令列表
   */
  update(frameState) {
    if (this._primitive) {
      return this._primitive.update(frameState);
    }
    return [];
  }

  /**
   * 销毁资源
   */
  destroy() {
    if (this._primitive && this._primitive.destroy) {
      this._primitive.destroy();
    }
    return this;
  }
}

export default ContourPolylinePrimitive;
