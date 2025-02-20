/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from "@adonisjs/core/services/router";

//Import Routers
import authRouter from "../routes/auth.js";
import userRouter from "../routes/user.js";
import imageGenerationTaskRouter from "../routes/image_generation_task.js";

router
	.group(() => {
		authRouter();
		userRouter();
		imageGenerationTaskRouter();
	})
	.prefix("/api");
