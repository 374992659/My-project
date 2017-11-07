<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/11/7
 * Time: 10:24
 */

namespace Api\Model;
use Think\Model;

class PointRecordModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'point_record';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }
}