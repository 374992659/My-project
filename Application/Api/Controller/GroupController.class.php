<?php
/**
 * 用户群
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/8
 * Time: 18:19
 */

namespace Api\Controller;
use Api\Model;
class GroupController extends VersionController
{
    /*
     * 获取群分类列表
     * */
    protected function getGroupType_v1_0_0(){
        $data = M('baseinfo.group_type')->where(['status' =>1])->select();
        if(!$data){
            $this->echoEncrypData(1,'暂无数据');
        }else{
            $this->echoEncrypData(0,'',$data);
        }
    }
     /*
      * 创建群
      * @param group_name 群名称
      * @param group_portrait 群头像
      * @param group_type  群分类id
      * */
    protected function addGroup_v1_0_0(){
        $group_name = $this->pdata['group_name'] ;
        $group_portrait = $this->pdata['group_portrait'] ;
        $group_type = $this->pdata['group_type'] ;
        if(!$group_name || !$group_portrait || !$group_type) $this->echoEncrypData(21);
        $group_num = $this->createGroupCode();
        if(!$group_num) $this->echoEncrypData(1,'群创建失败，请重试');
        $table_id=substr($this->account_code,0,4);
        $group_code=$table_id.$group_num;
       $data=array(
            'group_num'=>$group_num,
            'group_code'=>$group_code,
            'table_id'=>$table_id,
            'user_code'=>$this->account_code
       );
       $count = M('baseinfo.group_area')->where(['user_code'=>$this->account_code])->count();
       if(intval($count) >= 5){
           $this->echoEncrypData(305);
       }
        $res1 = M('baseinfo.group_area')->add($data);
        $mode = new Model\UserGroupModel($this->account_code);
        $res2 =$mode->addGroup($group_name,$group_portrait,$group_code,$group_num,1,$group_type);   //role角色id
        $data = M('baseinfo.user_info_'.$table_id)->field(['nickname,portrait'])->where(['sccount_code'=>$this->account_code])->find();
        $user_code = $this->account_code;
        $nickname = $data['nickname'];
        $portrait = $data['portrait'];
        $model = new Model\GroupUserModel($this->account_code);
        $res3 = $model->addUser($group_code,$group_num,$group_name,$group_portrait,$user_code,$nickname,$portrait,1);
        if($res1 && $res2 && $res3)$this->echoEncrypData(0);
        $this->echoEncrypData(1);
    }
    /*
   * 上传群头像
   *
   * */
    protected function uploadGroupP_v1_0_0(){
        $model = new \UploadFile();
        $save_path= __APP__.'/';
        $model->upload($save_path);
    }

    /*
     * 生成群号码
     * */
    public function createGroupCode(){
        for($i=0;$i<=6;$i++){//最多可向后扩展6为数字
            for($j=0;$j<=10 ;$j++){ //连续创建五次失败就扩展1位数
                $code =mt_rand(1,9);//总共生成6位随机字串
                for($k=1;$k <=(5+$i) ;$k++){
                    $code .=mt_rand(0,9);
                }
                $res = M('baseinfo.group_area')->where(['group_num'=>$code])->find();
                if(!$res){
                    return $code;
                }
            }

        }
        return false;
    }


}