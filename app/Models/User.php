<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Observers\UserObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[ObservedBy([UserObserver::class])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'company',
        'dni',
        'role',
        'password',
        'selected_contract_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'selected_contract_id' => 'integer',
        ];
    }

    public function workOrders()
    {
        return $this->belongsToMany(WorkOrder::class, 'work_order_users');
    }

    public function contracts()
    {
        if ($this->role === 'admin') {
            return Contract::where('status', 0);
        }

        if ($this->role === 'customer') {
            return $this->belongsTo(Contract::class, 'selected_contract_id');
        }

        return $this->belongsToMany(Contract::class, 'contract_user')->where('status', 0);
    }
}
