import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/Home.vue";
import GameView from "./views/Game.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    { path: "/:game", component: GameView },
  ],
});

export default router;
