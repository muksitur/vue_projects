import axios from "axios";

const baseURL = process.env.VUE_APP_PUBLIC;

const repo = axios.create({
  baseURL: "/public" //baseURL
});

export default {
    getFolderList(folder_path, type) {
        return repo.get(folder_path + "/").then(data => {
            const parser = new DOMParser();
            let htmlDoc = parser.parseFromString(data.data, 'text/html');
            console.log(htmlDoc);
            let allLinks = Array.from(htmlDoc.links);
            let t = type.toLowerCase();
            let links = allLinks.map(function(l,i){
                return l.href.split('/').pop();
            });
            links = links.filter(function(l) {
                return l.toLowerCase().endsWith(t);
            });
            return links;
        });
    }
}
