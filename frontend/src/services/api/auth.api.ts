import type { Login } from "@/interfaces/Auth";
import type { Ref } from "vue";

import Api from "./api";

export class AuthApi extends Api {
    LOGIN_URL = "/user/login";
    REGISTER_URL = "/user/register";

    async login(data: Login, loadingInstance: Ref<boolean> | null = null) {
        const response = await this.request(
            "POST",
            this.LOGIN_URL,
            null,
            data,
            loadingInstance
        )

        return response
    }
}