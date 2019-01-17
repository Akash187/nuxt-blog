export default function (context){
  console.log("[Middleware] checkAuth File is running");
  context.store.dispatch("initAuth", context.req);
}
