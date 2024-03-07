import * as functions from "firebase-functions";
import * as firebase from "firebase/app";
import nodemailer from "nodemailer";
import {htmlTemplate} from "./";

const send = async (
  req: functions.https.Request,
  firebaseApp: firebase.FirebaseApp,
) => {
  const {body} = req;
  const {
    subject,
    to,
    from,
    html,
    text,
  } = body;

  if (!firebaseApp) console.log("body", from);

  const templated = htmlTemplate({
    subject,
    to,
    from,
    html,
    text,
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 587,
    secure: false,
    auth: {
      user: "ai@goldlabel.pro",
      pass: process.env.REACT_APP_FORWARDEMAIL,
    },
  });
  try {
    const forwardemail = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: templated,
    });
    return {
      forwardemail,
    };
  } catch (error: nodemailer.SentMessageInfo) {
    const {
      response,
      responseCode,
    } = error;
    return {
      code: responseCode,
      severity: "error",
      message: response,
    };
  }
};

export default send;
