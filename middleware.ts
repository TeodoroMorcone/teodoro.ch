import {intlMiddleware} from "@/lib/i18n/request";

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

export default intlMiddleware;