<?php

namespace App\Services;

use App\Models\Contract;
use Illuminate\Support\Facades\DB;

class ContractDuplicationService
{
    /**
     * Duplicate a contract along with its related resources, zones, points, elements, and workers.
     *
     * @param int $id The ID of the contract to duplicate.
     * @return Contract The newly duplicated contract instance.
     */
    public function duplicate(int $id): Contract
    {
        return DB::transaction(function () use ($id) {
            $original = Contract::with(['resources', 'zones.points.elements', 'workers'])->findOrFail($id);

            $newContract = $original->replicate();
            $newContract->name = request()->input('name', $original->name);
            $newContract->start_date = request()->input('start_date', $original->start_date);
            $newContract->end_date = request()->input('end_date', $original->end_date);
            $newContract->save();

            foreach ($original->resources as $resource) {
                $newContract->resources()->create($resource->replicate()->toArray());
            }

            foreach ($original->zones as $zone) {
                $newZone = $zone->replicate();
                $newZone->contract_id = $newContract->id;
                $newZone->save();

                foreach ($zone->points as $point) {
                    $newPoint = $point->replicate();
                    $newPoint->zone_id = $newZone->id;
                    $newPoint->save();

                    foreach ($point->elements as $element) {
                        $newElement = $element->replicate();
                        $newElement->point_id = $newPoint->id;
                        $newElement->save();
                    }
                }
            }

            $newContract->workers()->attach($original->workers->pluck('id'));

            return $newContract;
        });
    }
}
