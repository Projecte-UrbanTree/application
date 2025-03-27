<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Sensor;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SensorHistory extends Model
{
    public int $sensor_id;

    public ?float $temperature;

    public ?int $humidity;

    public ?int $inclination;

    protected $fillable = ['sensor_id', 'temperature', 'humidity', 'inclination', 'phi_soil', 'temp_soil', 'created_at'];

    protected static function getTableName(): string
    {
        return 'sensor_history';
    }

    protected static function mapDataToModel($data): SensorHistory
    {
        $sensor_history = new self;
        $sensor_history->sensor_id = $data['sensor_id'];
        $sensor_history->device_eui = $data['device_eui'];
        $sensor_history->temperature = $data['temperature'];
        $sensor_history->humidity = $data['humidity'];
        $sensor_history->inclination = $data['inclination'];
        $sensor_history->created_at = $data['created_at'];
        $sensor_history->updated_at = $data['updated_at'];
        $sensor_history->deleted_at = $data['deleted_at'];

        return $sensor_history;
    }

    public function sensor(): BelongsTo
    {
        return $this->belongsTo(Sensor::class, 'sensor_id');
    }
}