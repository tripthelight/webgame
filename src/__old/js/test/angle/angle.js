import "../../../scss/test/angle/common.scss";

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateIntersectionPoint(ax, ay, bx, by, radius, directionAngleDegrees) {
  // Convert direction angle from degrees to radians
  let directionAngle = degreesToRadians(directionAngleDegrees);

  // Calculate the direction vector from point a based on the given angle
  let dx = Math.cos(directionAngle);
  let dy = Math.sin(directionAngle);

  // Normalize the direction vector
  let length = Math.sqrt(dx * dx + dy * dy);
  dx /= length;
  dy /= length;

  // Translate the circle's center to the origin for simpler calculations
  let translatedAx = ax - bx;
  let translatedAy = ay - by;

  // Coefficients of the quadratic equation
  let A = dx * dx + dy * dy;
  let B = 2 * (translatedAx * dx + translatedAy * dy);
  let C = translatedAx * translatedAx + translatedAy * translatedAy - radius * radius;

  // Discriminant of the quadratic equation
  let discriminant = B * B - 4 * A * C;

  if (discriminant < 0) {
    // If no real intersection, calculate the nearest point on the circle
    let nearestT = -B / (2 * A);
    let nearestX = ax + nearestT * dx;
    let nearestY = ay + nearestT * dy;
    let distance = Math.sqrt((nearestX - bx) * (nearestX - bx) + (nearestY - by) * (nearestY - by));
    let scalingFactor = radius / distance;
    let intersectionX = bx + (nearestX - bx) * scalingFactor;
    let intersectionY = by + (nearestY - by) * scalingFactor;
    return {x: intersectionX, y: intersectionY};
  }

  // Calculate the two possible intersection points
  let t1 = (-B + Math.sqrt(discriminant)) / (2 * A);
  let t2 = (-B - Math.sqrt(discriminant)) / (2 * A);

  let intersectionX1 = ax + t1 * dx;
  let intersectionY1 = ay + t1 * dy;
  let intersectionX2 = ax + t2 * dx;
  let intersectionY2 = ay + t2 * dy;

  // Return the intersection point that is in the direction of the vector (dx, dy)
  let dot1 = (intersectionX1 - ax) * dx + (intersectionY1 - ay) * dy;
  let dot2 = (intersectionX2 - ax) * dx + (intersectionY2 - ay) * dy;

  if (dot1 >= 0 && dot2 >= 0) {
    return dot1 < dot2 ? {x: intersectionX1, y: intersectionY1} : {x: intersectionX2, y: intersectionY2};
  } else if (dot1 >= 0) {
    return {x: intersectionX1, y: intersectionY1};
  } else {
    return {x: intersectionX2, y: intersectionY2};
  }
}

function calculateAngle(ax, ay, intersectionX, intersectionY) {
  // Vector from point A to intersection point
  let vectorX = intersectionX - ax;
  let vectorY = intersectionY - ay;

  // Calculate the angle in radians
  let angleRadians = Math.atan2(vectorY, vectorX);

  // Convert the angle to degrees
  let angleDegrees = angleRadians * (180 / Math.PI);

  // Adjust the angle to make y-axis negative direction as 0 degrees
  if (angleDegrees < 0) {
    angleDegrees += 360;
  }

  return angleDegrees;
}

function calculateDistance(x1, y1, x2, y2) {
  // 두 점 사이의 거리를 계산하는 공식
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return distance;
}

function init() {
  const WW = window.innerWidth;
  const WH = window.innerHeight;
  const BALL1 = document.getElementById("BALL1");
  const BALL2 = document.getElementById("BALL2");
  const BALLS = [BALL1, BALL2];
  const RADIUS = BALLS[0].clientWidth / 2;
  let positions = BALLS.map(() => ({x: 0, y: 0}));

  // ball init position x y
  positions.forEach((_pos, _index) => {
    _pos.x = WW / 2 - BALLS[_index].clientWidth / 2;
    _pos.y = WH / 2 - BALLS[_index].clientHeight / 2;
    if (_index === 1) {
      _pos.y += 200;
    }
  });

  // ball init position style x y
  BALLS.forEach((_ball, _index) => {
    _ball.style.transform = `
      translate(
        ${positions[_index].x}px,
        ${positions[_index].y}px
      )
    `;
  });

  // ball1의 중심점에서 ball2의 중심점까지 직선
  const APP_EL = document.getElementById("app");
  const LINE_EL = document.createElement("div");
  LINE_EL.classList.add("line");

  APP_EL.appendChild(LINE_EL);

  const L_POS = {
    x1: positions[0].x + BALLS[0].clientWidth / 2 - LINE_EL.clientWidth / 2,
    y1: positions[0].y + BALLS[0].clientHeight / 2,
    x2: positions[1].x + BALLS[1].clientWidth / 2 - LINE_EL.clientWidth / 2,
    y2: positions[1].y + BALLS[1].clientHeight / 2,
  };

  // ====================================================================================
  let pointA = {x: L_POS.x1, y: L_POS.y1};
  let circleCenter = {x: L_POS.x2, y: L_POS.y2};
  let directionAngleDegrees = 20; // 0 : 90도
  let intersectionPoint = calculateIntersectionPoint(pointA.x, pointA.y, circleCenter.x, circleCenter.y, RADIUS, directionAngleDegrees);
  if (intersectionPoint) {
    let angleAtIntersection = calculateAngle(pointA.x, pointA.y, intersectionPoint.x, intersectionPoint.y);
    console.log(`The intersection point is at (${intersectionPoint.x}, ${intersectionPoint.y})`);
    console.log(`The angle at the intersection point is ${angleAtIntersection} degrees`);

    const DOT_EL = document.createElement("div");
    DOT_EL.classList.add("dot");
    APP_EL.appendChild(DOT_EL);
    DOT_EL.style.transform = `translate(${intersectionPoint.x - DOT_EL.clientWidth / 2}px, ${intersectionPoint.y - DOT_EL.clientHeight / 2}px)`;

    const distance = calculateDistance(L_POS.x1, L_POS.y1, intersectionPoint.x - DOT_EL.clientWidth / 2, intersectionPoint.y - DOT_EL.clientHeight / 2);
    LINE_EL.style.height = `${distance}px`;
    LINE_EL.style.transform = `translate(${L_POS.x1}px, ${L_POS.y1}px) rotate(${angleAtIntersection - 90}deg)`;
  }

  // ====================================================================================
}

document.onreadystatechange = () => {
  let state = document.readyState;
  if (state === "interactive") {
  } else if (state === "complete") {
    init();
  }
};
