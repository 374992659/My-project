<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/15
 * Time: 9:23
 */

namespace Api\Controller;
use Api\Model;
use app\Api\controller\Base;

class WxRegiestController extends BaseController
{
    /*
     * 微信版-用户绑定手机号
    * @param phone 手机号
    * @param area_id 区域id
     * */
    public function wxBindPhone(){
        $phone = $this->pdata['phone'];
        $openId = $this->openId;
//        if( !form_validate('phone',trim($phone))){
//            $this->echoEncrypData(106);
//        }
        $wx =session('wxdata'.$openId);
        var_dump($wx) ;die;
        $table_id = $this->pdata['area_id'];
        if(!$phone || !$openId || !$table_id){
            $this->echoEncrypData(21);
        }
        $model=new Model\UserAreaModel();
        $res=$model->addUserArea($openId,$phone,$table_id,$this->errmsg);
        if(!$res){
            $this->echoEncrypData(1,$this->errmsg);
        }else{
            $this->autoBuildDatabase($phone);
            $this->echoEncrypData(0);
        }
    }

    /*
     * 获取全国区域数组
     * */
    public function getAreaArr(){
        $model=new Model\UserAreaModel();
        $res=$model->getArea();
        $this->echoEncrypData(0,'',$res);
    }
}