import { User, db, auth } from "./config.js";
import express from "express";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

const app = express();

app.use(express.json());

// Handling requests targeting all users //

app.get("/users", async (req, res) => {
  const users = [];
  const colRef = collection(db, "users");
  getDocs(colRef).then((result) => {
    const users = [];
    result.docs.forEach((doc) => {
      let data = doc.data();
      users.push({ id: doc.id, ...data });
    });
    res.send(users);
  });
});

app.get("/users/childs", (req, res) => {
  const users = [];
  const colRef = collection(db, "users", "5J34s282COFPkvRhScP9", "childs");
  getDocs(colRef).then((result) => {
    console.log(result);
    const users = [];
    result.docs.forEach((doc) => {
      let data = doc.data();
      users.push({ id: doc.id, ...data });
    });
    res.send(users);
  });
});

app.post("/users/signin", (req, res) => {
  const email = req.body.data.email;
  const password = req.body.data.password;

  console.log(email);
  console.log(password);
  console.log("signin");

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      const { user } = cred;

      res.send(user);
    })
    .catch((err) => {
      res.send(err.code);
    });
});

app.post("/users", (req, res) => {
  // const uEmail = req.body.data.user.email;
  // const id = req.body.data.user.uid;
  // const deviceID = req.body.data.deviceID;
  // const code = req.body.data.rand;
  let code1 = "A1B34F";
  let code2 = "AHS32F";
  let code3 = "A13334F";
  let code4 = "C1B341";
  let code5 = "11B34Q";

  const composite_no = code1;
  // console.log(uEmail);
  // console.log(id);
  // console.log(deviceID);
  // console.log(code);
  console.log(id, "rand: ", code1);

  // const data = {
  //   uEmail,
  //   id,
  //   deviceID,
  //   code,
  // };
  const colRef = collection(db, "users");

  setDoc(doc(colRef, composite_no), {
    name: "Los Angeles",
    state: "CA",
    country: "PAK",
    capital: false,
    population: 860000,
    regions: ["west_coast", "norcal"],
  });
  // addDoc(colRef, req.body.data).then((response) => res.send(response));
});

app.post("/users/signout", (req, res) => {
  signOut(auth)
    .then(() => res.send("The user signed out!"))
    .catch((err) => res.send(err.message));
});

app.post("/users/signup", async (req, res) => {
  const email = req.body.data.email;
  const password = req.body.data.password;
  const deviceID = req.body.data.deviceID;

  console.log(email);
  console.log(password);
  console.log(deviceID);
  console.log("signup");

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      const colRef = collection(db, "users");
      addDoc(colRef, { email, deviceID })
        .then(() => console.log("Successfully added"))
        .catch((err) => console.log(err.message));
      const { user } = cred;
      res.send(user);
    })
    .catch((err) => {
      res.send(err.code);
    });

  ///////////////////////////////////////
  // {
  //   const userEmail = req.body.data.email;
  //   const userDevice = req.body.data.deviceID;
  //   console.log(userEmail);
  //   console.log(userDevice);
  //   const userRef = collection(db, "users");
  //   const userSnap = await getDocs(userRef);
  //   const responseObject = {
  //     statusCode: 200,
  //   };
  //   const user = userSnap.docs
  //     .map((doc) => doc.data())
  //     .filter((user) => user.email == userEmail && user.deviceID == userDevice);

  //   if (user.length > 0) {
  //     responseObject.message = "Exists";
  //     res.send(responseObject);
  //   } else {
  //     const obj = { email: userEmail, deviceID: userDevice };
  //     const colRef = collection(db, "users");
  //     addDoc(colRef, obj).then(() => {
  //       responseObject.message = "Successfully registered!";
  //       res.send(responseObject);
  //     });
  //   }
  // }
});

// Handling requests targeting a particular user //

app.get("/users/:id", async (req, res) => {
  const docRef = doc(db, "users", req.params.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    res.send(docSnap.data());
  } else {
    res.send("No such document!");
  }
});

app.get("/users/:u_id/childs/:c_id", (req, res) => {
  const userId = req.params.u_id;
  const childId = req.params.c_id;

  const users = [];
  const colRef = doc(db, "users", userId, "childs", childId);
  getDoc(colRef).then((result) => {
    const data = result.data();
    res.send(data);
  });
});

app.patch("/users/:id", (req, res) => {
  const docRef = doc(db, "users", req.params.id);
  updateDoc(docRef, req.body).then(() => {
    res.send("Successfully Updated!");
  });
});

app.delete("/users/:id", (req, res) => {
  deleteDoc(doc(db, "users", req.params.id)).then(() => {
    res.send("Successfully Deleted!");
  });
});

// Generate code

app.get("/generateCode", (req, res) => {
  const rand = Math.floor(Math.random() * 100000);
  res.send({ code: rand });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
