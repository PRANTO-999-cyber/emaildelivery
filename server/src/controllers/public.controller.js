import { asyncHandler } from "../utils/asyncHandler.js";
import { unsubscribeContact } from "../services/tracking.service.js";

export const unsubscribe = asyncHandler(async (req, res) => {
  const contact = await unsubscribeContact(req.params.token);

  if (!contact) {
    return res.status(404).send("Invalid or expired unsubscribe link.");
  }

  res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding: 40px;">
        <h2>You have been unsubscribed</h2>
        <p>${contact.email} will no longer receive emails from us.</p>
      </body>
    </html>
  `);
});
