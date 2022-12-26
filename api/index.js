import dbc from "./_utils/db";
import authr from "./_utils/auth";
import { ObjectId } from "mongodb";
const hexid = /^[a-f\d]{24}$/;
const strts = /^\d+$/;
export default async (req, res) => {
  const { authorization } = req.headers;
  console.log("authorization", authorization);
  if (
    !(
      typeof authorization === "string" &&
      authorization.startsWith("Basic ") &&
      authr(authorization)
    )
  ) {
    return res.status(401).json({ error: "Invalid or Missing Authorization Code" });
  }
  switch (req.method) {
    case "GET":
      {
        const { id, to } = req.query;
        console.log("req.query", req.query);
        if (typeof id === "string" && hexid.test(id)) {
          dbc()
            .then((db) => db.findOne({ _id: ObjectId(id) }))
            .then((doc) => {
              console.log("findOne", doc);
              res.status(200).json({ data: doc });
            })
            .catch((e) => res.status(502).json({ error: e.message }));
        } else if (typeof to === "string" && strts.test(to)) {
          dbc()
            .then((db) =>
              db.find({ timestamp: { $gte: +to } }, { sort: { timestamp: -1 } }).toArray()
            )
            .then((docs) => {
              console.log("find.toArray", docs);
              res.status(200).json({ data: docs });
            })
            .catch((e) => res.status(502).json({ error: e.message }));
        } else {
          res.status(400).json({ error: "Invalid or Missing Data in Query" });
        }
      }
      break;
    case "POST":
      {
        const { timestamp, list } = req.body;
        console.log("req.body", req.body);
        if (
          typeof timestamp === "number" &&
          timestamp > 0 &&
          Array.isArray(list) &&
          list.every(
            ({ amount, note }) =>
              typeof amount === "number" &&
              amount !== 0 &&
              typeof note === "string" &&
              note.length > 0
          )
        ) {
          dbc()
            .then((db) =>
              db.insertMany(list.map(({ amount, note }) => ({ amount, note, timestamp })))
            )
            .then((result) => {
              console.log("insertMany", result);
              res.status(200).json({ data: result });
            })
            .catch((e) => res.status(502).json({ error: e.message }));
        } else {
          res.status(400).json({ error: "Invalid or Missing Data in Payload" });
        }
      }
      break;
    case "PUT":
      {
        const { id, amount, note, timestamp } = req.body;
        console.log("req.body", req.body);
        if (
          typeof id === "string" &&
          hexid.test(id) &&
          typeof amount === "number" &&
          amount !== 0 &&
          typeof note === "string" &&
          note.length > 0 &&
          typeof timestamp === "number" &&
          timestamp > 0
        ) {
          dbc()
            .then((db) =>
              db.updateOne(
                { _id: ObjectId(id) },
                { $set: { amount, note, timestamp } },
                { upsert: true }
              )
            )
            .then((result) => {
              console.log("updateOne", result);
              res.status(200).json({ data: result });
            })
            .catch((e) => res.status(502).json({ error: e.message }));
        } else {
          res.status(400).json({ error: "Invalid or Missing Data in Payload" });
        }
      }
      break;
    case "DELETE":
      {
        const { id } = req.query;
        console.log("req.query", req.query);
        if (typeof id === "string" && hexid.test(id)) {
          dbc()
            .then((db) => db.deleteOne({ _id: ObjectId(id) }))
            .then((result) => {
              console.log("deleteOne", result);
              res.status(200).json({ data: result });
            })
            .catch((e) => res.status(502).json({ error: e.message }));
        } else {
          res.status(400).json({ error: "Invalid or Missing Data in Query" });
        }
      }
      break;
    default:
      res.status(405).json({ error: "Unsupported Method Requested" });
      break;
  }
};
