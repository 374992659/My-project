<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/1
 * Time: 17:49
 */
/*
 * 对象转换数组
 * */
function object2array($object) {
    if (is_object($object)) {
        foreach ($object as $key => $value) {
            $array[$key] = $value;
        }
    }
    else {
        $array = $object;
    }
    return $array;
}
/*
 * 数组转换对象
 * */
function array2object($array) {
    if (is_array($array)) {
        $obj = new StdClass();
        foreach ($array as $key => $val){
            $obj->$key = $val;
        }
    }
    else { $obj = $array; }
    return $obj;
}
/**
 * 生成随机字符串
 * @param int       $length  要生成的随机字符串长度
 * @param string    $type    随机码类型：0，数字+大写字母；1，数字；2，小写字母；3，大写字母；4，特殊字符；-1，数字+大小写字母+特殊字符
 * @return string
 */
function randCode($length = 5, $type = 0) {
    $arr = array(1 => "0123456789", 2 => "abcdefghijklmnopqrstuvwxyz", 3 => "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4 => "~@#$%^&*(){}[]|");
    if ($type == 0) {
        array_pop($arr);
        $string = implode("", $arr);
    } else if ($type == "-1") {
        $string = implode("", $arr);
    } else {
        $string = $arr[$type];
    }
    $count = strlen($string) - 1;
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $str[$i] = $string[rand(0, $count)];
        $code .= $str[$i];
    }
    return $code;
}

/*
 * 发送远程post请求
 * */
function chttpPost($url = '', $postData = '', $options = array())
{
    if (is_array($postData)) {
        $postData = http_build_query($postData);
    }
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30); //设置cURL允许执行的最长秒数
    if (!empty($options)) {
        curl_setopt_array($ch, $options);
    }
    //https请求 不验证证书和host
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

/*
 * 获取mongodb数据库中表的主键
 * */
function getNextId($mongo,$dbName,$collectionName,$param=array()){

    $param += array(   //默认ID从1开始,间隔是1
        'init' => 1,
        'step' => 1,
    );

    $update = array('$inc'=>array('id'=>$param['step']));   //设置间隔
    $query = array('name'=>$collectionName);
    $command = array(
        'findandmodify' => 'counters',
        'update' => $update,
        'query' => $query,
        'new' => true
    );

    $id = $mongo->$dbName->command($command);
    if (isset($id['value']['id'])) {
        return $id['value']['id'];
    }else{
        $mongo->$dbName->insert(array(
            'name' => $collectionName,
            'id' => $param['init'],     //设置ID起始数值
        ));
        return $param['init'];
    }
}


