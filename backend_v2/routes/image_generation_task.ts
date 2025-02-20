const ImageGenerationTaskController = () =>
	import("#controllers/image_generation_tasks_controller");

import { middleware } from "#start/kernel";
import router from "@adonisjs/core/services/router";

export default function authRouter() {
	return router
		.group(() => {
			router.get("/all", [ImageGenerationTaskController, "all"]);
			router.get("/status", [ImageGenerationTaskController, "status"]);
			router.post("/create", [ImageGenerationTaskController, "create"]);
		})
		.use(middleware.auth())
		.prefix("/image-generation-task");
}
