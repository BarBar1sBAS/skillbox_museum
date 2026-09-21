import { Final } from "./pages/Final/Final.tsx";
import { Landing } from "./pages/Landing/Landing.tsx";
import { Result } from "./pages/Result/Result.tsx";
import { Rules } from "./pages/Rules/Rules.tsx";
import { Scene } from "./pages/Scene/Scene.tsx";
import { Start } from "./pages/Start/Start.tsx";

export const routes = [
	{ path: "/", Component: Landing },
	{ path: "/start", Component: Start },
	{ path: "/rules", Component: Rules },
	{ path: "/scene/:n", Component: Scene },
	{ path: "/result", Component: Result },
	{ path: "/final", Component: Final },
];
