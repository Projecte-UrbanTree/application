<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Observers\UserObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class User
 *
 * Represents a user in the application.
 */
#[ObservedBy([UserObserver::class])]
class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the work order users associated with the user.
     */
    public function workOrderUsers(): HasMany
    {
        return $this->hasMany(WorkOrderUser::class, 'user_id');
    }

    /**
     * Get the contracts associated with the user.
     */
    public function contracts(): BelongsToMany
    {
        return $this->belongsToMany(Contract::class, 'contract_user');
    }

    /**
     * Get the work orders associated with the user.
     */
    public function workOrders(): BelongsToMany
    {
        return $this->belongsToMany(WorkOrder::class, 'work_order_users', 'user_id', 'work_order_id')->withTimestamps();
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
