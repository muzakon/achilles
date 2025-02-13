import type { Ref } from "vue";

import Api from "./api";

export class ImageApi extends Api {
  protected prefix = "image";

  async fetchAllUserImages(loadingInstance: Ref<boolean> | null = null) {
    const response = await this.request(
      "GET",
      `${this.prefix}/all`,
      null,
      null,
      loadingInstance
    );

    return response;
  }
}
