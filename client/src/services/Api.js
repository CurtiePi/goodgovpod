import axios from 'axios'

let devIps = ["http://localhost:8080", "http://127.0.0.1:8080", "http://192.168.1.4:8080"];
let baseurl = "http://127.0.0.1";

if (devIps.includes(window.location.origin)) {
    console.log("Use http://192.168.1.4:8890");
    baseurl = "http://192.168.1.4";
} else {
    console.log(`Using : ${window.location.origin}`);
    baseurl = `${window.location.origin}`;
}

export default () => {
  return { 
    insecure: axios.create({
        baseURL: `${baseurl}:8890`
    }),

    secure: axios.create({
        baseURL: `${baseurl}:8995`,
        withCredentials: true
    })
  }
}
