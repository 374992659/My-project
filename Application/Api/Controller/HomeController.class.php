<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/11/13
 * Time: 16:17
 */

namespace Api\Controller;


class HomeController extends VersionController
{

    /*
     * 获取首页信息
     * */
    protected function getHomePage_v1_0_0(){
        $account_code=$this->account_code;
        $city_id = substr($this->account_code,0,6);
        $role = M('baseinfo.user_info_'.$city_id)->where('acount_code ='.$account_code)->getField('role');
        $banner  = M('baseinfo.home_banner')->field('id as banner_id,url,picture')->where(['status'=>1])->order('create_time desc')->limit(0,3)->select();//首页轮播图
        $menu = M()->query('select id as menu_id,`name`,picture,url from beseinfo.home_menu where id in (SELECT home_menu from role_menu where role='.$role.') order by id asc');//菜单
        $adverse = M('baseinfo.home_adv')->field('id as adverse_id,title,url')->where(['status'=>1])->order('create_time desc')->limit(0,3)->select();//首页广告
        $ambitus = array();
        $data=array(
            'banner'=>$banner,
            'menu'=>$menu,
            'adverse'=>$adverse,
            'ambitus'=>$ambitus,
        );
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 获取轮播图详情
     * @param banner_id 轮播图id
     * */
    protected function getBannerInfo_v1_0_0(){
        $this->checkParam(array('banner_id'));
        $data = M('baseinfo.home_banner')->where(['id'=>$this->pdata['banner_id']])->find();
        if(!$data)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 获取广告详情
     * @param adverse_id 广告id
     * */
    protected function getAdInfo_v1_0_0(){
        $this->checkParam(array('adverse_id'));
        $data = M('baseinfo.home_adv')->where(['id'=>$this->pdata['adverse_id']])->find();
        if(!$data)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }

}