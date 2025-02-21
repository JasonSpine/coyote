<?php
namespace Coyote\Http\Controllers\Adm;

use Carbon\Carbon;
use Coyote\Domain\Administrator\AvatarCdn;
use Coyote\Domain\Administrator\UserMaterial\List\Store\MaterialRequest;
use Coyote\Domain\Administrator\UserMaterial\List\Store\MaterialStore;
use Coyote\Domain\Administrator\UserMaterial\List\View\MarkdownRender;
use Coyote\Domain\Administrator\UserMaterial\List\View\MaterialList;
use Coyote\Domain\Administrator\UserMaterial\List\View\Time;
use Coyote\Domain\View\Filter\Filter;
use Coyote\Domain\View\Pagination\BootstrapPagination;
use Illuminate\View\View;

class FlagController extends BaseController
{
    public function index(MaterialStore $store, MarkdownRender $render): View
    {
        $this->breadcrumb->push('Dodane treści', route('adm.flag'));
        $paramFilterString = $this->queryOrNull('filter');
        $filterParams = new Filter($paramFilterString ?? '')->toArray();
        $request = new MaterialRequest(
            \max(1, (int)$this->request->query('page', 1)),
            20,
            $filterParams['type'] ?? 'post',
            $filterParams['deleted'] ?? null,
            $filterParams['reported'] ?? null,
            $filterParams['author'] ?? null,
            $filterParams['open'] ?? null,
        );

        $materials = new MaterialList(
            $render,
            new Time(Carbon::now()),
            $store->fetch($request),
            new AvatarCdn());

        return $this->view('adm.flag.home', [
            'materials'        => $materials,
            'pagination'       => new BootstrapPagination($request->page, $request->pageSize, $materials->total(), ['filter' => $paramFilterString]),
            'filter'           => $paramFilterString,
            'availableFilters' => [
                'type:post', 'type:comment', 'type:microblog',
                'is:deleted', 'not:deleted',
                'is:reported', 'not:reported', 'is:open', 'not:open',
                'author:{id}',
            ],
        ]);
    }

    private function queryOrNull(string $key): ?string
    {
        if ($this->request->query->has($key)) {
            return $this->request->query->get($key, '');
        }
        return null;
    }
}
