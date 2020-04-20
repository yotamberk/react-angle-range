import React, { useState, useCallback, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { useMouse } from "react-use";
import injectSheet from "react-jss";

const HANDLER_RADIUS = 10;
const DEFAULT_HANDLER_RADIUS_OFFSET = 30;
const RADIUS = 150;

const styles = {
  root: {
    position: "relative",
    margin: "0px",
    display: "inline-block"
  },
  rootBoundaries: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0
  },
  fullRange: {
    border: "1px solid black",
    overflow: "hidden",
    position: "relative"
  },
  relativeAxis: {
    position: "absolute"
  },
  axisCenter: {
    position: "absolute",
    width: 0,
    height: 0,
    borderRadius: 6,
    backgroundColor: "black",
    padding: 6,
    paddingTop: 5,
    paddingLeft: 5,
    bottom: -6,
    right: -6
  },
  centerAngleHandler: {
    backgroundColor: "purple",
    position: "absolute",
    cursor: "drag",
    userSelect: "none"
  },
  offsetAngleHandler: {
    backgroundColor: "blue",
    position: "absolute",
    cursor: "drag",
    userSelect: "none"
  },
  offsetsSegment: {
    height: "100%",
    overflow: "hidden",
    position: "absolute",
    width: "100%"
  },
  offsetsSegmentRemove: {
    background: "rgba(0,255,0,0.5)",
    height: "100%",
    width: "100%",
    position: "absolute",
    transformOrigin: "50% 0%"
  }
};

const radiantsToDegrees = radians =>
  parseInt(((radians * 180) / Math.PI).toFixed(0), 10);

const degreesToRadians = degress => (degress * Math.PI) / 180;

const getCenterAngleOfRange = (from, to) => {
  if (from > to) {
    return (to - (360 - from)) / 2;
  }
  return (from + to) / 2;
};

const getOffsetAngleOfRangeCenter = (from, to) => {
  if (from > to) {
    return (to + (360 - from)) / 2;
  }
  return (to - from) / 2;
};

const modulus360 = angle => (angle + 360) % 360;

