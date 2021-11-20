import axios from "axios";

import { getToken } from "../authentication/authentication";
import config from "../config.json";



export default function getAllServices(setItems) {
    const token = getToken();
    if (!token) {
      return;
    }
    axios.get(config.API_URL+"/services",
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).then(response => {
      console.log(response.data);

      for (const service of response.data) {
        console.log(service);
        setItems(services => ({
          ...services,
          [service.id]: {
            id: service.id,
            name: service.name,
            url: service.url,
            fullName: service.full_name,
            description: service.description,
            resultType: service.result_type,
          }
        }));
      }
    }).catch(error => {
      if (error.response.status === 401) {
        // setError(error.response.data.message);
      } else {
        // setError("Something went wrong. Please try again later.");
      }
    });
  }