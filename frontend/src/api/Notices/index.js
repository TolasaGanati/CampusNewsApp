import axios from "axios";

//getAllNews
export const getAllNotices = async (values) => {
  const url = "http://10.194.65.24:3000/notices";

  const response = await axios.get(url, values);

  return response.data;
};
