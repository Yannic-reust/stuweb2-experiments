import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/Home.vue";
import GameView from "./views/Game.vue";
import JoinView from "./views/Join.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    { path: "/:game", component: GameView },
    { path: "/join/:id", component: JoinView },
  ],
});

export default router;
