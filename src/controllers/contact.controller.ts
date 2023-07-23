import { Request, Response } from "express";
import { invoker, writeResponse } from "../utils/utility";
import contactService from "../services/contact.service";

const ContactController = {
  async identify(req: Request, res: Response) {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return writeResponse({ code: 400, message: "Bad Request" }, null, res);
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
