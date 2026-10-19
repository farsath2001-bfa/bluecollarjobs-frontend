// Each kind of account has its own home page
export const homeFor = (user) => (user?.role === "admin" ? "/admin" : user?.role === "employer" ? "/employer" : "/dashboard");
