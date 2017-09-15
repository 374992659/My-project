<?php
/**
 * 接口入口地址、App版本检测、接口分配
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/5
 * Time: 15:54
 */

namespace Api\Controller;


class VersionController extends BaseController
{
    public function _initialize(){
        parent::_initialize();
//        $this->getUserinfo();
        $this->checkLogin();
    }

    public function checkLogin(){
        $phone = $this->phone;
        if(!$phone){
            $this->echoEncrypData(100);
        }
    }


    public function getUserinfo(){
        $account_code = $this->account_code;
        if(!$account_code){//用户丢失account_code，通过openid获取phone以及所在区域
            $data=M('user_area')->field('phone','table_id')->where(array('phone'=>$this->phone))->find();
            if(!$data){          //用户还未进行手机号绑定
                return $this->echoEncrypData(114);
            }else{
                $this->account_code = $data['table_id'].$data['phone'];
                $data['account_code'] = $this->account_code;
                $this->account = $data;
                session('account'.$data['phone'],$this->acount);
            }
        }else{
            $table_id = substr($account_code,0,4);
            $phone = substr($account_code,4);
            $this->acount=array('phone'=>$phone,'table_id'=>$table_id,'openId'=>$this->openId,'account_code'=>$account_code);
            session('account'.$phone,$this->acount);
        }
    }

    /**
     * 唯一入口方法访问
     */
    public function apiPort()
    {
        $service = I('get.service/s');
        if( !$service ){
            return;
        }

        $loc = strpos($service, '_');
        if( !$loc ){
            return;
        }

        $class = substr($service, 0, $loc);  //类名
        $funname = substr($service, $loc+1);  //方法名

        //版本更新与注册设备
        if( $funname == 'checkVersion' ){
            A(ucwords($class))->$funname();
            return;
        }

        $version = str_replace(".","_",$this->nowVersion);

        //版本判断-接口分配
        if( $this->nowVersion == '1.0.1' || $this->nowVersion == '1.0.0' ){
            $version = '1_0_0';
        }
        $this->commonRedirect($class, $funname, $version);
    }
    /**
     * 处理方法调用地址
     * @param $class   类名
     * @param $funname  方法名
     * @param $version  版本处理后字符
     */
    protected function commonRedirect($class, $funname, $version)
    {
        $funname = $funname.'_v'.$version;
        A(ucwords($class))->$funname();
    }

}