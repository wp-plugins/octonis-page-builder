<?php
class modulesModelOct extends modelOct {
    public function get($d = array()) {
        if(isset($d['id']) && $d['id'] && is_numeric($d['id'])) {
            $fields = frameOct::_()->getTable('modules')->fillFromDB($d['id'])->getFields();
            $fields['types'] = array();
            $types = frameOct::_()->getTable('modules_type')->fillFromDB();
            foreach($types as $t) {
                $fields['types'][$t['id']->value] = $t['label']->value;
            }
            return $fields;
        } elseif(!empty($d)) {
            $data = frameOct::_()->getTable('modules')->get('*', $d);
            return $data;
        } else {
            return frameOct::_()->getTable('modules')
                ->innerJoin(frameOct::_()->getTable('modules_type'), 'type_id')
                ->getAll(frameOct::_()->getTable('modules')->alias().'.*, '. frameOct::_()->getTable('modules_type')->alias(). '.label as type');
        }
    }
    public function put($d = array()) {
        $res = new responseOct();
        $id = $this->_getIDFromReq($d);
        $d = prepareParamsOct($d);
        if(is_numeric($id) && $id) {
            if(isset($d['active']))
                $d['active'] = ((is_string($d['active']) && $d['active'] == 'true') || $d['active'] == 1) ? 1 : 0;           //mmm.... govnokod?....)))
           /* else
                 $d['active'] = 0;*/
            
            if(frameOct::_()->getTable('modules')->update($d, array('id' => $id))) {
                $res->messages[] = __('Module Updated', OCT_LANG_CODE);
                $mod = frameOct::_()->getTable('modules')->getById($id);
                $newType = frameOct::_()->getTable('modules_type')->getById($mod['type_id'], 'label');
                $newType = $newType['label'];
                $res->data = array(
                    'id' => $id, 
                    'label' => $mod['label'], 
                    'code' => $mod['code'], 
                    'type' => $newType,
                    'active' => $mod['active'], 
                );
            } else {
                if($tableErrors = frameOct::_()->getTable('modules')->getErrors()) {
                    $res->errors = array_merge($res->errors, $tableErrors);
                } else
                    $res->errors[] = __('Module Update Failed', OCT_LANG_CODE);
            }
        } else {
            $res->errors[] = __('Error module ID', OCT_LANG_CODE);
        }
        return $res;
    }
    protected function _getIDFromReq($d = array()) {
        $id = 0;
        if(isset($d['id']))
            $id = $d['id'];
        elseif(isset($d['code'])) {
            $fromDB = $this->get(array('code' => $d['code']));
            if(isset($fromDB[0]) && $fromDB[0]['id'])
                $id = $fromDB[0]['id'];
        }
        return $id;
    }
}
