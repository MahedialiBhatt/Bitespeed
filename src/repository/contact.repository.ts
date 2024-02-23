import mysql from "../config/mysql";
const ContactRepository = {
  async createNewPrimaryContact(email?: string, phoneNumber?: string) {
    const query = `INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence) VALUES (?,?,?,?)`;

    const [rows] = await mysql.execute(query, [
      phoneNumber ? phoneNumber : null,
      email ? email : null,
      null,
      "PRIMARY",
    ]);

    return rows["insertId"];
  },

  async createNewSecondaryContact(
    primaryId: number,
    email?: string,
    phoneNumber?: string
  ) {
    const query = `INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence) VALUES (?,?,?,?)`;

    const [rows] = await mysql.execute(query, [
      phoneNumber,
      email,
      primaryId,
      "SECONDARY",
    ]);

    return rows["insertId"];
  },

  async getContactsByEmailOrPhone(
    email?: string,
    phoneNumber?: string
  ): Promise<any> {
    let subQuery = "";
    if (email) subQuery += `email = '${email}'`;

    if (phoneNumber) {
      if (email) subQuery += " OR ";
      subQuery += `phoneNumber = '${phoneNumber}'`;
    }

    let query = `SELECT * FROM contact WHERE ${subQuery} OR linkedId IN (SELECT linkedId FROM contact WHERE ${subQuery}) OR id IN (SELECT linkedId FROM contact WHERE ${subQuery})`;

    query += " ORDER BY createdAt";

    const [rows] = await mysql.query(query, []);

    return rows;
  },

  async isSameContactExist(email: string, phoneNumber: string) {
    const query = `SELECT * FROM contact WHERE email = ? AND phoneNumber = ?`;

    const [rows] = await mysql.execute(query, [email, phoneNumber]);

    const tempResult: any = rows;

    return tempResult.length > 0;
  },

  async updateToSecondaryById(id: number, primaryId: number) {
    const query = `UPDATE contact SET linkPrecedence = "SECONDARY" , linkedId = ? WHERE id = ?`;

    const [rows] = await mysql.execute(query, [primaryId, id]);

    return rows[0];
  },

  async getPrimaryContactByEmail(email: string | null) {
    const query = `SELECT * FROM contact WHERE email = ? and linkPrecedence = 'PRIMARY'`;

    const [rows] = await mysql.execute(query, [email]);

    return rows[0];
  },

  async getPrimaryContactByPhone(phoneNumber: string | null) {
    const query = `SELECT * FROM contact WHERE phoneNumber = ? and linkPrecedence = 'PRIMARY'`;

    const [rows] = await mysql.execute(query, [phoneNumber]);

    return rows[0];
  },
};

export default ContactRepository;
