<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        if (!Schema::hasColumn('contact_messages', 'reply_read')) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->boolean('reply_read')->default(false)->after('replied_at');
            });
        }
    }

    public function down()
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn('reply_read');
        });
    }
};
