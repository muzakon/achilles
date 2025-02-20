const AuthController = () => import("#controllers/auth_controller");
import router from "@adonisjs/core/services/router";

export default function authRouter() {
	return router
		.group(() => {
			router.post("/login", [AuthController, "login"]);
			router.post("/register", [AuthController, "register"]);
			router.post("/refresh", [AuthController, "refresh"]);
		})
		.prefix("/auth");
}
