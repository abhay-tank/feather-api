const nodemailer = require("nodemailer");
const { config } = require("../configuration/config");
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	ignoreTLS: false,
	auth: {
		user: config.NODE_MAILER_EMAIL,
		pass: config.NODE_MAILER_PASSWORD,
	},
});

const sendVerificationEmail = (userFirstName, userEmail, verificationURL) => {
	let verificationMail = {
		from: config.NODE_MAILER_EMAIL,
		to: userEmail,
		subject: "Verify Account",
		html: `
       <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
    >
      <img
        style="width: 400px; pointer-events: none"
        src="https://media.giphy.com/media/3ohzAgy79O8c10FQHK/giphy.gif"
        alt=""
      />
      <h1
        style="
          margin: 1rem 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-weight: normal;
        "
      >
        Hii ${userFirstName}
      </h1>
      <h2
        style="
          margin: 1rem 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-weight: normal;
        "
      >
        Please verify your account.
      </h2>
      <a
        style="
          display: block;
          align-self: center;
          width: max-content;
          margin: 1rem 0.5rem;
          padding: 1rem 0.5rem;
          background-color: #faad4d;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-decoration: none;
          box-shadow: 4px 4px #b13dac;
        "
        href="${verificationURL}"
        >Verify Account</a
      >
      <h3
        style="
          margin: 2rem 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-weight: normal;
        "
      >
        OR Copy link and paste it your browser
      </h3>
      <a
        style="text-align: center; word-break: break-all; width: 40%"
        href="${verificationURL}"
        >${verificationURL}</a
      >
    </div>
    `,
	};
	return transporter.sendMail(verificationMail, (err, info) => {
		if (err) {
			console.error(err);
			return err;
		} else {
			return info;
		}
	});
};

module.exports = sendVerificationEmail;
