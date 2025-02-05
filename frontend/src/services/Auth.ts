import type { Login } from "@/interfaces/Auth";
import type { Ref } from "vue";

import Api from "./Api";

export class AuthService extends Api {
    LOGIN_URL = "/user/login";
    REGISTER_URL = "/user/register";

    async login(data: Login, loadingInstance: Ref<boolean> | null = null) {
        const response = await this.generateRequest(
            "POST",
            this.LOGIN_URL,
            null,
            data,
            loadingInstance
        )

        if(response) {
            console.log(response)
        }
    }
}