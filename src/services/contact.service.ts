import contactRepository from "../repository/contact.repository";

const ContactService = {
  async identify(email: string, phoneNumber: string) {
    let primaryContactDataByEmail,
      primaryContactDataByPhone,
      secondaryContactDataByEmail,
      secondaryContactDataByPhone;

    let contactByEmailAndPhone;

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

    if (email && phoneNumber)
      contactByEmailAndPhone =
        await contactRepository.getContactByEmailAndPhone(email, phoneNumber);

    // Create New contact if primary contact not exist
    if (
      email &&
      phoneNumber &&
      !contactByEmailAndPhone &&
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
    }
    // Two distinct contact found with email and phone
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
    // Secondary contact if email matching and new phoneNumber
    else if (
      phoneNumber &&
      !contactByEmailAndPhone &&
      (primaryContactDataByEmail || secondaryContactDataByEmail) &&
      ((primaryContactDataByEmail &&
        primaryContactDataByEmail.phoneNumber != phoneNumber) ||
        (secondaryContactDataByEmail &&
          secondaryContactDataByEmail.phoneNumber != phoneNumber))
    ) {
      const newSecondaryContact =
        await contactRepository.createNewSecondaryContact(
          primaryContactDataByEmail
            ? primaryContactDataByEmail.id
            : secondaryContactDataByEmail.linkedId,
          phoneNumber,
          email
        );
      console.log(
        "New secondary contact created with id =",
        newSecondaryContact
      );
    } else if (
      email &&
      !contactByEmailAndPhone &&
      (primaryContactDataByPhone || secondaryContactDataByPhone) &&
      ((primaryContactDataByPhone &&
        primaryContactDataByPhone.email != email) ||
        (secondaryContactDataByPhone &&
          secondaryContactDataByPhone.email != email))
    ) {
      const newSecondaryContact =
        await contactRepository.createNewSecondaryContact(
          primaryContactDataByPhone
            ? primaryContactDataByPhone.id
            : secondaryContactDataByPhone.linkedId,
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
