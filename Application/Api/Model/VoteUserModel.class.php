<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/18
 * Time: 10:17
 */

namespace Api\Model;
use Think\Model;

class VoteUserModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'vote_user';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }

    /*
     *  用户投票
     * @param data 投票数组
     * */
    public function addVoteUser($data){
        $res = $this->add($data);
        if(!$res){
            return false;
        }
        return true;
    }

    /*
     * 获取某一投票参与人数
     * @param group_num 群号码
     * @param vote_id 投票id
     * */
    public function getVoteTotal($group_num,$vote_id){
        $res=$this->where(['group_num'=>$group_num,'vote_id'=>$vote_id])->count();
        if(!$res) return false;
        return $res;
    }
    /*
     * 获取某一投票详情
     * @param group_num 群号码
     * @param vote_id 投票id
     * */
    public function getVoteChoice($group_num,$vote_id){
        $res=$this->field('user_code,choised')->where(['group_num'=>$group_num,'vote_id'=>$vote_id])->select();
        if(!$res)return false;
        return $res;
    }

}