import axios from "axios";

const AIRTABLE_BASE_URL = "https://api.airtable.com/v0";

const headers = {
  Authorization: `Bearer ${process.env.AIRTABLE_PERSONAL_TOKEN}`,
};

export const listBases = async () => {
  const res = await axios.get("https://api.airtable.com/v0/meta/bases", { headers });
  return res.data;
};

export const listTables = async (baseId) => {
  const res = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, { headers });
  return res.data;
};

export const createRecord = async (baseId, tableId, fields) => {
  const res = await axios.post(
    `${AIRTABLE_BASE_URL}/${baseId}/${tableId}`,
    { fields },
    { headers }
  );
  return res.data;
};
