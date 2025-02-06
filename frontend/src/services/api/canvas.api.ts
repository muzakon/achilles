import type { Ref } from "vue";
import Api from "./api";
import type { GenerateImage } from "@/interfaces/canvas.api";

export class CanvasApi extends Api {
    async generateImage(data: GenerateImage, loadingInstance: Ref<boolean> | null = null) {
        const response = this.request("POST", "image/generate", null, data, loadingInstance)
        return response
    }
}