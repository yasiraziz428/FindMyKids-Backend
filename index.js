import { User } from "./config.js";
import express from "express";
import { addDoc, onSnapshot } from "firebase/firestore";

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
  onSnapshot(User, (result) => {
    const users = [];
    result.docs.forEach((doc) => {
      let data = doc.data();
      users.push({ id: doc.id, ...data });
    });
    res.send(users);
  });
});

app.post("/user", (req, res) => {
  const data = req.body;
  addDoc(User, data).then(() => {
    console.log("successfully added");
    res.send(data);
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
