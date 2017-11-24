<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/23
 * Time: 9:58
 */

namespace Api\Controller;


class ChatMessageController extends VersionController
{
    /*
     * 好友语音/文件/图片消息上传
     * */
    protected function uploadFriendsFile_v1_0_0(){
        if(intval($_GET['is_wap'])!==1){
            $a = $this->pdata['imageData'];
            if ( empty($a) ) return $this->echoEncrypData(1,'没有文件被选中');
            $save_path= APP_PATH.'Common/Upload/File/Friends/'.date(m).date(d).'/';
            if($this->pdata['type']==='voice'){
                $save_path= APP_PATH.'Common/Upload/File/Friends/Voice/'.date(m).date(d).'/';
            }
            $res = $this->uploadAppImg($save_path,$a);
            if($res){
                $this->echoEncrypData(0,'',$res);
            }else{
                $this->echoEncrypData(1,'图片上传失败');
            }
        }else{
            import('Vendor.UploadFile');
            $upload =new \UploadFile();
            $path=APP_PATH.'Common/Upload/File/Friends/'.date(m).date(d).'/';
            $res = $upload->upload($path);
            if(!$res){
                $this->echoEncrypData(1,$upload->getErrorMsg());
            }
            foreach($res as $k=>$v){
                $data[]=$res[$k]['savepath'].$res[$k]['savename'];
            }
            $this->echoEncrypData(0,'',$data);
        }

    }
    /*
     * 群语音文件上传
     * */
    protected function uploadGroupVoiceFile_v1_0_0(){
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/Voice/GroupVoice/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,$upload->getErrorMsg());
        }
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 群文件上传
     * */
    protected function uploadGroupFile_v1_0_0(){
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/File/Group/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,$upload->getErrorMsg());
        }
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $this->echoEncrypData(0,'',$data);
    }

}