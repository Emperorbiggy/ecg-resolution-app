<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Merchant;
use Illuminate\Http\Request;

class MerchantController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        Merchant::updateOrCreate(
            ['email' => $request->email],
            ['name'  => $request->name]
        );

        return redirect()->back()->with('merchant_saved', true);
    }
}
