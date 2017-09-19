<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/13
 * Time: 14:59
 */

namespace Api\Model;
use Think\Model;

class GroupNoticeModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_notice';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }
    /*
     * 添加群公告
     * @param title 公告标题
    * @param content 公告内容
    * @param portrait  公告图片
    * @param user_code 创建用户code
    * @param group_num 所属群num
     * */
    public function addGroupNotice($title,$content,$portrait,$user_code,$group_num){
        $data = array(
            'title' =>$title,
            'content' =>$content,
            'portrait' =>$portrait,
            'user_code' =>$user_code,
            'group_num' =>$group_num,
            'create_time' =>time()
        );
        $res = $this->add($data);
        if(!$res){
            return false;
        }
        return true;
    }

    /*
     * 获取群公告
     * @param group_num 所属群num
     * */
    public function getGroupNotice($group_num){
        $data=$this->field('id,title,content,portrait,create_time')->where(['group_num'=>$group_num])->order('create_time desc ')->select();
        if(!$data) return false;
        return $data;
    }
    /*
     * 删除群公告
     * @param group_num 所属群num
     * @param id 公告id
     * */
    public  function delGroupNotice($group_num,$id){
        $data=$this->where(['group_num'=>$group_num,'id'=>$id])->delete();
        if(!$data) return false;
        return true;
    }

}