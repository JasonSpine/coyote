import {App, Component} from "vue";
import {createRouter, createWebHashHistory, RouteLocationNormalized, Router as VueRouter} from "vue-router";
import {Screen} from "../ui";
import {ScreenListener, ScreenProperties} from "./Screens";

export class Router {
  private readonly router: VueRouter = createRouter({
    history: createWebHashHistory(),
    routes: [],
  });

  constructor(private listener: ScreenListener) {}

  before(before: (screen: Screen) => Screen|null) {
    this.router.beforeEach((route: RouteLocationNormalized) => {
      const redirectTo = before(route.name as Screen);
      if (redirectTo !== null) {
        return {name: redirectTo};
      }
    });
  }

  useIn(app: App): void {
    app.use(this.router);
  }

  addDefaultScreen(screen: Screen): void {
    this.router.addRoute({path: '/', redirect: {name: screen}});
  }

  addScreen(component: Component, screen: Screen, vueRouterRoute: string): void {
    this.router.addRoute({
      component,
      name: screen,
      path: vueRouterRoute,
      props: (route: RouteLocationNormalized): ScreenProperties => {
        return this.listener(this.jobOfferId(route));
      },
    });
  }

  navigate(screen: Screen, routeArguments: {id: number|null, slug?: string}): void {
    this.router.push({
      name: screen,
      params: routeArguments,
    });
  }

  private jobOfferId(route: RouteLocationNormalized): number|null {
    if (route.params.id) {
      return Number(route.params.id);
    }
    return null;
  }
}
