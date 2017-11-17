<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/11/17
 * Time: 15:44
 */

namespace Api\Model;
use Think\Model;

class GroupFileModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_files';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }
}