<?php

namespace Coyote\Http\Forms\User;

use Coyote\Services\FormBuilder\Form;

class SkillsForm extends Form
{
    public function buildForm()
    {
        $this->setAttr(['id' => 'rate-form']);
        
        $this
            ->add('name', 'text', [
                'label' => 'Nazwa',
                'rules' => 'required|string|max:100|unique:user_skills,name,NULL,id,user_id,' . $this->data->id,
                'attr' => [
                    'placeholder' => 'Np. java, c#'
                ]
            ])
            ->add('rate', 'text', [
                'label' => 'Ocena',
                'rules' => 'required|integer|min:1|max:6'
            ])
            ->add('order', 'hidden');
    }

    /**
     * @return array
     */
    public function messages()
    {
        return [
            'name.required'     => 'Proszę wpisać nazwę umiejętności',
            'name.unique'       => 'Taka umiejętność znajduje się już na Twojej liście.',
            'rate.min'          => 'Nie wprowadziłeś oceny swojej umiejętności.'
        ];
    }
}
