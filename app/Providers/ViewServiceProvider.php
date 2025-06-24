<?php
namespace Coyote\Providers;

use Coyote\Domain\Clock;
use Coyote\Domain\Icon\Icons;
use Coyote\Domain\Settings\UserTheme;
use Coyote\Domain\User\UserSettings;
use Coyote\Http\Composers\InitialStateComposer;
use Coyote\User;
use Coyote\View\NavigationMenuPresenter;
use Coyote\View\NavigationMenuService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\Factory;
use Lavary\Menu\Builder;
use Lavary\Menu\Menu;

class ViewServiceProvider extends ServiceProvider {
    public function boot(): void {
        /** @var Clock $clock */
        $clock = app(Clock::class);
        /** @var Factory $view */
        $view = $this->app['view'];
        $view->composer(['layout', 'adm.home'], InitialStateComposer::class);
        $view->composer(['layout', 'adm.home'], fn(View $view) => $view->with([
            'darkTheme' => $this->userTheme()->isThemeDark(),
        ]));
        $view->composer('layout', function (View $view) use ($clock) {
            $theme = $this->userTheme();
            $view->with([
                '__master_menu'  => $this->buildMasterMenu(),
                '__dark_theme'   => $theme->isThemeDark(),
                '__color_scheme' => $theme->themeMode(),
                'gdpr'           => [
                    'content'  => (new UserSettings)->cookieAgreement(),
                    'accepted' => $this->gdprAccepted(),
                ],
                'year'           => $clock->year(),
                'currentUser'    => $this->currentUser(),
                'icons'          => (new Icons)->icons(),
                'navigationMenu' => $this->navigationMenu(),
            ]);
        });
    }

    private function gdprAccepted(): bool {
        /** @var Request $request */
        $request = $this->app['request'];
        $user = $request->user();
        if ($user) {
            /** @var User $user */
            return (bool)$user->gdpr;
        }
        return false;
    }

    private function buildMasterMenu(): Builder {
        /** @var Menu $menu */
        $menu = app(Menu::class);
        /** @var Builder $builder */
        $builder = $menu->make('__master_menu___', function (Builder $menu) {
            foreach (config('laravel-menu.__master_menu___') as $title => $data) {
                $children = array_pull($data, 'children');
                $item = $menu->add($title, $data);
                foreach ((array)$children as $key => $child) {
                    $item->add($key, $child);
                }
            }
        });
        return $builder;
    }

    private function currentUser(): ?array {
        if (auth()->guest()) {
            return null;
        }
        /** @var User $user */
        $user = auth()->user();
        return [
            'photo' => $user->photo,
            'name'  => $user->name,
        ];
    }

    private function userTheme(): UserTheme {
        /** @var UserTheme $theme */
        $theme = $this->app[UserTheme::class];
        return $theme;
    }

    private function navigationMenu(): array {
        /** @var NavigationMenuPresenter $presenter */
        $presenter = app(NavigationMenuPresenter::class);
        /** @var NavigationMenuService $service */
        $service = app(NavigationMenuService::class);
        return $presenter->navigationMenu($service->navigationMenu());
    }
}
