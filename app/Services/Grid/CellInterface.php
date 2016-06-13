<?php

namespace Coyote\Services\Grid;

interface CellInterface
{
    /**
     * @return Column
     */
    public function getColumn();
    
    /**
     * @return mixed
     */
    public function getValue();
}