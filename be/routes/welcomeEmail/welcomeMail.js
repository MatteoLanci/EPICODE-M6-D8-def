const express = require("express");
const { Resend } = require("resend");

const email = express.Router();

const resend = new Resend(process.env.RESEND_SECRET_KEY);

email.post("/welcomeEmail", async (req, res) => {
  try {
    const data = await resend.emails.send({
      from: "email@example.com",
      to: ["m.lanci@live.com"],
      subject: "Welcome to StriveBlog",
      html: req.body.html,
    });
    console.log(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = email;
