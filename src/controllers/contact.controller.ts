import { Request, Response } from "express";
import { invoker, writeResponse } from "../utils/utility";
import contactService from "../services/contact.service";

const ContactController = {
  async identify(req: Request, res: Response) {
    const { email, phoneNumber } = req.body;

    console.log("Request =>", "email =", email, "---", "phone =", phoneNumber);

    if (!email && !phoneNumber) {
      return writeResponse({ code: 400, message: "Bad Request" }, null, res);
    }

    if (email && email.length > 25) {
      return writeResponse(
        { code: 400, message: "Email length can't be greater than 25" },
        null,
        res
      );
    }

    if (phoneNumber && phoneNumber.length > 16) {
      return writeResponse(
        { code: 400, message: "Phone number length can't be greater than 16" },
        null,
        res
      );
    }

    const [contacts, err0] = await invoker(
      contactService.identify(email, phoneNumber)
    );

    if (err0) {
      console.log(err0);
      return writeResponse(
        {
          code: 500,
          message: "Something went wrong while fetching contact.",
        },
        null,
        res
      );
    }

    return writeResponse(null, contacts, res);
  },
};

export default ContactController;
