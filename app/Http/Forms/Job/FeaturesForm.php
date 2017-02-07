<?php

namespace Coyote\Http\Forms\Job;

use Coyote\Services\FormBuilder\Form;

class FeaturesForm extends Form
{
    public function buildForm()
    {
        $this
            ->add('name', 'text', [
                'rules' => 'string'
            ])
            ->add('is_checked', 'checkbox', [
                'rules' => 'bool'
            ]);
    }
}
