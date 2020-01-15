export default {
  // get list of file names from a specific folder on the server
  async getList(folder) {
    try {
      // get index as html string
      const response = await fetch(
        "https:"+process.env.VUE_APP_PUBLIC+"/"+folder
      );
      const data = await response.text();
      // convert html into list of file names
      return this.parseDirectoryListing(data);
    } catch (error) {
      alert("error");
      console.error(error);
    }
  },
  // convert html string into list of file names
  parseDirectoryListing(html) {
    const parser = new DOMParser();
    // get document from string
    const doc = parser.parseFromString(html, "text/html");
    // get all entries from links node
    const entries = Array.from(doc.links);
    // filter all sub or parent folders (ending with /)
    return entries.map(e => e.innerHTML).filter(e => !e.endsWith("/"));
  }
};
