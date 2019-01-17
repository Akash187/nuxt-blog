export default function (context){
  console.log("[Middleware] auth.js is running");
  if(context.store.getters.isAuthenticated){
    context.redirect('/admin/auth');
  }else{
    console.log("Authentication confirmed.");
  }
}
