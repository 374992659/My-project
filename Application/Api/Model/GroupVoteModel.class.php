<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/15
 * Time: 17:21
 */

namespace Api\Model;
use Think\Model;

class GroupVoteModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_vote';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
        $this->account_code = $account_code;
    }

    /*
     * 发布群投票
     * @param data 投票数据
     * */
    public function addGroupVote($data){
        $res = $this->add($data);
        if(!$res){
            return false;
        }
        return true;
    }

}