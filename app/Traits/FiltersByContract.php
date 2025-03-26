<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait FiltersByContract
{
    public function scopeFilterByContract(Builder $query): void
    {
        $contractId = session('selected_contract_id', 0);

        if ($contractId > 0) {
            $query->where('contract_id', $contractId);
        }
    }
}
