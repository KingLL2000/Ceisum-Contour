import ContourPolygonPrimitive from "./ContourPolygonPrimitive";
import ContourPolylinePrimitive from "./ContourPolylinePrimitive";

if (window && window.Cesium) {
  if (Object.isFrozen(window.Cesium)) {
    window.ContourPolygonPrimitive = ContourPolygonPrimitive;
    window.ContourPolylinePrimitive = ContourPolylinePrimitive;
  } else {
    window.Cesium.ContourPolygonPrimitive = ContourPolygonPrimitive;
    window.Cesium.ContourPolylinePrimitive = ContourPolylinePrimitive;
  }
}
export { ContourPolygonPrimitive, ContourPolylinePrimitive };
