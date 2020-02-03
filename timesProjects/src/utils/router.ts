interface RoutesType {
  [key:string]: {
    url: string,
    name: string
  };
}
let routes:RoutesType = {
  "home": {
    url: "/",
    name: "home"
  },
  "list": {
    url: "/list",
    name: "list"
  },
  "create": {
    url: "/new",
    name: "new Project"
  }
};
export default routes
