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
            $mongo->baseinfo->user_area->update(array('account_code'=>$account_code),array('$set'=>array(
                'portrait'=>$portrait,
                'nickname'=>$nickname,
            )));
            $this->echoEncrypData(0);
        }
        $this->echoEncrypData(1);
    }
    /*
     * 获取我的account_code
     * */
    protected function getMyAcoountCode_v1_0_0(){
        $mongo = new \MongoClient();
        $portrait = $mongo->baseinfo->user_area->findOne(array('account_code'=>$this->account_code))['portrait'];
        $this->echoEncrypData(0,'',array('account_code'=>$this->account_code,'portrait'=>$portrait));
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
        unset($data['password'],$data['is_online']);
        if($data['user_garden']){
            $garden_arr = explode(';',$data['user_garden']);
            if(!$garden_arr){
                $garden_arr[]=$data['user_garden'];
            }
            $user_garden = array();
            foreach($garden_arr as $k=>$v){
                $arr = explode(',',$v);
                $user_garden[]=$arr[0];
            }
            $mongo = new \MongoClient();
            $userGarden = $mongo->baseinfo->group_area->find(array('garden_code'=>array('$in'=>$user_garden)));
            $Array= array();
            foreach ($userGarden as $key=>$val){
                $Array[$key]['garden_name']=$val['garden_name'];
                $Array[$key]['garden_code']=$val['garden_code'];
                $Array[$key]['city_id']=$val['city_id'];
            }
            $data['user_garden'] =$Array;
        }
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
            $this->echoEncrypData(1,$upload->getErrorMsg());
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
     * 判断指定小区指定房间是否已有认证
     * @param city_id 城市id
     * @param garden_code 小区code
     * @param room_num 房间号
     * @param role 角色 1：业主 2：租户
     * */
    protected function roomRoleExists_v1_0_0(){
        $this->checkParam(array('city_id','garden_code','room_num','role'));
        $province_id = M('baseinfo.swf_area')->where('id ='.$this->pdata['city_id'])->getField('parent_id');//省份id
        $garden_num= new Model\GardenRoomModel($province_id,$this->pdata['city_id']);
        $count = $garden_num->getRoomRoleNum($this->pdata['garden_code'],$this->pdata['room_num'],$this->pdata['role']);
        !$count?$status=1:$status=0;
        if($count){
            $this->echoEncrypData(1,'该房间已被其他人认证了');
        }
        $this->echoEncrypData(0,'',array('status'=>$status)); //1：还未被认证 2：已有认证
    }

    /*
     *  业主认证   表中照片均以json字符串形式传递路劲
     * @param real_name 真实姓名
     * @param phone 手机号码
     * @param room_num 房号
     * @param id_card_num 身份证号码
     * @param id_card_pictures 身份证照片 正反面路劲组成json字符串一起上传 后面同理
     * @param garden_name 小区名称
     * @param garden_code 小区code 可填 用户若选择检索出的小区则传递其code至后台 否则不传递
     * @param city_id   小区所属城市
     * @param garden_addr   小区详细地址
     * @param garden_picture   小区照片
     * @param picture 合同或房产证照片 可填
     * @param yourself_picture 个人照片 可填
     * */
    protected function ownerApplication_v1_0_0(){
        $this->checkParam(array('real_name','phone','room_num','id_card_num','id_card_pictures','garden_name','city_id','garden_addr','garden_picture'));
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
        $model->startTrans();
        $real_name = $model->where(['city_id'=>$this->pdata['city_id'],'garden_code'=>$this->pdata['garden_code'],'room_num'=>$this->pdata['room_num'],'role'=>1])->getField('real_name');
        if($real_name){
            $name = substr_replace($real_name,'**',1);
            $this->echoEncrypData(1,'该房间已被 '.$name.' 认证了,可联系他添加你哦');
        }
        //1.认证申请库添加数据
        $res1 = $model->addApplication(array(
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
            'role'=>1,
//            'status'=>0,
            'status'=>1,//目前默认通过审核
        ));
        $province_id = M('swf_area')->where('id ='.$this->pdata['city_id'])->getField('parent_id');//省份id
        $class = new RegiestController();
        $class->executeSql('databases.sql',array('city_id'=>$this->pdata['city_id'],'province_id'=>$province_id,'account_code'=>$this->account_code));//用户可能会选择非注册地进行验证，数据库并未创建而连接失败
        $garden_num = new Model\GardenRoomModel($province_id,$this->pdata['city_id']);
        $garden_num->startTrans();
        //2.小区分库garden_room分表添加成员
        $res2 = $garden_num->add(array(
            'city_id'=>$this->pdata['city_id'],
            'garden_code'=>$garden_code,
            'room_num'=>$this->pdata['room_num'],
            'user_code'=>$this->pdata['user_code'],
            'role'=>1,
            'create_time'=>time(),
        ));
        //3.用户信息分表内添加小区记录
        $user_garden = M('user_info_'.$city_id)->where(['account_code'=>$this->account_code])->getField('user_garden');
        if($user_garden){
            $user_garden = $user_garden+';'+$garden_code+','+'1';
        }else{
            $user_garden = $garden_code+','+'1';
        }
        $user_info = M('user_info_'.$city_id);
        $user_info->startTrans();
        $res3 = $user_info->where(['account_code'=>$this->account_code])->save(['user_garden'=>$user_garden]);
        if($res1 and $res2 and $res3){
            $model->commit();
            $garden_num->commit();
            $user_info->commit();
            $this->echoEncrypData(0);
        }else{
            $model->rollback();
            $garden_num->rollback();
            $user_info->rollback();
            $this->echoEncrypData(1);
        }
    }

    /*
     * 业主添加成员
     * @param real_name 真实姓名
     * @param phone 手机号码
     * @param room_num 房间号码
     * @param id_card_num 身份证号码
     * @param garden_code 小区code
     * @param garden_name 小区名称
     * @param city_id 城市id
     * @param relation_name 关系
     * @param id_card_pictures 身份证照片  可填
     * @param yourself_picture 个人照片  可填
     * @param account 添加用户的账户 可填
     * */
    protected function ownerAddNum_v1_0_0(){
        $this->checkParam(array('real_name','phone','room_num','id_card_num','garden_code','garden_name','city_id','relation_name'));
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$this->pdata['phone'])){
            $this->echoEncrypData(1,'请输入正确的手机号码');
        }
        if(!preg_match('/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/',$this->pdata['id_card_num'])){
            $this->echoEncrypData(1,'请输入正确的身份证号码');
        }
        $user_code = '';
        if($this->pdata['account']){
            $mongo = new \MongoClient();
            $user_code = $mongo->baseinfo->user_area->findOne(array('account'=>$this->pdata['account']),array('account_code'));
            if(!$user_code){
                $this->echoEncrypData(1,'请检查输入的用户账号是否正确');
            }
            $user_code = $user_code['account_code'];
        }
        //1.验证操作人的身份
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $model = new Model\OwnerApplicationController($city_id);
        $model->startTrans();
        $role = $model->where(['user_code'=>$account_code,'city_id'=>$this->pdata['city_id'],'garden_code'=>$this->pdata['garden_code'],'room_num'=>$this->pdata['room_num']])->getField('role');
        if(!$role){
            $this->echoEncrypData(1,'只有房主才有此操作权利哦');
        }else{
            if(intval($role)===1){
                $res1 = $model->addApplication(array(
                    'user_code'=>$user_code,
                    'real_name'=>$this->pdata['real_name'],
                    'phone'=>$this->pdata['phone'],
                    'room_num'=>$this->pdata['room_num'],
                    'id_card_num'=>$this->pdata['id_card_num'],
                    'garden_code'=>$this->pdata['garden_code'],
                    'garden_name'=>$this->pdata['garden_name'],
                    'city_id'=>$this->pdata['city_id'],
                    'relation_name'=>$this->pdata['relation_name'],
                    'id_card_pictures'=>$this->pdata['id_card_pictures'],
                    'yourself_picture'=>$this->pdata['yourself_picture'],
                    'role'=>2,
                    'status'=>1,
                ));
                if($user_code){
                    //2.garden_room 分表添加用户数据
                    $province_id = M('swf_area')->where('id='.$this->pdata['city_id'])->getField('parent_id');
                    $garden_num = new Model\GardenRoomModel($province_id,$this->pdata['city_id']);
                    $garden_num->startTrans();
                    $res2 = $garden_num->add(array(
                        'city_id'=>$this->pdata['city_id'],
                        'garden_code'=>$this->pdata['garden_code'],
                        'room_num'=>$this->pdata['room_num'],
                        'user_code'=>$user_code,
                        'role'=>1,
                        'create_time'=>time(),
                    ));
                    //3.用户信息分表内添加小区记录
                    $user_city_id = substr($user_code,0,4);
                    $user_garden = M('user_info_'.$user_city_id)->where(['account_code'=>$user_code])->getField('user_garden');
                    if($user_garden){
                        $user_garden = $user_garden+';'+$this->pdata['garden_code']+','+'1';
                    }else{
                        $user_garden = $this->pdata['garden_code']+','+'1';
                    }
                    $user_info = M('user_info_'.$user_city_id);
                    $user_info->startTrans();
                    $res3 = $user_info->where(['account_code'=>$user_code])->save(['user_garden'=>$user_garden]);
                    if(!$res2 or !$res3){
                        $garden_num->rollback();
                        $model->rollback();
                        $user_info->rollback();
                        $this->echoEncrypData(1);
                    }else{
                        $model->commit();
                        $garden_num->commit();
                        $user_info->commit();
                        $this->echoEncrypData(0);
                    }
                }
                if($res1){
                    $model->commit();
                    $this->echoEncrypData(0);
                }else{
                    $model->rollback();
                    $this->echoEncrypData(1);
                }
            }else{
                $this->echoEncrypData(1,'只有房主才有此操作权利哦');
            }
        }
    }

    /*
     * 业主认证/业主添加成员 上传图片
     * */
    protected function uploadOwnerApplicationPic_v1_0_0(){
        import('Vendor.UploadFile');
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
     * 获取我的业主认证信息
     * */
    protected function getMyOwnerApplicationInfo_v1_0_0(){
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $model = new Model\OwnerApplicationController($city_id);
        $data = $model->where(['user_code'=>$account_code])->order('order by status asc')->select();
        if(!$data){
            $this->echoEncrypData(5);
        }else{
            $this->echoEncrypData(0,'',$data);
        }
    }
    /*
     * 业主获取成员列表
     * */
    protected function getMyOwnRoomNum_v1_0_0(){
        $account_code = $this->account_code;
        //获取通过认证的业主认证
        $city_id = substr($account_code,0,4);
        $model = new Model\OwnerApplicationController($city_id);
        $data = $model->where(['user_code'=>$account_code,'status'=>1])->select();
        $num_list = array();
        if(!$data){
            $this->echoEncrypData(5);
        }else{
            foreach ($data as $k=>$v){
                $num_list[] = $model->field('id as application_id,real_name,relation_name,room_num,garden_code,garden_name')->where(['garden_code'=>$v['garden_code'],'city_id'=>$v['city_id'],'room_num'=>$v['room_num'],'status'=>1])->select();
            }
            $this->echoEncrypData(0,'',$num_list);
        }
    }
    /*
     * 获取成员业主认证详情
     * @param application_id 认证id
     * */
    protected function getMyOwnNumInfo_v1_0_0(){
        $this->checkParam(array('application_id'));
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $model = new Model\OwnerApplicationController($city_id);
        $data = $model->where(['id'=>$this->pdata['application_id']])->find();
        if(!$data){
            $this->echoEncrypData(1);
        }
        $this->echoEncrypData(0,'',$data);
    }

    /*
     * 租户认证
     * @param real_name 真实姓名
     * @param phone 手机号码
     * @param room_num 房号
     * @param id_card_num 身份证号码
     * @param id_card_pictures 身份证照片
     * @param owner_id_card_num 房东身份证号码 可填
     * @param owner_id_card_picture 房东身份证照片 可填
     * @param city_id 小区所在城市
     * @param garden_name 小区名
     * @param garden_code 小区code 可填 用户若选择检索出的小区则传递其code至后台 否则不传递
     * @param garden_addr 楼盘地址
     * @param contract_period 合同期限
     * @param pictures 合同照
     * @param yourself_picture 个人照片 可填
     * */
    protected function tenantApplication_v1_0_0(){
        $this->checkParam(array('real_name','phone','room_num','id_card_num','id_card_pictures','city_id','garden_name','garden_addr','contract_period','pictures'));
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$this->pdata['phone'])){
            $this->echoEncrypData(1,'请输入正确的手机号码');
        }
        if(!preg_match('/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/',$this->pdata['id_card_num'])){
            $this->echoEncrypData(1,'请输入正确的身份证号码');
        }
        if($this->pdata['owner_id_card_num']){
            if(!preg_match('/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/',$this->pdata['owner_id_card_num'])){
                $this->echoEncrypData(1,'请输入正确的身份证号码');
            }
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
        $tenant_application = new Model\TenantApplicationModel($city_id);
        $tenant_application->startTrans();
        $real_name = $tenant_application->where(['city_id'=>$this->pdata['city_id'],'garden_code'=>$this->pdata['garden_code'],'room_num'=>$this->pdata['room_num'],'role'=>1])->getField('real_name');
        if($real_name){
            $name = substr_replace($real_name,'**',1);
            $this->echoEncrypData(1,'该房间已被 '.$name.' 认证了,可联系他添加你哦');
        }
        //1.认证申请库添加记录
        $res1 = $tenant_application->addApplication(array(
            'user_code'=>$this->account_code,
            'real_name'=>$this->pdata['real_name'],
            'phone'=>$this->pdata['phone'],
            'room_num'=>$this->pdata['room_num'],
            'id_card_num'=>$this->pdata['id_card_num'],
            'id_card_pictures'=>$this->pdata['id_card_pictures'],
            'pictures'=>$this->pdata['pictures'],
            'yourself_picture'=>$this->pdata['yourself_picture'],
            'owner_id_card_num'=>$this->pdata['owner_id_card_num'],
            'owner_id_card_picture'=>$this->pdata['owner_id_card_picture'],
            'garden_name'=>$this->pdata['garden_name'],
            'city_id'=>$this->pdata['city_id'],
            'garden_addr'=>$this->pdata['garden_addr'],
            'role'=>1,
            'contract_period'=>$this->pdata['contract_period'],
            'status'=>1,
            'garden_code'=>$garden_code,
        ));
        $province_id = M('baseinfo.swf_area')->where('id ='.$this->pdata['city_id'])->getField('parent_id');//省份id
        $garden_num= new Model\GardenRoomModel($province_id,$this->pdata['city_id']);
        $garden_num->startTrans();
        //2.小区分库garden_room分表添加成员
        $res2 = $garden_num->add(array(
            'city_id'=>$this->pdata['city_id'],
            'garden_code'=>$garden_code,
            'room_num'=>$this->pdata['room_num'],
            'user_code'=>$this->pdata['user_code'],
            'role'=>2,
            'create_time'=>time(),
        ));
         //3.用户user_info分表添加小区记录
        $user_garden = M('user_info_'.$city_id)->where(['account_code'=>$this->account_code])->getField('user_garden');
        if($user_garden){
            $user_garden = $user_garden+';'+$garden_code+','+'1';
        }else{
            $user_garden = $garden_code+','+'1';
        }
        $user_info = M('user_info_'.$city_id);
        $user_info->startTrans();
        $res3 = $user_info->where(['account_code'=>$this->account_code])->save(['user_garden'=>$user_garden]);
        if($res1 and $res2 and $res3){
            $tenant_application->commit();
            $garden_num->commit();
            $user_info->commit();
            $this->echoEncrypData(0);
        }else{
            $tenant_application->rollback();
            $garden_num->rollback();
            $user_info->rollback();
            $this->echoEncrypData(1);
        }
    }
    /*
     * 主租户添加成员
     * @param real_name 真实姓名
     * @param phone 手机号码
     * @param room_num 房间号码
     * @param id_card_num 身份证号码
     * @param garden_code 小区code
     * @param garden_name 小区名称
     * @param city_id 城市id
     * @param relation_name 关系
     * @param contract_period 合同期限
     * @param id_card_pictures 身份证照片  可填
     * @param yourself_picture 个人照片  可填
     * @param account 添加用户的账户 可填
     * */
    protected function tenantAddNum_v1_0_0(){
        $this->checkParam(array('real_name','phone','room_num','id_card_num','garden_code','garden_name','city_id','relation_name','contract_period'));
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$this->pdata['phone'])){
            $this->echoEncrypData(1,'请输入正确的手机号码');
        }
        if(!preg_match('/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/',$this->pdata['id_card_num'])){
            $this->echoEncrypData(1,'请输入正确的身份证号码');
        }
        $user_code = '';
        if($this->pdata['account']){
            $mongo = new \MongoClient();
            $user_code = $mongo->baseinfo->user_area->findOne(array('account'=>$this->pdata['account']),array('account_code'));
            if($user_code){
                $user_code = $user_code['account_code'];
            }
        }
        //验证操作用户权限
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $model = new Model\TenantApplicationModel($city_id);
        $model->startTrans();
        $role = $model->where(['user_code'=>$account_code,'city_id'=>$this->pdata['city_id'],'garden_code'=>$this->pdata['garden_code'],'room_num'=>$this->pdata['room_num']])->getField('role');
        if(!$role){
            $this->echoEncrypData(1,'只有主租户才有此操作权限哦');
        }else{
            if(intval($role) ===1){
                //1.添加认证记录
                $res1 = $model->addApplication(array(
                    'user_code'=>$user_code,
                    'real_name'=>$this->pdata['real_name'],
                    'phone'=>$this->pdata['phone'],
                    'room_num'=>$this->pdata['room_num'],
                    'id_card_num'=>$this->pdata['id_card_num'],
                    'id_card_pictures'=>$this->pdata['id_card_pictures'],
                    'yourself_picture'=>$this->pdata['yourself_picture'],
                    'garden_code'=>$this->pdata['garden_code'],
                    'garden_name'=>$this->pdata['garden_name'],
                    'city_id'=>$this->pdata['city_id'],
                    'relation_name'=>$this->pdata['relation_name'],
                    'contract_period'=>$this->pdata['contract_period'],
                    'role'=>2,
                    'status'=>1,
                ));
                if($user_code){
                    $province_id = M('swf_area')->where('id='.$this->pdata['city_id'])->getField('parent_id');
                    $garden_num = new Model\GardenRoomModel($province_id,$this->pdata['city_id']);
                    $garden_num->startTrans();
                    //2.小区分库garden_room分表添加用户
                    $res2 = $garden_num->add(array(
                        'city_id'=>$this->pdata['city_id'],
                        'garden_code'=>$this->pdata['garden_code'],
                        'room_num'=>$this->pdata['room_num'],
                        'user_code'=>$user_code,
                        'role'=>2,
                        'create_time'=>time(),
                    ));
                    //3.用户信息分表内添加小区记录
                    $user_city_id = substr($user_code,0,4);
                    $user_garden = M('user_info_'.$user_city_id)->where(['account_code'=>$user_code])->getField('user_garden');
                    if($user_garden){
                        $user_garden = $user_garden+';'+$this->pdata['garden_code']+','+'1';
                    }else{
                        $user_garden = $this->pdata['garden_code']+','+'1';
                    }
                    $user_info = M('user_info_'.$user_city_id);
                    $user_info->startTrans();
                    $res3 = $user_info->where(['account_code'=>$user_code])->save(['user_garden'=>$user_garden]);
                    if(!$res2 || !$res3){
                        $garden_num->rollback();
                        $model->rollback();
                        $user_info->rollback();
                        $this->echoEncrypData(1);
                    }else{
                        $model->commit();
                        $garden_num->commit();
                        $user_info->commit();
                        $this->echoEncrypData(0);
                    }
                }
                if($res1){
                    $model->commit();
                    $this->echoEncrypData(0);
                }else{
                    $model->rollback();
                    $this->echoEncrypData(1);
                }
            }else{
                $this->echoEncrypData(1,'只有主租户才有此操作权限哦');
            }
        }
    }
    /*
     *  租户认证/主租户添加成员 上传图片
     * */
    protected function uploadTenantApplicationPic_v1_0_0(){
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/TenantApplication/'.date(m).date(d).'/';
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
     * 获取我的租户认证信息
     * */
    protected function getMyTenantApplicationInfo_v1_0_0(){
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $model = new Model\TenantApplicationModel($city_id);
        $data = $model->where(['user_code'=>$account_code])->order('order by status asc')->select();
        if(!$data){
            $this->echoEncrypData(5);
        }else{
            $this->echoEncrypData(0,'',$data);
        }
    }
    /*
     * 主租户获取成员列表
     * */
    protected function getMyTenantRoomNum_v1_0_0(){
        $account_code = $this->account_code;
        //获取通过认证的业主认证
        $city_id = substr($account_code,0,4);
        $model = new Model\TenantApplicationModel($city_id);
        $data = $model->where(['user_code'=>$account_code,'status'=>1])->select();
        $num_list = array();
        if(!$data){
            $this->echoEncrypData(5);
        }else{
            foreach ($data as $k=>$v){
                $num_list[] = $model->field('id as application_id,real_name,relation_name,room_num,garden_code,garden_name')->where(['garden_code'=>$v['garden_code'],'city_id'=>$v['city_id'],'room_num'=>$v['room_num'],'status'=>1])->select();
            }
            $this->echoEncrypData(0,'',$num_list);
        }
    }
    /*
     * 获取租户认证详情
     * @param application_id 认证id
     * */
    protected function getTenantNumInfo_v1_0_0(){
        $this->checkParam(array('application_id'));
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $model = new Model\OwnerApplicationController($city_id);
        $data = $model->where(['id'=>$this->pdata['application_id']])->find();
        if(!$data){
            $this->echoEncrypData(1);
        }
        $this->echoEncrypData(0,'',$data);
    }

    /*
     * 获取小区通知
     * */
    protected function getMyGardenMessage_v1_0_0(){
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $user_garden = M('user_info_'.$city_id)->where(['account_code'=>$this->account_code])->getField('user_garden');
        if(!$user_garden){
            $this->echoEncrypData(5);
        }else{
            $garden_arr=explode(';',$user_garden);
            if(!$garden_arr){
                $garden_arr[]=$user_garden;
            }
            $result = array();
            foreach ($garden_arr as $k=>$v){
                $arr=explode(',',$v);
                $result[]=$arr[0];
            }
            if($result){
                $message = array();
                $mongo = new \MongoClient();
                foreach ($result as $key=>$val){
                    $garden_city_id = $mongo->baseinfo->garden_area->findOne(array('garden_code'=>$val))['city_id'];
                    $garden_province_id = M('swf_area')->where(['id'=>$garden_city_id])->getField('parent_id');
                    $model = new Model\GardenMessageModel($garden_province_id,$garden_city_id);
                    $message[$val] = $model->where(['garden_code'=>$val])->select();
                }
                $this->echoEncrypData(0,'',$message);
            }else{
                $this->echoEncrypData(5);
            }
        }
    }
    /*
     * 发表小区意见
     *@param garden_code 小区code
     *@param garden_name 小区名
     *@param title 名称
     *@param content 意见内容
     *@param picture 意见图片 可填
     * */
    protected function addGardenMessage_v1_0_0(){
        $this->checkParam(array('garden_code','garden_name','title','content'));
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $user_info = M('user_info_'.$city_id)->field('user_garden,nickname,portrait')->where(['account_code'=>$account_code])->getField('user_garden');
        if(!$user_info['user_garden']){
            $this->echoEncrypData(1,'您还没有认证通过的小区');
        }else{
            $garden_arr = explode(';',$user_info['user_garden']);
            if(!$garden_arr){
                $garden_arr[] = $user_info['user_garden'];
            }
            $result = array();
            foreach ($garden_arr  as $k=>$v){
                $arr = explode(',',$v);
                $result[] = $arr[0];
            }
            if(!in_array($this->pdata['garden_code'],$result)){
                $this->echoEncrypData(1,'您没有通过该小区的认证哦');
            }
            $mongo  = new \MongoClient();
            $garden_city_id = $mongo->baseinfo->garden_area->findOne(array('garden_code'=>$this->pdata['garden_code']))['city_id'];
            $garden_province_id = M('swf_area')->where(['id'=>$garden_city_id])->getField('parent_id');
            $garden_message = new Model\GardenMessageModel($garden_province_id,$garden_city_id);
            $res = $garden_message->add(array(
                'title'=>$this->pdata['title'],
                'content'=>$this->pdata['content'],
                'picture'=>$this->pdata['picture'],
                'garden_code'=>$this->pdata['garden_code'],
                'garden_name'=>$this->pdata['garden_name'],
                'user_code'=>$this->account_code,
                'nickname'=>$user_info['nickname'],
                'portrait'=>$user_info['portrait'],
                'create_time'=>time(),
                'status'=>1,
            ));
            if(!$res)$this->echoEncrypData(1);
            $this->echoEncrypData(0);
        }
    }

    /*
     * 获取小区意见列表
     * */
    protected function getGardenMessageList_v1_0_0(){
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $user_garden = M('user_info_'.$city_id)->where(['account_code'=>$account_code])->getField('user_garden');
        if(!$user_garden){
            $this->echoEncrypData(1,'暂无认证通过的小区');
        }else{
            $garden_arr = explode(';',$user_garden);
            if(!$garden_arr){
                $garden_arr = $user_garden;
            }
            $result = array();
            foreach ($garden_arr as $k=>$v){
                $arr = explode(',',$v);
                $result[] = $arr[0];
            }
        }
        $list = array();
        $mongo =new \MongoClient();
        foreach ($result as $key=>$val){
            $garden_city_id =$mongo->baseinfo->garden_area->findOne(array('garden_code'=>$val))['city_id'];
            $garden_province_id = M('swf_area')->where(['id'=>$garden_city_id])->getField('parent_id');
            $garden_message = new Model\GardenMessageModel($garden_province_id,$garden_city_id);
            $garden_message = $garden_message->where(['garden_code'=>$val,'user_code'=>$this->account_code])->select();
            if($garden_message){
                $list[] = $garden_message;
            }
        }
        $new_arr = array();
        if($list){
            foreach ($list as $kk=>$vv){
                foreach ($v as $kkk=>$vvv){
                    $new_arr[]= $vvv;
                }
            }
        }
        if($new_arr){
            $list = self::multi_array_sort($list,'create_time',SORT_DESC);
            $this->echoEncrypData(0,$list);
        }else{
            $this->echoEncrypData(5);
        }
    }
    /*
     * 获取小区意见详情
     * @param id 意见id
     * @param garden_code 小区code
     * */
    protected function getGardenMessageInfo_v1_0_0(){
        $this->checkParam(array('id','garden_code'));
        $mongo = new \MongoClient();
        $garden_city_id = $mongo->baseinfo->garden_area->findOne(array('garden_code'=>$this->pdata['garden_code']))['city_id'];
        $garden_province_id = M('swf_area')->where(['id'=>$garden_city_id])->getField('parent_id');
        $model = new Model\GardenMessageModel($garden_province_id,$garden_city_id);
        $data = $model->where(['id'=>$this->pdata['id']])->find();
        if(!$data){
            $this->echoEncrypData(1);
        }else{
            $this->echoEncrypData(0,'',$data);
        }
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

    /*
     * 二维数组排序
     * */
    public static function multi_array_sort($multi_array,$sort_key,$sort=SORT_ASC){
        if(is_array($multi_array)){
            foreach ($multi_array as $row_array){
                if(is_array($row_array)){
                    $key_array[] = $row_array[$sort_key];
                }else{
                    return false;
                }
            }
        }else{
            return false;
        }
        array_multisort($key_array,$sort,$multi_array);
        return $multi_array;
    }

}