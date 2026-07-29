import sgMail from "@sendgrid/mail";
import { env } from "./env.js";

sgMail.setApiKey(env.sendgrid.apiKey);

export default sgMail;
