import pool from "./index.js";

export async function createReservationDB(user, startTime, endTime, amountPCs) {
  const [result] = await pool.query(
    `INSERT INTO reservation (userId, startTime, endTime, count) VALUES
    (?,?,?,?)`,
    [user, startTime, endTime, amountPCs]
  );
  return result.insertId;
}

const resPeriodCondition =
  "WHERE (startTime BETWEEN ? AND ?) OR (endTime BETWEEN ? AND ?) OR (? BETWEEN startTime AND endTime) OR (? BETWEEN startTime AND endTime);";

export async function getReservationsForPeriodDB(startTime, endTime) {
  const [result] = await pool.query(
    `SELECT user.firstName, user.lastName, reservation.startTime, reservation.endTime, reservation.rId, reservation.count FROM reservation INNER JOIN user ON reservation.userId=user.userId ` +
      resPeriodCondition,
    [startTime, endTime, startTime, endTime, startTime, endTime]
  );
  return result;
}

export async function getReservationsCountForPeriodDB(startTime, endTime) {
  const [result] = await pool.query(
    `SELECT SUM(count) AS reservationsCount FROM reservation ` +
      resPeriodCondition,
    [startTime, endTime, startTime, endTime, startTime, endTime]
  );
  return parseInt(result[0].reservationsCount);
}

export async function getReservationsForDayDB(day) {
  const [result] = await pool.query(
    `SELECT * FROM reservation WHERE ? BETWEEN Date(startTime) AND Date(endTime)`,
    [day]
  );
  return result;
}
