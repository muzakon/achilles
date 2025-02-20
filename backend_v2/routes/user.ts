const UsersController = () => import("#controllers/users_controller");
import router from "@adonisjs/core/services/router";

export default function userRouter() {
	return router
		.group(() => {
			router.post("/all", [UsersController, "all"]);
		})
		.prefix("/users");
}
