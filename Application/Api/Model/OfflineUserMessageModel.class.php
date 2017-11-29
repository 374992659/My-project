<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/11/29
 * Time: 9:24
 */

namespace Api\Model;
use Think\Model;

class OfflineUserMessageModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'offline_user_message';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }
}