<?php
/**
 * 群相册
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/13
 * Time: 16:25
 */

namespace Api\Model;
use Think\Model;

class GroupPictureModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_picture';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);

    }

    /*
     * 添加群相册
     * @param picture_path 文件路径
     *@param title 标题   可填
     *@param user_code   用户code
     * @param user_portrait 用户头像  可填
     * @param nickname 用户昵称  可填
     * @param group_num 群号码
     * */
    public function addGroupPic($picture_path,$user_code,$group_num,$user_portrait='',$nickname='',$title=''){
        if(!$picture_path || !$user_code || !$group_num)return false;
        $data=array(
            'picture_path' =>$picture_path,
            'title' =>$title,
            'user_code' =>$user_code,
            'user_portrait' =>$user_portrait,
            'create_time' =>time(),
            'nickname' =>$nickname,
            'group_num' =>$group_num,
        );
        $res= $this->add($data);
        if(!$res) return false;
        return true;
    }
    /*
     * 获取群相册
     * @param group_num 群号码
     * */
    public function getGroupPicture($group_num){
        if(!$group_num)return 21;
        $data=$this->field('id,picture_path,user_code,create_time')->where(['group_num'=>$group_num])->select();
        if(!$data) return 5;
        return $data;
    }
    /*
     * 删除群相册
     * @param group_num 群号码
     * @param id 相册id
     * */
    public function delGroupPic($group_num,$id){
        $data=$this->field('id,picture_path,user_code,create_time')->where(['group_num'=>$group_num,'id'=>$id])->getField('picture_path');
        if(!$data)return false;
        $pic_arr=unserialize($data);
        foreach ($pic_arr as $k=>$v){
            @unlink($v);
        }
        $res = $this->where(['id'=>$id])->delete();
        if(!$res)return false;
        return true;
    }


}