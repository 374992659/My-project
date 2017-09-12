<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/6/6
 * Time: 11:22
 */

namespace Common\Lib;


class CommonLib
{
    /**接口日志记录
     * @param $api_key  接口
     * @param $key      标识
     * @param int $type  类型
     * @param string $desc 描述
     * @param string $params 参数（json）
     * @param string $content 详细内容
     */
    public static function logRecord($key, $type=0, $desc='', $params='', $content='', $api_key='')
    {
        G('end');
        $data = array(
            'type'          => $type,
            'key'           => $key,
            'api_key'       => $api_key,
            'params'        => json_encode($params),
            'desc'          => date('y-m-d H:i:s').':'.$desc,
            'content'       => serialize($content),
            'create_time'   => NOW_TIME,
            'implement_time'=> G('begin', 'end', 6),
        );

        M("api_log")->add($data);
    }
}