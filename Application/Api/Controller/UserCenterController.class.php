<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/25
 * Time: 11:02
 */

namespace Api\Controller;
use Api\Model;

class UserCenterController extends VersionController
{
    /*
     * 修改个人资料
     * @param portrait 用户头像
     * @param nickname 用户昵称
     * @param realname 真实姓名 可填
     * @param phone 手机号 可填
     * @param wechat_num 微信号 可填
     * @param qq_num QQ账号 可填
     * @param default_garden 常驻小区 可填
     * @param birth_year 出生年份 可填
     * @param birth_month 出生月份 可填
     * @param hobby 爱好  字符串 用英文逗号间隔 可填
     * */
    protected function updateUserInfo_v1_0_0(){
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $portrait = $this->pdata['portrait'];
        $nickname = $this->pdata['nickname'];
        if(!$portrait || !$nickname)$this->echoEncrypData(21);
        $user_info = new \Api\Model\UserInfoModel($city_id);
        $res = $user_info->where(array('account_code'=>$account_code))->save(array(
            'portrait'=>$portrait,
            'nickname'=>$nickname,
            'realname'=>$this->pdata['realname'],
            'phone'=>$this->pdata['phone'],
            'wechat_num'=>$this->pdata['wechat_num'],
            'qq_num'=>$this->pdata['qq_num'],
            'default_garden'=>$this->pdata['default_garden'],
            'birth_year'=>$this->pdata['birth_year'],
            'birth_month'=>$this->pdata['birth_month'],
            'hobby'=>$this->pdata['hobby'],
        ));
        if($res !== false){
            $mongo = new \MongoClient();
            $mongo->baseinfo->user_area->update(array('account_code'=>$account_code),array(
                'portrait'=>$portrait,
                'nickname'=>$nickname,
            ));
            $this->echoEncrypData(0);
        }
        $this->echoEncrypData(1);
    }
    /*
     * 获取我的account_code
     * */
    protected function getMyAcoountCode_v1_0_0(){
        $this->echoEncrypData(0,'',array('account_code'=>$this->account_code));
    }
    /*
     * 获取我的个人资料
     * */
    protected function getMyInfo_v1_0_0(){
        $account_code=$this->account_code;
        $city_id=substr($account_code,0,4);
        $user_info =new Model\UserInfoModel($city_id);
        $data = $user_info->getUserinfo($account_code);
        if(!$data)$this->echoEncrypData(1);
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 上传用户头像 成功后图片路劲已直接写入数据库 返回状态不返回路径
     * */
    protected function uploadUserPortrait_v1_0_0(){
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/Portrait/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,'图片上传失败');
        }
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $path = 'http://39.108.237.198/project/'.$data[0];
        $mongo =new \MongoClient();
        $old_path = $mongo->baseinfo->user_area->findOne(array('account_code'=>$this->account_code),array('portrait'));
        $mongo->baseinfo->user_area->update(array('account_code'=>$this->account_code),array('$set'=>array('portrait'=>$path)));
        $city_id = substr($this->account_code,0,4);
        M()->startTrans();
        $res = M('user_info_'.$city_id)->where(['account_code'=>$this->account_code])->save(['portrait'=>$path]);
        if($res !== false){
            if($old_path['portrait'] !== 'http://39.108.237.198/project/Application/Common/Source/Img/default_portrait.jpg'){
                @unlink($old_path['portrait']);
            }
            M()->commit();
            $this->echoEncrypData(0);
        }else{
            $mongo->baseinfo->user_area->update(array('account_code'=>$this->account_code),array('$set'=>array('portrait'=>$old_path['portrait'])));
            M()->rollback();
            $this->echoEncrypData(1);
        }
    }


    /*
     *  业主认证   表中照片均以json字符串形式传递路劲
     * @param real_name 真实姓名
     * @param phone 手机号码
     * @param room_num 房号
     * @param id_card_num 身份证号码
     * @param id_card_pictures 身份证照片 正反面路劲组成json字符串一起上传
     * @param garden_name 小区名称
     * @param garden_code 小区code 可填 用户若选择检索出的小区则传递其code至后台 否则不传递
     * @param city_id   小区所属城市
     * @param garden_addr   小区详细地址
     * @param garden_picture   小区照片
     * @param picture 合同或房产证照片 可填
     * @param yourself_picture 个人照片 可填
     * */
    protected function ownerApplication_v1_0_0(){
        $res = $this->checkParam(array('real_name','phone','room_num','id_card_num','id_card_pictures','garden_name','city_id','garden_addr','garden_picture'));
        if(!$res)$this->echoEncrypData(21);
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$this->pdata['phone'])){
            $this->echoEncrypData(1,'请输入正确的手机号码');
        }
        if(!preg_match('/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/',$this->pdata['id_card_num'])){
            $this->echoEncrypData(1,'请输入正确的身份证号码');
        }
        $mongo =new \MongoClient();
        if(!$this->pdata['garden_code']){
            $garden = $mongo->baseinfo->garden_area->findOne(array('garden_name'=>$this->pdata['garden_name'],'city_id'=>$this->pdata['city_id']));
            //检索小区表是否存在该小区 不存在则添加到小区表
            if($garden){
                $garden_code = $garden['garden_code'];
            }else{
                $garden_code =$this->createGardenCode($this->pdata['city_id']);
                $mongo->baseinfo->garden_area->insert(array(
                    '_id'=>getNextId($mongo,'baseinfo','garden_code'),
                    'garden_name'=>$this->pdata['garden_name'],
                    'garden_code'=>$garden_code,
                    'city_id'=>$this->pdata['city_id'],
                ));
            }
        }else{
            $garden_code = $this->pdata['garden_code'];
        }
        $city_id = substr($this->account_code,0,4);
        $model = new Model\OwnerApplicationController($city_id); //该记录根据用户所属地区分表
        $res = $model->addApplication(array(
            'user_code'=>$this->account_code,
            'real_name'=>$this->pdata['real_name'],
            'phone'=>$this->pdata['phone'],
            'room_num'=>$this->pdata['room_num'],
            'pictures'=>$this->pdata['pictures'],
            'id_card_num'=>$this->pdata['id_card_num'],
            'id_card_pictures'=>$this->pdata['id_card_pictures'],
            'garden_code'=>$garden_code,
            'garden_name'=>$this->pdata['garden_name'],
            'garden_picture'=>$this->pdata['garden_picture'],
            'city_id'=>$this->pdata['city_id'],
            'garden_addr'=>$this->pdata['garden_addr'],
            'yourself_picture'=>$this->pdata['yourself_picture'],
            'role'=>$this->pdata['relation_name']?2:1,
            'relation_name'=>$this->pdata['relation_name'],
            'status'=>0,
        ));
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }

    /*
     * 业主认证上传图片
     * */
    protected function uploadOwnerApplicationPic_v1_0_0(){
        vendor('UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/OwnerApplication/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,'图片上传失败');
        }
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $this->echoEncrypData(0,'',$data);
    }



    /*
     * 生成小区code
     * */
    public function createGardenCode($city_id){
        for($i=0;$i<=6;$i++){//最多可向后扩展6为数字
            for($j=0;$j<=10 ;$j++){ //连续创建10次失败就扩展1位数
                $code =mt_rand(1,9);//总共生成6位随机字串
                for($k=1;$k <=(5+$i) ;$k++){
                    $code .=mt_rand(0,9);
                }
                $mongo = new \MongoClient();
                $garden_code = $city_id.$code;
                $res = $mongo->baseinfo->garden_area->count(array('garden_code'=>$garden_code));
                if(!$res){
                    return $garden_code;
                }
            }
        }
        return false;
    }

}