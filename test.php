<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/13
 * Time: 11:33
 */
//$m =new MongoClient();
//$db = $m->local;
//$collection = $db->test;
//$collection->update(array('name'=>3444),array('$set'=>array('value'=>666,'seven'=>777)));


vendor('phpqrcode.phpqrcode');
$object = new \QRcode();
$url = 'http://blog.csdn.net/zhihua_w';
//容错级别
$errorCorrectionLevel = 'L';
//生成图片大小
$matrixPointSize = 6;
//生成一个二维码图片
$object->png($url, 'zhihua_w.png', $errorCorrectionLevel, $matrixPointSize, 2);
var_dump($object);
