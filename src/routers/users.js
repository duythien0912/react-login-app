import express from "express";
import User from "../models/user";
import parseErrors from "../utils/parseError";
import { sendConfirmationEmail } from "../mailer";

const router = express.Router();

router.post("/", (req, res) => {
  const { email, password } = req.body.user;
  const user = new User({ email });
  user.setPassword(password);
  user.setConfirmationToken();
  user
    .save()
    .then(userRecord => {
      sendConfirmationEmail(userRecord);
      res.json({ user: userRecord.toAuthJson() });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
