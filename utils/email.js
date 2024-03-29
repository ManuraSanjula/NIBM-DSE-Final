const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const { convert }= require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Manura Sanjula <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }


  async send_order(order, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/orderGrant.pug`, {
      firstName: this.firstName,
      url: this.url,
      order
    });

    // 2) Define email options
    const mailOptions = {
      from: 'w.m.manurasanjula2003@gmail.com',
      to: this.to,
      subject,
      html,
      text: convert(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: 'w.m.manurasanjula2003@gmail.com',
      to: this.to,
      subject,
      html,
      text: convert(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Cloth Hut Example App!');
  }

  async refund() {
    await this.send('refund',
     'Your refund has been submitted successfully');
  }

  async confrimOrder() {
    await this.send('confrimOrder',
     'Your order has been received successfully.');
  }

  // async refund() {
  //   await this.send(
  //     'passwordReset',
  //     'Your password reset token (valid for only 10 minutes)'
  //   );
  // }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
