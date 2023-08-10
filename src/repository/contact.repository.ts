import mysql from "../config/mysql";
const ContactRepository = {
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

  async getSecondaryContactByEmail(email: string | null) {
    const query = `SELECT * FROM contact WHERE email = ? and linkPrecedence = 'SECONDARY' ORDER BY createdAt LIMIT 1`;

    const [rows] = await mysql.execute(query, [email]);

    return rows[0];
  },

  async getSecondaryContactByPhone(phoneNumber: string | null) {
    const query = `SELECT * FROM contact WHERE phoneNumber = ? and linkPrecedence = 'SECONDARY' ORDER BY createdAt LIMIT 1`;

    const [rows] = await mysql.execute(query, [phoneNumber]);

    return rows[0];
  },

  async getContactByEmailOrPhone(
    email: string | null,
    phoneNumber: string | null
  ) {
    const query = `    
    SELECT *
    FROM contact
    WHERE email = ? OR phoneNumber = ?
    OR (id IN (SELECT linkedId FROM contact WHERE email = ? OR phoneNumber = ?))
    ORDER BY linkPrecedence;`;

    const [rows] = await mysql.execute(query, [
      email ? email : null,
      phoneNumber ? phoneNumber : null,
      email ? email : null,
      phoneNumber ? phoneNumber : null,
    ]);

    return rows;
  },

  async getContactByEmailAndPhone(email: string, phoneNumber: string) {
    const query = `SELECT * FROM contact WHERE email = ? AND phoneNumber = ? ORDER BY createdAt LIMIT 1;`;

    const [rows] = await mysql.execute(query, [email, phoneNumber]);

    return !!rows[0];
  },

  async createNewPrimaryContact(phoneNumber?: string, email?: string) {
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
    phoneNumber?: string,
    email?: string
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

  async updateToSecondaryById(id: number, primaryId: number) {
    const query = `UPDATE contact SET linkPrecedence = "SECONDARY" , linkedId = ? WHERE id = ?`;

    const [rows] = await mysql.execute(query, [primaryId, id]);

    return rows[0];
  },
};

export default ContactRepository;
