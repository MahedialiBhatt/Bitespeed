import contactRepository from "../repository/contact.repository";

const ContactService = {
  async identify(email: string, phoneNumber: string) {
    let primaryContactDataByEmail,
      primaryContactDataByPhone,
      secondaryContactDataByEmail,
      secondaryContactDataByPhone;
    if (email) {
      primaryContactDataByEmail =
        await contactRepository.getPrimaryContactByEmail(email);
      secondaryContactDataByEmail =
        await contactRepository.getSecondaryContactByEmail(email);
    }

    if (phoneNumber) {
      primaryContactDataByPhone =
        await contactRepository.getPrimaryContactByPhone(phoneNumber);
      secondaryContactDataByPhone =
        await contactRepository.getSecondaryContactByPhone(phoneNumber);
    }

    // Primary to Secondary
    if (
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
    } else if (
      !primaryContactDataByEmail &&
      !primaryContactDataByPhone &&
      !secondaryContactDataByEmail &&
      !secondaryContactDataByPhone
    ) {
      const newPrimaryContact = await contactRepository.createNewPrimaryContact(
        phoneNumber,
        email
      );
      console.log("New primary contact created with id =", newPrimaryContact);
    } else if (
      (primaryContactDataByEmail &&
        ((!primaryContactDataByEmail.email && email) ||
          (!primaryContactDataByEmail.phoneNumber && phoneNumber))) ||
      (primaryContactDataByPhone &&
        ((!primaryContactDataByPhone.email && email) ||
          (!primaryContactDataByPhone.phoneNumber && phoneNumber)))
    ) {
      const newSecondaryContact =
        await contactRepository.createNewSecondaryContact(
          primaryContactDataByEmail
            ? primaryContactDataByEmail.id
            : primaryContactDataByPhone.id,
          phoneNumber,
          email
        );
      console.log(
        "New secondary contact created with id =",
        newSecondaryContact
      );
    } else if (
      (secondaryContactDataByEmail &&
        ((!secondaryContactDataByEmail.email && email) ||
          (!secondaryContactDataByEmail.phoneNumber && phoneNumber))) ||
      (secondaryContactDataByPhone &&
        ((!secondaryContactDataByPhone.email && email) ||
          (!secondaryContactDataByPhone.phoneNumber && phoneNumber)))
    ) {
      let id = secondaryContactDataByEmail
        ? secondaryContactDataByEmail.linkedId
        : secondaryContactDataByPhone.linkedId;

      if (secondaryContactDataByEmail && secondaryContactDataByPhone) {
        id =
          secondaryContactDataByEmail.createdAt >
          secondaryContactDataByPhone.createdAt
            ? secondaryContactDataByPhone.linkedId
            : secondaryContactDataByEmail.linkedId;
      }
      const newSecondaryContact =
        await contactRepository.createNewSecondaryContact(
          id,
          phoneNumber,
          email
        );
      console.log(
        "New secondary contact created with id =",
        newSecondaryContact
      );
    }

    const data = await contactRepository.getContactByEmailOrPhone(
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
      if (contact.linkPrecedence == "PRIMARY")
        contactRes.primaryContactId = contact.id;

      if (contact.email && !contactRes.emails.includes(contact.email))
        contactRes.emails.push(contact.email);
      if (
        contact.phoneNumber &&
        !contactRes.phoneNumbers.includes(contact.phoneNumber)
      )
        contactRes.phoneNumbers.push(contact.phoneNumber);
      if (contact.linkPrecedence == "SECONDARY")
        contactRes.secondaryContactIds.push(contact.id);
    });

    return contactRes;
  },
};

export default ContactService;
