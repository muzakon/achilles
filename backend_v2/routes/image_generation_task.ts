const ImageGenerationTaskController = () =>
	import("#controllers/image_generation_tasks_controller");

import { middleware } from "#start/kernel";
import router from "@adonisjs/core/services/router";

export default function authRouter() {
	return router
		.group(() => {
			router.post("/create", [ImageGenerationTaskController, "create"]);
			router.get("/status", [ImageGenerationTaskController, "status"]);
		})
		.use(middleware.auth())
		.prefix("/image-generation-task");
}
