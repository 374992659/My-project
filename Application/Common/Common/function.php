<?php

/**
 * @desc 根据两点间的经纬度计算距离
 * @param float $lat 纬度值
 * @param float $lng 经度值
 */
function getDistance($lat1, $lng1, $lat2, $lng2)
{
    $earthRadius = 6367000; //approximate radius of earth in meters

    $lat1 = ($lat1 * pi() ) / 180;
    $lng1 = ($lng1 * pi() ) / 180;

    $lat2 = ($lat2 * pi() ) / 180;
    $lng2 = ($lng2 * pi() ) / 180;

    $calcLongitude = $lng2 - $lng1;
    $calcLatitude = $lat2 - $lat1;
    $stepOne = pow(sin($calcLatitude / 2), 2) + cos($lat1) * cos($lat2) * pow(sin($calcLongitude / 2), 2);
    $stepTwo = 2 * asin(min(1, sqrt($stepOne)));
    $calculatedDistance = $earthRadius * $stepTwo;

    return round($calculatedDistance);
}

/**
 * 是否是微信打开
 * @return boolean
 */
function is_weixin()
{
    return strpos($_SERVER["HTTP_USER_AGENT"], "MicroMessenger") !== false;
}

/**
 * 封装表单验证函数
 */
function form_validate($type='',$data){
    if($data){
        $data=trim($data);
        if($type=='tel'||$type=='phone'){                            //手机号验证
            $pattern='/^1[3|4|5|6|7|8]{1}\d{9}|\d{3}-\d{8}|\d{4}-\d{7}$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='password'||$type=='pwd'){                           //密码数字字母下划线，长度8-18位,字母开头
            $pattern='/^[a-z|A-Z][\w]{7,17}$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='id_card'){                                          //身份证验证
            $pattern='/^\d{15}|\d{18}|\d{14}[x|X]|\d{17}[x|X]$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='email'){                                            //邮箱验证
            $pattern='/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='InterURL'){                                         //域名验证
            $pattern='/^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='real_name'){                                        //姓名验证 长度最少2位，最长12位
            $pattern='/^[\u4e00-\u9fa5]{2,12}$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='nickname'){                                         //昵称验证 中文、数字、下划线、字母均可，长度最少2位，最长12位
            $pattern='/^[\u4e00-\u9fa5]*\w*[\u4e00-\u9fa5]*{2,12}$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='account'){                                     //常用用户名验证，数字、字母，6-12位
            $pattern='^/[a-zA-Z0-9]{6,12}$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='QQ'){                                               //腾讯QQ号从10000开始
            $pattern='/^[1-9][0-9]{4,}$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='zip_code'){                                         //中国邮政编码为6位数字,首位不为0
            $pattern='/^[1-9]\d{5}(?!\d)$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type=='id_address'){                                       //ip地址验证
            $pattern='/^\d+\.\d+\.\d+\.\d+$/';
            return preg_match($pattern,$data)?true:false;
        }elseif($type==''){                                                 //type为空，直接验证data是否为空
            return $data?true:false;
        }
    }else{
        return false;
    }
}


/**
 * 获取插入的sql语句，用于压入redis，对core库
 * @param unknown $table
 * @param unknown $insert_data
 * @return boolean|string
 */
function get_insert_sql($table,$insert_data){
    if (empty($insert_data)){
        return false;
    }
    $keys = "`".join("`,`", array_keys($insert_data))."`";
    $values = "'".join("','", $insert_data)."'";
    $sql = 'insert ignore into '.$table.'('.$keys.') values('.$values.');';
    return $sql;
}
/**
 * 获取更新的sql语句，用于压入redis，对core库
 * @param unknown $table
 * @param unknown $update_data
 * @param unknown $rules
 * @param unknown $and_self
 * @return boolean|string
 */
function get_update_sql($table,$update_data,$rules,$add_self=array()){
    if (empty($update_data) || empty($rules)){
        return false;
    }
    $update = array();
    foreach ($update_data as $k=>$v){
        if ( array_key_exists($k, $add_self) ) {
            if ($add_self[$k] == 'add') {
                $update[] = "`$k`=`$k` + $v";
            } else if ($add_self[$k] == 'minus') {
                $update[] = "`$k`=`$k` - $v";
            } else {
                return false;
            }
        } else {
            $update[] = "`$k`='$v'";
        }
    }
    $where = where($rules);
    $sql = 'update '.$table.' set '.join(',', $update).' where '.$where.';';
    return $sql;
}

/**
 * 获取删除的sql语句，用于压入redis，对core库
 * @param unknown $table
 * @param unknown $rules
 * @return boolean|string
 */
function get_delete_sql($table,$rules){
    if ( empty($rules) ){
        return false;
    }

    $where = where($rules);
    $sql = 'delete from '.$table.' where '.$where.';';
    return $sql;
}


/**
+----------------------------------------------------------
 * 构造sql查询条件
+----------------------------------------------------------
 * @param  array  $rule   数据查询规则
+----------------------------------------------------------
 * @return string
+----------------------------------------------------------
 */
function where($rule)
{
    $where = '';
    if ( isset($rule['exact']) && is_array($rule['exact']) && !empty($rule['exact']) ) {
        foreach ($rule['exact'] as $key => $value) {
            $kv[] = "$key='$value'";
        }
        $where = "( " . implode(' AND ', $kv) . " )";
    }

    if ( isset($rule['other']) && $rule['other']!='' ) {
        $other = "( " . $rule['other'] . " )";
        $where.= $where ? " AND $other " : $other;
    }
    if ( isset($rule['in']) && is_array($rule['in']) && !empty($rule['in']) ) {
        $kv = array();
        foreach ($rule['in'] as $key => $value) {
            if ( is_array($value) ) {
                $kv[] = "$key in (". implode(',', $value) .")";
            }
        }
        $in = "( " . implode(' AND ', $kv) . " )";;
        $where .= $where ? " AND $in " : "";
    }

    return $where;
}


/**
 * 获取当前url
 * @return string
 */
function get_active_url() {
    $url = get_active_host();
    return $url . (isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : urlencode($_SERVER['PHP_SELF']) . '?' . urlencode($_SERVER['QUERY_STRING']));
}

/**
 * 获取当前HOST
 * @param string $need_http	是否需要http
 * @return string
 */
function get_active_host($need_http=true) {
    $url = $need_http ? (isset($_SERVER['REQUEST_SCHEME']) ? $_SERVER['REQUEST_SCHEME'].'://' : 'http://') : '';
    return $url . $_SERVER['HTTP_HOST'] . ( isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT']!='80' && $_SERVER['SERVER_PORT']!='443' ? ':'.$_SERVER['SERVER_PORT'] : '');
}

