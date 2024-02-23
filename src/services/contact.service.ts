import contactRepository from "../repository/contact.repository";

const ContactService = {
  async identify(email?: string | undefined, phoneNumber?: string | undefined) {
    const contacts = await contactRepository.getContactsByEmailOrPhone(
      email,
      phoneNumber
    );

    const primaryContactDataByEmail = email
      ? await contactRepository.getPrimaryContactByEmail(email)
      : null;
    const primaryContactDataByPhone = phoneNumber
      ? await contactRepository.getPrimaryContactByPhone(phoneNumber)
      : null;

    // New primary contact will be created
    if (contacts.length == 0) {
      await contactRepository.createNewPrimaryContact(email, phoneNumber);
      console.log("Primary contact created.");
    }
    // Contact will be updated to secondary
    else if (
      primaryContactDataByEmail &&
      primaryContactDataByPhone &&
      primaryContactDataByEmail.id != primaryContactDataByPhone.id
    ) {
      if (
        primaryContactDataByEmail.createdAt >
        primaryContactDataByPhone.createdAt
      ) {
        await contactRepository.updateToSecondaryById(
          primaryContactDataByEmail.id,
          primaryContactDataByPhone.id
        );
      } else {
        await contactRepository.updateToSecondaryById(
          primaryContactDataByPhone.id,
          primaryContactDataByEmail.id
        );
      }
      console.log("Contact updated to Secondary contact");
    }
    // Secondary contact will be created if there's new information
    else if (email && phoneNumber) {
      const primaryContactId = contacts[0].id;

      const isSameContactExist = await contactRepository.isSameContactExist(
        email,
        phoneNumber
      );

      if (!isSameContactExist) {
        await contactRepository.createNewSecondaryContact(
          primaryContactId,
          email,
          phoneNumber
        );

        console.log("Secondary contact created");
      }
    }

    const data = await contactRepository.getContactsByEmailOrPhone(
      email,
      phoneNumber
    );

    return ContactService._prepareContactsData(data);
  },

  _prepareContactsData(contacts) {
    const contactRes = {
      primaryContactId: null,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    };

    contacts.forEach((contact) => {
      if (contact.linkPrecedence == "PRIMARY") {
        contactRes.primaryContactId = contact.id;

        if (contact.email) contactRes.emails.push(contact.email);
        if (contact.phoneNumber)
          contactRes.phoneNumbers.push(contact.phoneNumber);
      } else {
        if (contact.email && !contactRes.emails.includes(contact.email))
          contactRes.emails.push(contact.email);
        if (
          contact.phoneNumber &&
          !contactRes.phoneNumbers.includes(contact.phoneNumber)
        )
          contactRes.phoneNumbers.push(contact.phoneNumber);

        if (!contactRes.secondaryContactIds.includes(contact.id))
          contactRes.secondaryContactIds.push(contact.id);
      }
    });

    return contactRes;
  },
};

export default ContactService;