const AngleRange = ({
  classes,
  value = { from: 0, to: 90 },
  onChange = ({ from = 0, to = 90 }) => {},
  isDisabled = false,
  limitFrom = null,
  limitTo = null,
  radius = RADIUS,
  handlerRangeRadiusOffset = DEFAULT_HANDLER_RADIUS_OFFSET,
  handlerRadius = HANDLER_RADIUS,
  offsetHandlerRadius = HANDLER_RADIUS,
  offsetHandlerRadiusOffset = HANDLER_RADIUS,
  min = 0,
  max = 359,
  // minOffset = 0,
  // maxOffset = 45,
  isQuarterCircle = false
}) => {
  const getHandlerXY = useCallback(
    (angle, handlerRadiusOffset) => {
      const alpha = angle % 360;
      const x =
        (radius + handlerRadiusOffset) * Math.sin(degreesToRadians(alpha));
      const y =
        -(radius + handlerRadiusOffset) * Math.cos(degreesToRadians(alpha));
      return { x, y };
    },
    [radius]
  );

  const [centerHandler, setCenterHandler] = useState({
    ...getHandlerXY((value.to - value.from) / 2, handlerRangeRadiusOffset),
    angle: (value.to - value.from) / 2
  });

  const [fromAngleHandler, setFromAngleHandler] = useState({
    ...getHandlerXY(value.from, offsetHandlerRadiusOffset),
    angle: value.from
  });
  const [toAngleHandler, setToAngleHandler] = useState({
    ...getHandlerXY(value.to, offsetHandlerRadiusOffset),
    angle: value.to
  });

  const [isCenterHandlerActive, setIsCenterHandlerActive] = useState(false);
  const [isFromAngleHandlerActive, setIsFromAngleHandlerActive] = useState(
    false
  );
  const [isToAngleHandlerActive, setIsToAngleHandlerActive] = useState(false);

  const centerHandlerEl = useRef(null);
  const axisCenterEl = useRef(null);
  const fromAngleHandlerEl = useRef(null);
  const toAngleHandlerEl = useRef(null);

  const { elX, elY } = useMouse(axisCenterEl);

  const onCenterAngleHandlerMouseDown = useCallback(
    e => {
      if (isDisabled) {
        return;
      }
      setIsCenterHandlerActive(true);
    },
    [setIsCenterHandlerActive, isDisabled]
  );

  const onfromAngleHandlerMouseDown = useCallback(
    e => {
      if (isDisabled) {
        return;
      }
      setIsFromAngleHandlerActive(true);
    },
    [setIsFromAngleHandlerActive, isDisabled]
  );

  const ontoAngleHandlerMouseDown = useCallback(
    e => {
      if (isDisabled) {
        return;
      }
      setIsToAngleHandlerActive(true);
    },
    [setIsToAngleHandlerActive, isDisabled]
  );

  const onMouseUp = useCallback(() => {
    if (isDisabled) {
      return;
    }
    setIsCenterHandlerActive(false);
    setIsFromAngleHandlerActive(false);
    setIsToAngleHandlerActive(false);
    onChange({ from: fromAngleHandler.angle, to: toAngleHandler.angle });
  }, [isDisabled, onChange, fromAngleHandler, toAngleHandler]);

  const getAbsoluteAngle = useCallback(() => {
    let alpha =
      Math.round(elY) !== 0 // avoid dividing by 0
        ? radiantsToDegrees(Math.atan(elX / -elY))
        : 90;

    if (elY > 0 || elX < 0) {
      alpha += 180;
    }
    if (elY < 0 && elX < 0) {
      alpha += 180;
    }
    return alpha;
  }, [elX, elY]);

  const onMouseMove = useCallback(
    e => {
      if (isDisabled) {
        return;
      }
      if (isCenterHandlerActive) {
        let updatedCenterAngle = getAbsoluteAngle();
        if (updatedCenterAngle < min || updatedCenterAngle > max) {
          updatedCenterAngle = centerHandler.angle;
        }
        const { x: xCenter, y: yCenter } = getHandlerXY(
          updatedCenterAngle,
          handlerRangeRadiusOffset
        );
        const offsetAngle = Math.ceil(updatedCenterAngle - centerHandler.angle);
        const updatedFromAngle = modulus360(
          fromAngleHandler.angle + offsetAngle
        );
        const updatedToAngle = modulus360(toAngleHandler.angle + offsetAngle);
        const { x: xFrom, y: yFrom } = getHandlerXY(
          updatedFromAngle,
          offsetHandlerRadiusOffset
        );
        const { x: xTo, y: yTo } = getHandlerXY(
          updatedToAngle,
          offsetHandlerRadiusOffset
        );
        if (
          (limitFrom &&
            (limitFrom.min > updatedFromAngle ||
              limitFrom.max < updatedFromAngle)) ||
          (limitTo &&
            (limitTo.min > updatedToAngle || limitTo.max < updatedToAngle))
        ) {
          return;
        }
        setFromAngleHandler({ x: xFrom, y: yFrom, angle: updatedFromAngle });
        setCenterHandler({ x: xCenter, y: yCenter, angle: updatedCenterAngle });
        setToAngleHandler({ x: xTo, y: yTo, angle: updatedToAngle });
      }

      if (isFromAngleHandlerActive) {
        const updatedFromAngleHandlerAngle = getAbsoluteAngle();
        const { x: xFrom, y: yFrom } = getHandlerXY(
          updatedFromAngleHandlerAngle,
          offsetHandlerRadiusOffset
        );
        const updatedCenterAngle = getCenterAngleOfRange(
          updatedFromAngleHandlerAngle,
          toAngleHandler.angle
        );
        const { x: xCenter, y: yCenter } = getHandlerXY(
          updatedCenterAngle,
          handlerRangeRadiusOffset
        );
        if (
          limitFrom &&
          (limitTo.min > updatedFromAngleHandlerAngle ||
            limitTo.max < updatedFromAngleHandlerAngle)
        ) {
          return;
        }
        setCenterHandler({ x: xCenter, y: yCenter, angle: updatedCenterAngle });
        setFromAngleHandler({
          x: xFrom,
          y: yFrom,
          angle: updatedFromAngleHandlerAngle
        });
      }

      if (isToAngleHandlerActive) {
        const updatedToAngleHandlerAngle = getAbsoluteAngle();
        const { x: xTo, y: yTo } = getHandlerXY(
          updatedToAngleHandlerAngle,
          offsetHandlerRadiusOffset
        );
        const updatedCenterAngle = getCenterAngleOfRange(
          fromAngleHandler.angle,
          updatedToAngleHandlerAngle
        );
        const { x: xCenter, y: yCenter } = getHandlerXY(
          updatedCenterAngle,
          handlerRangeRadiusOffset
        );
        if (
          limitTo &&
          (limitTo.min > updatedToAngleHandlerAngle ||
            limitTo.max < updatedToAngleHandlerAngle)
        ) {
          return;
        }
        setToAngleHandler({
          x: xTo,
          y: yTo,
          angle: updatedToAngleHandlerAngle
        });
        setCenterHandler({ x: xCenter, y: yCenter, angle: updatedCenterAngle });
      }

      onChange({ from: fromAngleHandler.angle, to: toAngleHandler.angle });
    },
    [
      isDisabled,
      isCenterHandlerActive,
      isFromAngleHandlerActive,
      isToAngleHandlerActive,
      getAbsoluteAngle,
      min,
      max,
      getHandlerXY,
      handlerRangeRadiusOffset,
      centerHandler.angle,
      fromAngleHandler.angle,
      toAngleHandler.angle,
      offsetHandlerRadiusOffset,
      limitFrom,
      limitTo,
      onChange
    ]
  );

  const offsetAngleOfCenter = useMemo(() => {
    return getOffsetAngleOfRangeCenter(
      fromAngleHandler.angle,
      toAngleHandler.angle
    );
  }, [fromAngleHandler.angle, toAngleHandler.angle]);

  return (
    <div
      className={classes.root}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      style={{
        cursor:
          isCenterHandlerActive ||
          isFromAngleHandlerActive ||
          isToAngleHandlerActive
            ? "move"
            : "auto"
      }}
    >
      <div
        className={classes.fullRange}
        style={{
          width: isQuarterCircle ? radius : 2 * radius,
          height: isQuarterCircle ? radius : 2 * radius,
          borderRadius: 2 * radius,
          borderBottomRightRadius: isQuarterCircle ? 0 : 2 * radius,
          borderBottomLeftRadius: isQuarterCircle ? 0 : 2 * radius,
          borderTopLeftRadius: isQuarterCircle ? 0 : 2 * radius,
          margin: Math.max(handlerRangeRadiusOffset, 0)
        }}
      >
        <div
          className={classes.offsetsSegment}
          style={{
            transform: `translate(${
              isQuarterCircle ? "-100%, 0" : "0, -50%"
            }) rotate(90deg) rotate(${fromAngleHandler.angle}deg)`,
            transformOrigin: isQuarterCircle ? "100% 100%" : "50% 100%"
          }}
        >
          <div
            className={classes.offsetsSegmentRemove}
            style={{
              transform: `translate(0, 100%) rotate(${offsetAngleOfCenter}deg)`,
              transformOrigin: isQuarterCircle ? "100% 0%" : "50% 0%"
            }}
          />
        </div>
        <div
          className={classes.offsetsSegment}
          style={{
            transform: `translate(${
              isQuarterCircle ? "-100%, 0" : "0, -50%"
            }) rotate(90deg) rotate(${fromAngleHandler.angle +
              offsetAngleOfCenter}deg)`,
            transformOrigin: isQuarterCircle ? "100% 100%" : "50% 100%"
          }}
        >
          <div
            className={classes.offsetsSegmentRemove}
            style={{
              transform: `translate(0, 100%) rotate(${offsetAngleOfCenter}deg)`,
              transformOrigin: isQuarterCircle ? "100% 0%" : "50% 0%"
            }}
          />
        </div>
      </div>

      <div
        className={classes.relativeAxis}
        style={{
          top: radius + Math.max(handlerRangeRadiusOffset, 0),
          left:
            (isQuarterCircle ? 0 : radius) +
            Math.max(handlerRangeRadiusOffset, 0)
        }}
      >
        <div className={classes.axisCenter} ref={axisCenterEl} />
        <div
          ref={centerHandlerEl}
          className={classes.centerAngleHandler}
          style={{
            width: 2 * handlerRadius,
            height: 2 * handlerRadius,
            borderRadius: 2 * handlerRadius,
            transform: `translate(${centerHandler.x -
              handlerRadius}px, ${centerHandler.y - handlerRadius}px)`,
            opacity: isCenterHandlerActive ? 0.5 : 1,
            cursor: isCenterHandlerActive ? "move" : "pointer"
          }}
          onMouseDown={onCenterAngleHandlerMouseDown}
        />
        <div
          ref={fromAngleHandlerEl}
          className={classes.offsetAngleHandler}
          style={{
            width: offsetHandlerRadius,
            height: 2 * offsetHandlerRadius,
            borderRadius: 0,
            transformOrigin: "100% 50%",
            transform: `translate(${fromAngleHandler.x -
              offsetHandlerRadius}px, ${fromAngleHandler.y -
              offsetHandlerRadius +
              1}px) rotate(${fromAngleHandler.angle}deg)`,
            borderTopLeftRadius: 2 * offsetHandlerRadius,
            opacity: isFromAngleHandlerActive ? 0.8 : 1,
            cursor: isFromAngleHandlerActive ? "move" : "pointer"
          }}
          onMouseDown={onfromAngleHandlerMouseDown}
        />
        <div
          ref={toAngleHandlerEl}
          className={classes.offsetAngleHandler}
          style={{
            width: offsetHandlerRadius,
            height: 2 * offsetHandlerRadius,
            borderRadius: 0,
            transformOrigin: "0% 50%",
            borderTopRightRadius: 2 * offsetHandlerRadius,
            transform: `translate(${toAngleHandler.x}px, ${toAngleHandler.y -
              offsetHandlerRadius +
              1}px) rotate(${toAngleHandler.angle}deg)`,
            opacity: isToAngleHandlerActive ? 0.8 : 1,
            cursor: isToAngleHandlerActive ? "move" : "pointer"
          }}
          onMouseDown={ontoAngleHandlerMouseDown}
        />
      </div>
    </div>
  );
};

AngleRange.propTypes = {
  value: PropTypes.shape({
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  limitFrom: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }),
  limitTo: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }),
  radius: PropTypes.number,
  handlerRangeRadiusOffset: PropTypes.number,
  handlerRadius: PropTypes.number,
  offsetHandlerRadius: PropTypes.number,
  offsetHandlerRadiusOffset: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  // minOffset: PropTypes.bool,
  // maxOffset: PropTypes.bool,
  isQuarterCircle: PropTypes.bool
};

export default injectSheet(styles)(AngleRange);
