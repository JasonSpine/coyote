<?php

namespace Coyote\Services\Grid;

class Action implements CellInterface
{
    /**
     * @var \Coyote\Services\Grid\RowActions\RowAction[]
     */
    protected $rowActions;

    /**
     * @var mixed
     */
    protected $data;

    /**
     * @var Column
     */
    protected $column;

    /**
     * @param Column $column
     * @param \Coyote\Services\Grid\RowActions\RowAction[]$rowActions
     * @param mixed $data
     */
    public function __construct(Column $column, $rowActions, $data)
    {
        $this->column = $column;
        $this->rowActions = $rowActions;
        $this->data = $data;
    }

    /**
     * @return Column
     */
    public function getColumn()
    {
        return $this->column;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        $html = '';

        foreach ($this->rowActions as $rowAction) {
            $html = $rowAction->render($this->data);
        }

        return $html;
    }
}