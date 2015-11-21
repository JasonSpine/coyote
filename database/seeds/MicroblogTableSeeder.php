<?php

use Illuminate\Database\Seeder;

class MicroblogTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('acl_permissions')->insert([
            'name'           => 'microblog-update',
            'description'    => 'Edycja wpisów mikrobloga',
            'default'        => false
        ]);

        \DB::table('acl_permissions')->insert([
            'name'           => 'microblog-delete',
            'description'    => 'Usuwanie wpisów mikrobloga',
            'default'        => false
        ]);

        $user = DB::table('users')->orderBy('id')->first();

        \Coyote\Microblog::create([
            'user_id'           => $user->id,
            'text'              => 'Lorem ipsum lores'
        ]);
    }
}
