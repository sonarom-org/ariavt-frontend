import {getToken} from "../Utils/authentication";
import axios from "axios";
import config from "../config.json";

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    const token = getToken();
    if (!token) {
      return;
    }

    formData.append("file", file);
    try {
      return axios.post(config.API_URL + `/images/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });
    } catch (e) {
      // -
    }
  }

  getFiles() {

    const token = getToken();
    if (!token) {
      return;
    }

    try {
      return axios.get(
        config.API_URL + `/images/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (e) {
      // Nothing
    }
  }

}

export default new UploadFilesService();