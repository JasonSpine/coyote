<?php

namespace Coyote\Elasticsearch\Filters\Job;

use Coyote\Elasticsearch\DslInterface;
use Coyote\Elasticsearch\Filter;
use Coyote\Elasticsearch\QueryBuilderInterface;

class City extends Filter implements DslInterface
{
    /**
     * @var array
     */
    protected $cities = [];

    /**
     * City constructor.
     * @param $cities
     */
    public function __construct($cities)
    {
        $this->setCities($cities);
    }

    /**
     * @param $city
     */
    public function addCity($city)
    {
        $this->cities[] = $city;
    }

    /**
     * @param $cities
     */
    public function setCities($cities)
    {
        if (!is_array($cities)) {
            $cities = [$cities];
        }

        $this->cities = $cities;
    }

    /**
     * @param QueryBuilderInterface $queryBuilder
     * @return mixed
     */
    public function apply(QueryBuilderInterface $queryBuilder)
    {
        return $this->addFilter($queryBuilder, [
            'nested' => [
                'path' => 'locations',
                'query' => [
                    'filtered' => [
                        'query' => [
                            'match_all' => []
                        ],
                        'filter' => [
                            'terms' => [
                                'city_original' => array_map('mb_strtolower', $this->cities)
                            ]
                        ]
                    ]
                ]
            ]
        ]);
    }
}