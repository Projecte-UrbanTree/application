<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sensor_history', function (Blueprint $table) {
            $table->id(); 
            $table->float("device_eui")->nullable();
            $table->unsignedBigInteger('sensor_id'); 
            $table->float('temperature')->nullable();
            $table->integer('humidity')->nullable();
            $table->integer('inclination')->nullable();
            $table->timestamps(); 
            $table->softDeletes(); 

            
            $table->foreign('sensor_id')->references('id')->on('sensors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sensor_history');
    }
};