<?php

namespace Coyote\Services\Parser\Factories;

use Coyote\Repositories\Contracts\PageRepositoryInterface;
use Coyote\Repositories\Contracts\UserRepositoryInterface;
use Coyote\Repositories\Contracts\WordRepositoryInterface;
use Coyote\Services\Parser\Container;
use Coyote\Services\Parser\Parsers\Censore;
use Coyote\Services\Parser\Parsers\Geshi;
use Coyote\Services\Parser\Parsers\Link;
use Coyote\Services\Parser\Parsers\Markdown;
use Coyote\Services\Parser\Parsers\Purifier;

class WikiFactory extends AbstractFactory
{
    /**
     * Parse post
     *
     * @param string $text
     * @return string
     */
    public function parse(string $text) : string
    {
        start_measure('parsing', 'Parsing wiki...');

        $isInCache = $this->isInCache($text);
        if ($isInCache) {
            $text = $this->getFromCache($text);
        } else {
            $parser = new Container();

            $text = $this->cache($text, function () use ($parser) {
                $allowedTags = config('purifier')['HTML.Allowed'] . ',div[class]';

                $parser->attach((new Markdown($this->app[UserRepositoryInterface::class]))->setBreaksEnabled(true));
                $parser->attach((new Purifier())->set('HTML.Allowed', $allowedTags));
                $parser->attach(new Link($this->app[PageRepositoryInterface::class], $this->request->getHost()));
                $parser->attach(new Geshi());

                return $parser;
            });
        }
        stop_measure('parsing');

        return $text;
    }
}
